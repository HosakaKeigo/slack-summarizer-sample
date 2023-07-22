function postSlackMessage({ text, channel, thread_ts }: { text: string, channel: string, thread_ts: string }) {
  const payload = {
    token: getScriptProperty("SLACK_TOKEN"),
    channel,
    text,
    thread_ts
  };

  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    "method": "post",
    "payload": payload,
    muteHttpExceptions: true,
  };
  console.log(`postSlackMessage: ${JSON.stringify(options)}`)
  const response = JSON.parse(UrlFetchApp.fetch(SLACK_URL, options).getContentText()) as SlackResponse;
  if (response.error) {
    const error = ErrorMap.GOOGLE_DOCUMENT_CREATE_ERROR
    error.message += response.error
    throw new API_Error(error);
  }
}