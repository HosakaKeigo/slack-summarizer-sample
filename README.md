# Slack Meeting Summary Bot

```mermaid
graph TB
  A["Slack Server"] -- "send events" --> B["Amazon API Gateway"]
  B -- "routing" --> C["AWS Lambda"]
  C -- "1. reply" --> A
  C -- "send request with the text to summarize" --> D["Google Apps Script"]
  D -- "2. summarize and post message" --> A

  subgraph AWS["Amazon Web Service"]
    subgraph SF["Serverless Framework"]
      B
      C
      E["Amazon S3 (for deployment)"]
    end
  end
```

# Setup
## Google Apps Script

## .env
```.env
SLACK_BOT_TOKEN=<xoxb-...>
SLACK_SIGNING_SECRET=<Your Secret>
GAS_API_URL=https://script.google.com/macros/s/<Script ID>/exec
```

# Deploy
Deployed on AWS Lambda using Serverless Framework.
Ensure Node.js version be higher than 18.

# Usage
## Line Clova Note
- Line Clova Noteで録音・文字起こし
- 文字起こしを修正
  - 参加者名の入力など
- 右上のメニューから「音声記録のダウンロード」
- Slackで共有。アプリをインストールしたチャンネルに投稿

|  |  |
|:-:|:-:|
|![image1](https://github.com/HosakaKeigo/slack_summarize/assets/74914629/4002ebed-5f31-4823-b312-63ddf2c42c5f)|![image2](https://github.com/HosakaKeigo/slack_summarize/assets/74914629/801365d1-f0d6-4123-bb80-269b300017b5)|


- しばらくすると要約が送信されます。
