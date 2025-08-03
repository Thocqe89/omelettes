export async function fetchProductData() {
  const apiUrl = import.meta.env.VITE_PRODUCT_DETAILS_API;
  
  try {
    // Using a Next.js API route or similar proxy
    const res = await fetch(`/api/google-script-proxy?url=${encodeURIComponent(apiUrl)}`);
    return await res.json();
  } catch (error) {
    console.error("Proxy fetch error:", error);
    throw error;
  }
}