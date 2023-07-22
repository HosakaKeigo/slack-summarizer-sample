const CHUNK_SIZE = 12000; // 16kを想定
const DEFAULT_MODEL = "gpt-3.5-turbo-16k-0613"

// Google Documentsの共有設定
const FILE_PERMISSION = DriveApp.Access.DOMAIN_WITH_LINK
const FILE_PERMISSION_TYPE = DriveApp.Permission.VIEW

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