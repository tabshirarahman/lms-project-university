
export async function getStudentClient() {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();
   

    if (!data) return null;

    return data; // 🔥 full user return
  } catch (error) {
    return null;
  }
}
