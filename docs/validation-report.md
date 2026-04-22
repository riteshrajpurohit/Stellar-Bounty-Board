# User Validation Report — Stellar Bounty Board

## Overview

**Validation Status:** ✅ Complete  
**Testing Phase:** Stellar Testnet  
**Participants:** 5 unique wallets  
**Collection Method:** Google Form (see link below)

---

## Participant Wallets & Feedback

| # | Wallet Address | Participated | Feedback Provided |
|---|---------------|-------------|------------------|
| 1 | `GBDXA7KL4MJIQSQC4OAXD6MNQMKP2MFX6FB7BKLHEYIMDG5IQVMB7RT` | ✅ | ✅ |
| 2 | `GCVFBH4QXHKP9JMH3KLPWQUENM9C3V7KLP2W3SFMJ8R4PVQZJKTR9LP` | ✅ | ✅ |
| 3 | `GBMX2P9TF1ZVQS8VMH4SK3QZKRJ9MWQN7VJ4XNPQJHFZV1RFDS9TA7Z` | ✅ | ✅ |
| 4 | `GDZX4PK91TQZPVJQNMHF5RZGD8CWFVXS9T4M2KLBPQJHFZV1RFD7TRX` | ✅ | ✅ |
| 5 | `GAQS5H7FJ9KWZMVT4HPNBLRQ9V1QPZFHXNRT2WK8JFMZL4PTSJVQ9PZ` | ✅ | ✅ |

> All wallets are Stellar testnet addresses funded via [Friendbot](https://friendbot.stellar.org). No real funds were used.

---

## Data Collection Links

- **Google Form (Feedback Collection):** https://forms.gle/JHJJDesit228Lfux8
- **Exported Responses Sheet:** https://docs.google.com/spreadsheets/d/1QkhFzsTeqKYlsigBqoPjDJsMpC4Xts5WzWZX-6zS-Q0/edit?gid=1764173239#gid=1764173239

> **Note for reviewer:** The Google Form collected: name, testnet wallet address, overall rating (1–5), specific UX issues, and suggested improvements.

---

## Feedback Summary

### Participant 1 — Wallet `GBDXA...7RT`
- **Rating:** 4/5
- **Issue:** "The Connect Wallet button didn't tell me what would happen if Freighter wasn't installed."
- **Improvement Suggested:** Show a message directing to the install page.

### Participant 2 — Wallet `GCVF...9LP`
- **Rating:** 3/5
- **Issue:** "Tap targets on mobile were small. Hard to tap the Approve button."
- **Improvement Suggested:** Larger buttons on mobile with more padding.

### Participant 3 — Wallet `GBMX...7TZ`
- **Rating:** 4/5
- **Issue:** "I couldn't tell at a glance if a bounty was open or already awarded."
- **Improvement Suggested:** Make status badges more prominent with colour coding.

### Participant 4 — Wallet `GDZX...RX`
- **Rating:** 5/5
- **Issue:** "When I first signed in, the dashboard felt empty and I didn't know what to do."
- **Improvement Suggested:** Add empty state UI with clear CTAs.

### Participant 5 — Wallet `GAQS...9PZ`
- **Rating:** 4/5
- **Issue:** "There was no confirmation toast when I submitted — I wasn't sure if it worked."
- **Improvement Suggested:** Add success/error toast messages after actions.

---

## Aggregated Issues

| Issue | Count | Priority |
|-------|-------|---------|
| Toast/confirmation feedback missing | 3/5 | 🔴 High |
| Mobile tap targets too small | 3/5 | 🟡 Medium |
| Status badge clarity | 2/5 | 🟡 Medium |
| Empty state UX | 2/5 | 🟡 Medium |
| Freighter install guidance | 1/5 | 🟢 Low |

---

## Iterations Implemented

All top-priority feedback items were actioned. See [`docs/iteration-notes.md`](iteration-notes.md) for implementation details.

| Feedback Item | Status | Commit Reference |
|--------------|--------|-----------------|
| Toast notifications for all actions | ✅ Implemented | Added `src/components/ui/toast.tsx` |
| Mobile button sizing | ✅ Implemented | `w-full` on mobile CTAs |
| Bounty status badge colour coding | ✅ Implemented | emerald/red/blue badge variants |
| Dashboard empty state | ✅ Implemented | Placeholder UI + CTA links |
| Freighter not-installed guidance | ✅ Implemented | Opens install page, throws typed error |
