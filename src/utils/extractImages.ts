export function extractImageUrls(html: string): string[] {
  if (!html) return [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const urls = Array.from(doc.querySelectorAll("img"))
    .map((img) => img.getAttribute("src") ?? "")
    .filter((src) => src.length > 0);
  return Array.from(new Set(urls));
}
