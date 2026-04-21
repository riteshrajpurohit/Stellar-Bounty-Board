/**
 * Useful utilities for interacting with Stellar types
 */

// Formats a stellar address: GBX3...YV2A
export const truncateAddress = (address: string) => {
  if (!address || address.length !== 56) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};
