const DEFAULT_INTERVAL_MINUTES = 60;
const ALARM_NAME = "clear-history";

async function clearHistory() {
  await browser.browsingData.remove(
    { since: 0 },
    { history: true }
  );
}

async function schedule(interval) {
  await browser.alarms.clear(ALARM_NAME);
  browser.alarms.create(ALARM_NAME, {
    periodInMinutes: interval
  });
}

browser.runtime.onInstalled.addListener(async () => {
  const { interval } = await browser.storage.local.get("interval");
  await schedule(interval || DEFAULT_INTERVAL_MINUTES);
});

browser.runtime.onStartup.addListener(() => {
  clearHistory();
});

browser.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === ALARM_NAME) {
    clearHistory();
  }
});
