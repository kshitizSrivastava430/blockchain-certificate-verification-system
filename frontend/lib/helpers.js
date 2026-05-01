export const truncateAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  // Assuming timestamp is in seconds from smart contract
  return new Date(timestamp * 1000).toLocaleString();
};
