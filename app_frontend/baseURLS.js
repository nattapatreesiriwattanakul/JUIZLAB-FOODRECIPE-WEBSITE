export const getBaseUrl = () => {
  return "http://127.0.0.1:3342";
};

export const getMediaUrl = (path) => {
  if (!path) return "";
  // Remove any leading slashes from the path
  const cleanPath = path.replace(/^\//, "");
  return `${getBaseUrl()}/${cleanPath}`;
};
