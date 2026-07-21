/** Prevent app to sleep on Chrome */
export const requestWakeLock = async (
  wakeLockRef: React.MutableRefObject<WakeLockSentinel | null>,
  onFallback?: () => void,
  onReleaseHandler?: () => void,
) => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;

  try {
    if (!("wakeLock" in navigator)) {
      console.warn("Wake Lock not supported");
      onFallback?.();
      return;
    }

    const wakeLock = await (navigator as any).wakeLock.request("screen");
    wakeLockRef.current = wakeLock;

    if (onReleaseHandler) {
      wakeLock.addEventListener("release", onReleaseHandler);
    }

    // Re-acquire wake lock on visibility change
    const handleVisibilityChange = async () => {
      if (
        document.visibilityState === "visible" &&
        wakeLockRef.current?.released
      ) {
        try {
          const newLock = await (navigator as any).wakeLock.request("screen");
          wakeLockRef.current = newLock;
          if (onReleaseHandler) {
            newLock.addEventListener("release", onReleaseHandler);
          }
          console.log("Wake Lock re-acquired");
        } catch (err) {
          console.warn("Wake Lock re-acquire failed:", err);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    console.log("Wake Lock acquired");
  } catch (err) {
    console.warn("Wake Lock request failed:", err);
  }
};

export const releaseWakeLock = async (
  wakeLockRef: React.MutableRefObject<WakeLockSentinel | null>,
  onReleaseHandler?: () => void,
) => {
  try {
    const wakeLock = wakeLockRef.current;
    if (wakeLock) {
      if (onReleaseHandler) {
        wakeLock.removeEventListener("release", onReleaseHandler);
      }

      await wakeLock.release();
      wakeLockRef.current = null;

      console.log("Wake Lock released");
    }
  } catch (err) {
    console.warn("Wake Lock release failed:", err);
  }
};
