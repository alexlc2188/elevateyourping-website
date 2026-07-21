export default function getCurrentTimeForFb(date = Date.now()) {
    return Math.floor(date / 1000);
  }