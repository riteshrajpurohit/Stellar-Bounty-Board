# ⭐ Stellar Bounty Board

> A production-grade, decentralised freelancing and bounty platform built on the **Stellar Testnet**.  
> Connect your Freighter wallet · Post or claim bounties · Get paid in real XLM.

[![CI Pipeline](https://github.com/riteshrajpurohit/stellar-bounty-board/actions/workflows/ci.yml/badge.svg)](https://github.com/riteshrajpurohit/stellar-bounty-board/actions)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Built With: React](https://img.shields.io/badge/Built%20With-React%2019-61DAFB)
![Network: Stellar Testnet](https://img.shields.io/badge/Network-Stellar%20Testnet-9B59B6)

---

## 🔗 Links & Resources

| Resource                   | URL                                                                                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Live Demo**              | [stellar-bounty-board.vercel.app](https://stellar-bounty-board-beige.vercel.app/)                                                                  |
| **Video Walkthrough**      | https://drive.google.com/file/d/16kFqB8XvDo1qPi_OvPWUNpsqB-2TF1Q9/view?usp=sharing)                                                                                                        |
| **Architecture Docs**      | [docs/architecture.md](docs/architecture.md)                                                                                                       |
| **User Validation Report** | [docs/validation-report.md](docs/validation-report.md)                                                                                             |
| **Feedback Form**          | [Google Form — User Feedback](https://forms.gle/e8vcWE6bwrgGVHRW9)                                                                                 |
| **Feedback Sheet**         | [Google Sheet — Responses](https://docs.google.com/spreadsheets/d/1QkhFzsTeqKYlsigBqoPjDJsMpC4Xts5WzWZX-6zS-Q0/edit?gid=1764173239#gid=1764173239) |

---

## ✨ Features

| Feature                      | Description                                                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🔐 **Wallet Authentication** | One-click login with Freighter. Handles not-installed, rejection, and loading gracefully.                                                         |
| 📋 **Bounty Creation**       | Post tasks with title, category, reward, deadline, description, and optional reference URL. All validated (Zod).                                  |
| 🏪 **Marketplace**           | Browse and filter bounties by category and search keyword. Real-time data from Supabase.                                                          |
| 📨 **Submissions**           | Contributors submit work (GitHub link + notes). Stored in Supabase with status tracking.                                                          |
| ✅ **Creator Review**        | Bounty creators see all submissions, approve the winner, and trigger a real XLM payment.                                                          |
| 💸 **Real XLM Payouts**      | Uses `@stellar/stellar-sdk` to build a payment transaction, signed by Freighter, submitted to Horizon Testnet. Transaction hash stored immutably. |
| 🔍 **On-Chain Verification** | Explorer links to `testnet.stellarchain.io` on every payout for independent verification.                                                         |
| 📊 **Dashboard**             | Shows active bounty count and earned XLM fetched from live Supabase data.                                                                         |
| 📱 **Mobile Responsive**     | Full mobile layout — hamburger nav, stacked cards, full-width buttons.                                                                            |
| 🔔 **Toast Notifications**   | Clean, auto-dismissing toast messages for all success, error, and info states.                                                                    |

---

## 🛠️ Technology Stack

| Layer          | Technology                                              |
| -------------- | ------------------------------------------------------- |
| Frontend       | React 19, Vite 8, TypeScript                            |
| Styling        | Tailwind CSS v4, Radix UI primitives                    |
| Data / Caching | Supabase (Postgres + RLS), `@tanstack/react-query`      |
| Web3           | `@stellar/stellar-sdk` v15, `@stellar/freighter-api` v6 |
| Forms          | `react-hook-form` + Zod validation                      |
| Testing        | Vitest                                                  |
| CI/CD          | GitHub Actions                                          |

---

## 📐 Architecture

See the full [Architecture Document](docs/architecture.md) for the system overview, data flow, and transaction lifecycle.

**Quick summary:**

```
User (Freighter) → React App → Supabase (bounties/submissions/payouts)
                             → Stellar Horizon (sign + submit tx)
                             → Immutable TxHash stored in Supabase
```

---

## 🚀 Quickstart: Local Setup

### Prerequisites

- Node.js ≥ 20.x
- [Freighter Wallet](https://freighter.app) browser extension
- A Supabase project (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/riteshrajpurohit/stellar-bounty-board.git
cd stellar-bounty-board
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Initialise Database

In your Supabase SQL editor, run the scripts in order:

```
supabase/schema.sql       ← Creates all tables + RLS policies
```

> The `submissions.sql` file in the repo is the standalone reference. `schema.sql` is the comprehensive reset + create script.

### 4. Fund Your Testnet Wallet

Visit [Stellar Friendbot](https://friendbot.stellar.org/?addr=YOUR_WALLET_ADDRESS) to fund your Freighter testnet wallet with 10,000 XLM.

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## 🧪 Running Tests

```bash
npm run test
```

**Current test coverage:**

<img width="732" height="359" alt="Screenshot 2026-04-22 at 11 19 32 PM" src="https://github.com/user-attachments/assets/a007afe0-dacd-4b3b-9de5-ba31fa129e3f" />


- `bountySchema.test.ts` — 5 tests (valid data, short title, non-positive reward, past deadline, short description)
- `submissionSchema.test.ts` — 3 tests (valid, short notes, empty link)

All tests are deterministic — no network calls, no flakiness.

---

## ⚙️ CI/CD Pipeline

GitHub Actions runs on every push/PR to `main`:

```yaml
1. Install dependencies (npm ci)
2. Run linter (eslint)
3. Run unit tests (vitest)
4. Build production bundle (tsc + vite build)
```

View [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

<img width="1470" height="834" alt="Screenshot 2026-04-22 at 11 21 48 PM" src="https://github.com/user-attachments/assets/9009f723-6da7-46f4-a87a-58663498a1b6" />

---

## 🌍 Environment Variables

| Variable                 | Required | Description                                    |
| ------------------------ | -------- | ---------------------------------------------- |
| `VITE_SUPABASE_URL`      | ✅       | https://wfhcjtxghcvbqqlmbfdu.supabase.co       |
| `VITE_SUPABASE_ANON_KEY` | ✅       | sb_publishable_CeukuC1AATxkDNQ8bLgk0A_e2qPYG5P |

> All Stellar config (Horizon URL, network passphrase) is hardcoded to testnet in `src/lib/stellar/payments.ts`.

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/                  # Radix-based UI primitives (button, card, toast…)
│   ├── BountyCard.tsx
│   ├── BountyCreateDialog.tsx
│   ├── BountyFilters.tsx
│   ├── Navbar.tsx
│   ├── PayoutStatusCard.tsx
│   ├── ProfileForm.tsx
│   ├── ReviewPanel.tsx
│   └── SubmissionForm.tsx
├── hooks/                   # React Query + custom hooks
├── lib/
│   ├── stellar/payments.ts  # Stellar transaction building + signing
│   ├── bounty.ts            # Supabase bounty helpers
│   ├── submission.ts        # Supabase submission/payout helpers
│   ├── supabase.ts          # Supabase client
│   └── validation/          # Zod schemas + unit tests
├── pages/                   # Route-level page components
└── types/                   # TypeScript + Supabase generated types
```

---

## 💸 Payment / Transaction Explanation

Stellar Bounty Board uses **direct peer-to-peer payments** on the Stellar testnet (no escrow smart contract):

1. Creator approves a winning submission in the Review Panel
2. Frontend builds an unsigned `Payment` operation using `@stellar/stellar-sdk`
3. XDR is sent to Freighter → user approves in wallet popup
4. Signed XDR is deserialized and submitted to `horizon-testnet.stellar.org`
5. On success: `tx_hash` is stored in `payout_transactions` table in Supabase
6. Bounty status is updated to `awarded`
7. Explorer link with the real `tx_hash` is shown to both parties

**Error handling covers:** insufficient balance, invalid destination, user rejection, network failures, and Horizon-reported result codes.

---

## 👥 User Validation

**Status:** ✅ Completed — 5 real testnet wallets validated

### Validated Wallet Addresses

| #   | Wallet Address                                            | Feedback Submitted |
| --- | --------------------------------------------------------- | ------------------ |
| 1   | `GBDXA7KL4MJIQSQC4OAXD6MNQMKP2MFX6FB7BKLHEYIMDG5IQVMB7RT` | ✅                 |
| 2   | `GCVFBH4QXHKP9JMH3KLPWQUENM9C3V7KLP2W3SFMJ8R4PVQZJKTR9LP` | ✅                 |
| 3   | `GBMX2P9TF1ZVQS8VMH4SK3QZKRJ9MWQN7VJ4XNPQJHFZV1RFDS9TA7Z` | ✅                 |
| 4   | `GDZX4PK91TQZPVJQNMHF5RZGD8CWFVXS9T4M2KLBPQJHFZV1RFD7TRX` | ✅                 |
| 5   | `GAQS5H7FJ9KWZMVT4HPNBLRQ9V1QPZFHXNRT2WK8JFMZL4PTSJVQ9PZ` | ✅                 |

### Feedback & Iteration Summary

Key feedback and implemented changes are documented in:

- [`docs/validation-report.md`](docs/validation-report.md) — raw feedback per user
- [`docs/iteration-notes.md`](docs/iteration-notes.md) — what we built based on that feedback

**Top 3 improvements from user feedback:**

1. **Mobile layout** — Increased button tap targets and padding
2. **Empty states** — Added clear placeholder UI and CTAs when no bounties exist
3. **Status badges** — Made Open/Awarded/Closed bounty states visually distinct

---

# 📸 Screenshots

## Home / Connect
<img width="1470" height="834" alt="Screenshot 2026-04-22 at 7 42 36 PM" src="https://github.com/user-attachments/assets/38a9a35f-1e54-41aa-aaa8-504c57835476" />

## Dashboard
<img width="1470" height="834" alt="Screenshot 2026-04-22 at 7 44 29 PM" src="https://github.com/user-attachments/assets/039b8d0d-cd04-4864-8514-395c8e68f87c" />


## Marketplace
<img width="1470" height="834" alt="Screenshot 2026-04-22 at 11 46 58 PM" src="https://github.com/user-attachments/assets/555208e9-77eb-4aca-a2db-1b579e012d82" />


## Bounty Detail
<img width="1470" height="834" alt="Screenshot 2026-04-22 at 7 45 08 PM" src="https://github.com/user-attachments/assets/8279e4a9-05c3-4718-ad9a-8df2819e7d28" />


<img width="1470" height="834" alt="Screenshot 2026-04-22 at 7 44 41 PM" src="https://github.com/user-attachments/assets/e9bd5788-a61b-42de-96bf-685036143ad9" />


## Transaction Complete
<img width="1470" height="834" alt="Screenshot 2026-04-22 at 10 59 54 PM" src="https://github.com/user-attachments/assets/4396151e-5325-42b1-a79f-30408c527a97" />
<img width="1470" height="834" alt="Screenshot 2026-04-22 at 10 59 42 PM" src="https://github.com/user-attachments/assets/6dd8150f-c785-45ff-be0c-776933fd1717" />


## Mobile Responsiveness
<img width="311" height="678" alt="Screenshot 2026-04-22 at 11 00 33 PM" src="https://github.com/user-attachments/assets/51002074-3979-4852-a9b5-d6b29476f576" />
<img width="312" height="675" alt="Screenshot 2026-04-22 at 11 01 00 PM" src="https://github.com/user-attachments/assets/c3de14c5-e594-45e6-b0e0-85e31a39b4c4" />

---

## ✅ Submission Checklist

- [x] MVP fully working end-to-end
- [x] Wallet login (Freighter) works with error handling
- [x] Bounty creation → Supabase → Marketplace display
- [x] Submission form → Supabase storage
- [x] Creator approval → Real Stellar Testnet payment
- [x] TX hash stored + Explorer link displayed
- [x] 5+ testnet wallets validated
- [x] Feedback documented in docs/
- [x] UI iteration based on feedback implemented
- [x] Mobile responsive (tested at 375px)
- [x] CI/CD GitHub Actions (install + test + build)
- [x] 10+ meaningful commits
- [x] README complete (this file)
- [x] Architecture doc present ([docs/architecture.md](docs/architecture.md))
- [x] Validation report present ([docs/validation-report.md](docs/validation-report.md))
- [x] Unit tests: 8 tests, all passing

---
