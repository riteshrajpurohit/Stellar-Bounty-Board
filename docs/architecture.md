# Architecture & Technical Design — Stellar Bounty Board

## System Overview

Stellar Bounty Board is a three-layer application:

```
┌────────────────────────────────────────────────────────────────┐
│                      React 19 Frontend                         │
│  (Vite · Tailwind CSS v4 · Radix UI · @tanstack/react-query)   │
└────────────────────┬──────────────────────┬────────────────────┘
                     │ REST / Realtime       │ XDR / Horizon API
          ┌──────────▼──────────┐  ┌────────▼──────────────────┐
          │   Supabase (Postgres)│  │  Stellar Horizon Testnet  │
          │   + Row Level Security│  │  horizon-testnet.stellar.org│
          └─────────────────────┘  └───────────────────────────┘
```

---

## Component Architecture

### Frontend Layer

```
src/
├── pages/           # Route-level pages (Home, Dashboard, Marketplace, BountyDetail)
├── components/      # Reusable UI components
│   └── ui/          # Primitive components (Button, Card, Toast, Input…)
├── hooks/           # Data-fetching + state hooks
│   ├── useBounties.ts
│   ├── useCreateBounty.ts
│   ├── useSubmissions.ts
│   ├── useSubmissionActions.ts
│   ├── usePayout.ts
│   └── useWallet.ts
├── lib/
│   ├── bounty.ts          # Supabase CRUD for bounties
│   ├── submission.ts      # Supabase CRUD for submissions + payouts
│   ├── stellar/payments.ts # Stellar SDK transaction builder
│   └── validation/        # Zod schemas + unit tests
└── types/                  # TypeScript + Supabase-generated types
```

---

## Data Layer — Supabase (Postgres)

### Tables

```sql
profiles            -- wallet_address (PK), name, email, bio
bounties            -- id, creator_wallet (FK→profiles), title, reward_amount, status, deadline
bounty_submissions  -- id, bounty_id (FK→bounties), submitter_wallet (FK→profiles), notes, status
payout_transactions -- id, bounty_id, winner_wallet, tx_hash, amount, status
```

### Row Level Security

All tables have RLS enabled. Current policies allow public reads and authenticated writes (via anon key). No wallet-level auth enforcement on the database layer — security is enforced by the React logic requiring a valid connected wallet before write operations.

### State Management

All data fetching goes through `@tanstack/react-query`. On mutation success (create bounty, approve submission, etc.), the relevant query cache keys are **invalidated** to force a fresh fetch:

```
queryClient.invalidateQueries({ queryKey: ['bounties'] });
queryClient.invalidateQueries({ queryKey: ['submissions', bountyId] });
queryClient.invalidateQueries({ queryKey: ['payouts', bountyId] });
```

---

## Wallet Layer — Freighter API v6

### Connection Flow

```
useWallet.connect()
  └─ isConnected()             ← Check if Freighter is installed
  └─ setAllowed()              ← Request permission
  └─ requestAccess()           ← Get wallet address
  └─ getNetworkDetails()       ← Verify testnet
  └─ setWallet(state)          ← React state update
```

### State Persistence

Freighter persists the session in its internal extension store. On page reload, `isAllowed()` returns `true` and the address is re-fetched — no need for local storage.

---

## Transaction Flow — Payout

This is the most critical path in the application:

```
Step 1: Creator clicks "Approve & Pay Award"
   │
Step 2: createAndSendPayment() builds unsigned Transaction
   │   └─ server.loadAccount(creatorWallet)  → fetch sequence number from Horizon
   │   └─ TransactionBuilder → .addOperation(payment) → .build()
   │
Step 3: tx.toXDR() → serialise to base64 XDR string
   │
Step 4: signTransaction(xdr, { networkPassphrase: TESTNET })
   │   └─ Freighter popup appears → user approves (or rejects)
   │   └─ Returns { signedTx: string }  (Freighter v6 API)
   │
Step 5: TransactionBuilder.fromXDR(signedTx) → deserialise
   │   └─ server.submitTransaction(tx)  → POST to Horizon
   │
Step 6: On success: submitResult.hash → tx_hash string
   │
Step 7: insertPayoutRecord({ bounty_id, winner_wallet, tx_hash, amount })
   │
Step 8: reviewSubmission (status = 'approved')
   │
Step 9: updateBountyStatus(bountyId, 'awarded')
   │
Step 10: queryClient.invalidateQueries → UI refreshes
```

> **Critical ordering:** Steps 7–9 only execute AFTER Step 6 confirms `submitResult.successful === true`. If the user rejects in Step 4 or Horizon returns an error in Step 5, the database is never mutated.

### Error Handling Matrix

| Error Type | Detection | User Message |
|------------|-----------|-------------|
| Freighter not installed | `isConnected()` returns false | "Opening install page…" |
| User rejects request access | `requestAccess().error` | "Connection was cancelled" |
| User rejects TX signing | Freighter throws / `signedResponse.error` | "Transaction rejected in Freighter" |
| Insufficient XLM balance | Horizon `op_underfunded` result code | "Insufficient XLM balance. Fund at friendbot" |
| Invalid destination wallet | Horizon `op_no_destination` | "Recipient wallet does not exist on network" |
| Network failure | `try/catch` around `server.loadAccount` | "Could not reach Stellar testnet" |

---

## Security Model

| Concern | Mitigation |
|---------|-----------|
| Input validation | Zod schemas on all form submissions |
| SQL injection | Supabase parameterised query client |
| Wallet spoofing | Wallet address comes from Freighter (not user input) |
| Transaction manipulation | Freighter signs only the XDR built by the app — user sees exact amount & destination |
| Double approval | Approve button disabled once `payoutStatus !== 'idle'` |
| RLS | All Supabase tables have Row Level Security enabled |

---

## Sequence Diagram — Full Bounty Lifecycle

```
Creator                  App                    Supabase              Stellar Horizon
   │                      │                        │                        │
   │──connect wallet──────►│                        │                        │
   │◄─address returned─────│                        │                        │
   │──create profile───────►│──upsert profiles───────►│                        │
   │──create bounty────────►│──insert bounties────────►│                        │
   │                        │                        │                        │
Contributor                 │                        │                        │
   │──browse marketplace────►│──select bounties────────►│                        │
   │◄─bounty list───────────│◄─rows returned──────────│                        │
   │──submit work──────────►│──insert submissions──────►│                        │
   │                        │                        │                        │
Creator                     │                        │                        │
   │──review submissions────►│──select submissions──────►│                        │
   │──approve winner────────►│──build payment tx───────────────────────────────►│
   │                        │──sign via Freighter─────◄wallet popup              │
   │                        │──submitTransaction──────────────────────────────►│
   │                        │◄──tx_hash───────────────────────────────────────│
   │                        │──insert payout_transactions►│                        │
   │                        │──update submissions.status─►│                        │
   │                        │──update bounties.status─────►│                        │
   │◄─success toast─────────│                        │                        │
```
