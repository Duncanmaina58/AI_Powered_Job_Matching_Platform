export function getAuthToken() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || JSON.parse(localStorage.getItem("user"));
  return userInfo?.token || localStorage.getItem("token") || null;
}
