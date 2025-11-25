export async function clientFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
