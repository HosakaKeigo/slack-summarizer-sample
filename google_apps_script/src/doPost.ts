/**
 * Slack botからのリクエストを処理
 * 1. GPTで受け取った文字起こしテキストを要約
 * 2. Googleドキュメントに保存
 * 3. 要約／原文／GoogleドキュメントのURLをSlackに送信
 *
 * スクリプトプロパティ
 * SLACK_BOT_TOKEN: Slack: Bot tokens
 * OPENAI_API_KEY
 */
function doPost(e: GoogleAppsScript.Events.DoPost) {
  const data = e.postData.contents;
  const json = JSON.parse(data) as SlackPostData;

  const { content, channel, thread_ts } = json;
  if (!content || !channel || !thread_ts) {
    throw new Error("invalid request")
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
    try {
      const result = summarize(current);
      summary.title = result.title
      summary.body = result.body
    } catch (e) {
      throw new Error(`要約エラー: ${e.message}`)
    }
  }

  // Google Document作成
  try {
    const fileId = createDocument(summary);
    grantAccess(fileId);
    summary.body += "\n\n[Google Document]\n" + `https://docs.google.com/document/d/${fileId}/edit?usp=sharing`
  } catch (e) {
    throw new Error(`Google Document作成: ${e.message}`)
  }

  // Slack送信
  try {
    postSlackMessage({ text: summary.body, channel, thread_ts })
    console.log("success")
  } catch (e) {
    throw new Error(`Slack送信: ${e.message}`)
  }
}
