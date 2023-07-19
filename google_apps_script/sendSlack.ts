function sendSlack({ text, channel, thread_ts }: { text: string, channel: string, thread_ts: string }) {
  const url = "https://slack.com/api/chat.postMessage"

  const payload = {
    token: PropertiesService.getScriptProperties().getProperty("SLACK_BOT_TOKEN"),
    channel,
    text,
    thread_ts
  };

  const params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    "method": "post",
    "payload": payload
  };

  // Slackに投稿する
  UrlFetchApp.fetch(url, params);
}