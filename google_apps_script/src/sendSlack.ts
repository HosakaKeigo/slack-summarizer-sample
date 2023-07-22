function postSlackMessage({ text, channel, thread_ts }: { text: string, channel: string, thread_ts: string }) {
  const payload = {
    token: getScriptProperty("SLACK_TOKEN"),
    channel,
    text,
    thread_ts
  };

  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    "method": "post",
    "payload": payload
  };
  try {
    UrlFetchApp.fetch(SLACK_URL, options);
  } catch (e) {
    const error = ErrorMap.SLACK_SEND_MESSAGE_ERROR
    error.details += e.message;
    throw new API_Error(error)
  }
}