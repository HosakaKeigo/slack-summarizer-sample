interface PostData {
  content: string;
  channel: string;
  thread_ts: string
}
function doPost(e: GoogleAppsScript.Events.DoPost) {
  const data = e.postData.contents;
  const json = JSON.parse(data);

  // 要約
  const { content, channel, thread_ts } = json;

  // シート記録
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  sheet.appendRow([new Date(), content, channel, thread_ts])

  const chunks = chunkText(content, CHUNK_SIZE);
  let summary

  // 文字数が多い場合は分割して要約する
  for (const chunk of chunks) {
    let input = chunk
    if (summary) {
      input = "[previous summary]" + summary + "\n---\n" + chunk

    }
    summary = summarize(input);
  }
  // Slack送信
  sendSlack({ text: summary, channel, thread_ts })
}
