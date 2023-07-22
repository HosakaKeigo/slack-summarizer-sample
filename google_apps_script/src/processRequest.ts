function processRequest(e: GoogleAppsScript.Events.DoPost): API_SUCCESS {
  const data = e.postData.contents;
  const json = JSON.parse(data) as SlackPostData;

  const { content, channel, thread_ts } = json;
  if (!content || !channel || !thread_ts) {
    throw new API_Error(ErrorMap.INVALID_REQUEST_ARG);
  }

  // シート記録
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("log") ?? SpreadsheetApp.getActiveSpreadsheet().insertSheet("log")
  sheet.appendRow([new Date(), content, channel, thread_ts])

  // 要約
  const chunks = chunkText(content, CHUNK_SIZE);
  const summary: Summary = {
    title: "",
    body: ""
  }

  // 文字数が多い場合は分割して要約する
  for (const chunk of chunks) {
    let current = chunk
    if (summary.body !== "") {
      current = "[previous summary]\n" + summary.body + "\n---\n[additional content]" + chunk
    }
    const result = summarize(current);
    summary.title = result.title
    summary.body = result.body
  }

  // Google Document作成
  try {
    const fileId = createDocument(summary, content);
    summary.body += "\n\n[Google Document]\n" + `https://docs.google.com/document/d/${fileId}/edit?usp=sharing`
  } catch (e) {
    const error = ErrorMap.GOOGLE_DOCUMENT_CREATE_ERROR
    error.message += e.message
    throw new API_Error(error)
  }

  // Slack送信
  postSlackMessage({ text: summary.body, channel, thread_ts })

  const result: API_SUCCESS = {
    summary
  }
  console.log("success: " + JSON.stringify(result))

  return result
}
