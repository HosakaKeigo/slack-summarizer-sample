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
  try {
    const responseData = processRequest(e);
    return createJsonResponse(responseData);
  } catch (e) {
    console.error(e);

    if (e instanceof API_Error) {
      return createJsonResponse({ error: e.data }, e.data.code);
    } else if (e instanceof Error) {
      const internalError = {
        code: 500,
        message: e.message,
        details: "Internal Server Error"
      };
      return createJsonResponse({ error: internalError }, 500);
    }
  }
}

function createJsonResponse(data: any, status: number = 200): GoogleAppsScript.Content.TextOutput {
  const response: API_RESPONSE = {
    status,
    data
  };
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
