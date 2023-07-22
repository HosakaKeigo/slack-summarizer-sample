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

const SLACK_URL = "https://slack.com/api/chat.postMessage"