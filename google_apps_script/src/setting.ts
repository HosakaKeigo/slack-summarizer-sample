/**
 * 必要なスクリプトプロパティ名
 */
const ScriptPropertyKeysMap = {
  SLACK_TOKEN: "SLACK_BOT_TOKEN",
  OPENAI_API_KEY: "OPENAI_API_KEY"
}

const SLACK_URL = "https://slack.com/api/chat.postMessage"

// エラー通知メールアドレス（Slackエラーの場合）
const ERROR_MAIL_CONFIG = {
  recipient: "hosaka@piano.or.jp",
  subject: "エラー通知(議事録要約bot)",
  body: "エラーが発生しました。"
}

const CHUNK_SIZE = 14000; // 16kを想定
const DEFAULT_MODEL = "gpt-3.5-turbo-16k-0613"

// Google Documentsの共有設定
const FILE_PERMISSION = DriveApp.Access.DOMAIN_WITH_LINK
const FILE_PERMISSION_TYPE = DriveApp.Permission.VIEW

// 議事録保管場所のフォルダ名
const DIRECTORY_PATH = `議事録/${new Date().getFullYear()}/${new Date().getMonth() + 1}月`

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
// Function calling用関数スキーマ
const GPT_FUNCTION = [
  {
    "name": "createGoogleDocument",
    "description": "useful when create a summarized document",
    "parameters": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "description": "A title of document"
        },
        "body": {
          "type": "string",
          "description": "A body of document"
        }
      },
      "required": ["title", "body"]
    }
  }]