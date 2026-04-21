# Architecture & Data Flow

## Overview
The Stellar Bounty Board is a decentralized application that uses Web2 caching (Supabase) alongside Web3 identity (Freighter Wallet).

### Identity
1. **Wallet Login:** The user clicks "Connect Wallet".
2. **Freighter API:** App checks permission and retrieves the wallet public key.
3. **Database Mapping:** The wallet address acts as the Primary Key in the `profiles` table in Supabase.
4. **Registration:** If the profile is empty, the user completes the form, which updates Supabase.

### Application Routing
- **`/` (Home)**: Marketing landing page and wallet connection entry point.
- **`/dashboard`**: Protected page. Requires a connected wallet AND a completed profile.

### Upcoming Architecture
In future phases, the following will be implemented:
- **Soroban Smart Contracts**: Bounties will be structured as escrows on the Stellar network.
- **Contract Integration**: `stellar-sdk` will be used to construct, sign, and submit transactions.
- **Indexing**: Supabase will hold offline indexed representations of bounties for fast UI rendering, synchronized via a Stellar Horizon event listener.
