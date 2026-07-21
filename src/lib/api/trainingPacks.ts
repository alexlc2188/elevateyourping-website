export async function assignPackToUser(packId: string, userId: string) {
  try {
    const res = await fetch("/api/training-packs/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trainingPackId: packId, userId }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data?.error || "Failed to assign pack",
        data: null,
      };
    }

    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network or server error",
    };
  }
}
