function postSlackMessage({ text, channel, thread_ts }: { text: string, channel: string, thread_ts: string }) {
  const payload = {
    token: PropertiesService.getScriptProperties().getProperty("SLACK_BOT_TOKEN"),
    channel,
    text,
    thread_ts
  };

  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    "method": "post",
    "payload": payload
  };

  UrlFetchApp.fetch(SLACK_URL, options);
}