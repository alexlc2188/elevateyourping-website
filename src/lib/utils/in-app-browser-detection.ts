export const detectInAppBrowser = () => {
  if (typeof window === "undefined")
    return { isInAppBrowser: false, platform: "Unknown" };

  const userAgent = window.navigator.userAgent.toLowerCase();

  // TikTok in-app browser detection only
  const isTikTok =
    userAgent.includes("tiktok") ||
    userAgent.includes("musical.ly") ||
    userAgent.includes("bytedance") ||
    userAgent.includes("aweme");

  const isInAppBrowser = isTikTok;
  const platform = isTikTok ? "TikTok" : "Unknown";

  return {
    isInAppBrowser,
    platform,
  };
};

export const getBrowserInstructions = (platform: string) => {
  const instructions = {
    TikTok: {
      title: "Open in Browser",
      message:
        "TikTok's in-app browser doesn't support Google login. Please open this page in your phone's browser instead.",
      steps: [
        "Tap the menu (⋮) in the top right",
        "Select 'Open in Browser' or 'Open in Safari/Chrome'",
        "Try logging in again",
      ],
    },
    default: {
      title: "Open in Browser",
      message:
        "This app's in-app browser doesn't support Google login. Please open this page in your phone's browser instead.",
      steps: [
        "Tap the menu (⋮) in the top right",
        "Select 'Open in Browser' or 'Open in Safari/Chrome'",
        "Try logging in again",
      ],
    },
  };

  return (
    instructions[platform as keyof typeof instructions] || instructions.default
  );
};
