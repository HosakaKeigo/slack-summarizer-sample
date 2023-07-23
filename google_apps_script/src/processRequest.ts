function processRequest(data: SlackPostData): API_SUCCESS {
  const { content, channel, thread_ts } = data

  // シート記録
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("log") ?? SpreadsheetApp.getActiveSpreadsheet().insertSheet("log")
  sheet.appendRow([new Date(), content, channel, thread_ts])

  // 要約
  const chunks = chunkText(content, CHUNK_SIZE);
  const summary: Summary = {
    title: "",
    body: ""
  }

  const summaries: Summary[] = []
  let summaryTitle: string

  // 文字数が多い場合は分割して要約する
  chunks.forEach((chunk, index) => {
    const part = chunks.length > 1 ? `(${index + 1} of ${chunks.length})` : ""
    const summarized = summarize("[draft of a meeting]\n" + chunk);

    if (index === 0) {
      summaryTitle = summarized.title // chunkのタイトル名を統一するため、初回のタイトルを採用する
    }
    summary.title = summaryTitle + part
    summary.body = summarized.body
    summaries.push(summarized)

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
    postSlackMessage({ text: part + "\n---\n\n" + summary.body, channel, thread_ts })
  })

  const result: API_SUCCESS = {
    summaries: [summary]
  }
  console.log("success: " + JSON.stringify(result))

  return result
}

function parseRequest(e: GoogleAppsScript.Events.DoPost): SlackPostData {
  const data = e.postData.contents;
  const json = JSON.parse(data) as SlackPostData;

  const { content, channel, thread_ts } = json;
  if (!content || !channel || !thread_ts) {
    throw new API_Error(ErrorMap.INVALID_REQUEST_ARG);
  }
  return json
}