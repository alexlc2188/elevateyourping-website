const LOCAL_STORAGE_KEY = "cookie_consent";

export type CookieConsentData = {
  accepted: boolean;
  timestamp: number;
};

/**
 * Save cookie consent to localStorage
 */
export function saveConsent(accepted: boolean) {
  const data: CookieConsentData = {
    accepted,
    timestamp: Date.now(),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }
}

/**
 * Get cookie consent state
 */
export function getConsent(): CookieConsentData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CookieConsentData;
  } catch {
    return null;
  }
}

/**
 * Check if user has accepted cookies
 */
export function hasConsent(): boolean {
  const data = getConsent();
  return data?.accepted === true;
}
