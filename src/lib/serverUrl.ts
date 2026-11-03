export const getServerUrl = (): string => {
  const url =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5001";
  return url.replace(/\/+$/, "");
};
