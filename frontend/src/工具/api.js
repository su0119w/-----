const api = import.meta.env.VITE_API_BASE_URL;

async function apiRequest(path, options = {}) {
  const response = await fetch(`${api}${path}`, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `請求失敗:${path}(HTTP${response.status})`);
  }

  return data;
}
export default apiRequest;
