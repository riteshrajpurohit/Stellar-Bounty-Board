# Stellar Bounty Board

A decentralized, responsive SaaS platform for managing and claiming bounties on the Stellar network.

## Getting Started

### Prerequisites
- Node.js (v20+)
- Freighter Wallet installed in your browser

### Installation
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Supabase Configuration
1. Create a new Supabase project.
2. Run the SQL script found in `supabase/schema.sql` in the SQL Editor.
3. Copy `.env.example` to `.env.local` (or just `.env`) and add your project URL and Anon Key.

### Running the App
Start the development server:
```bash
npm run dev
```

## Features
- **Freighter Wallet Integration**: Connect and disconnect securely.
- **On-chain Identity via Supabase**: Seamlessly link your Stellar wallet address to a rich profile (name, email, bio).
- **Responsive Dashboard**: Beautiful, mobile-first Light UI optimized for SaaS interactions.

*Bounty creation and smart contract integration coming soon.*
