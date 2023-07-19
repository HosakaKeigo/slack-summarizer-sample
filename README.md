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

## AWS
Slack botをServerless Frameworkを使ってデプロイ。
時間のかかるOpenAIの処理はLambda上で処理せず、Google Apps Scriptに委譲している。

- Slackからのイベント受け取り
- Google Apps ScriptへのPOST


## Google Apps Script
Webアプリとしてデプロイ。

- OpenAI APIを使って要約
- Slack投稿

# Setup
```
npm install
```

## Google Apps Script
OpenAI APIにアクセスする処理を担う。

- Google Apps Scriptを作成。
- `appsscript.json`に作成したScript IDを指定
- スクリプトプロパティに下記を指定
  - OPENAI_API_KEY
  - SLACK_BOT_TOKEN
    - Bot User OAuth Token
- `clasp push`
- Webアプリとしてデプロイ。デプロイしたURLはAWSの環境変数に指定する。

## AWS
- IAMの設定
  - Serverless Frameworkを用いたデプロイで必要 
    - S3
    - IAM
    - Lambda
    - API Gateway
    - Cloudwatch Logs
    - Cloud Formation

>**Note**
>
>https://zenn.dev/peg/articles/93d844f6dd11c9

- aws cliのconfigyre
- .envの設定
  - Slackの認証情報は最後に入れる。
```.env
SLACK_BOT_TOKEN=<xoxb-...>
SLACK_SIGNING_SECRET=<Your Secret>
GAS_API_URL=https://script.google.com/macros/s/<Script ID>/exec
```

デプロイ方法は以下。
```
serverless deploy
```

環境は、`--stage prod`など`--stage`フラグで分けられる。

## Slack
アプリの設定。

- アプリの作成
  - https://api.slack.com/apps
- Event Subscriptionsの設定
  - AWSにデプロイしたURLをRequest　URLに設定。
  - bot eventsを設定
 
|  |  |
|:-:|:-:|
|<img width="698" alt="image" src="https://github.com/HosakaKeigo/slack_summarize/assets/74914629/3ec903da-7176-43cc-9330-1babaae6f535">|<img width="664" alt="image" src="https://github.com/HosakaKeigo/slack_summarize/assets/74914629/1e8b1d6a-c280-446e-a8e3-e2eaae29b6d7">|

- App Homeの設定
  - App Display Name等を設定 
  - Show Tabsから、*Allow users to send Slash commands and messages from the messages tab*を有効化。
<img width="665" alt="image" src="https://github.com/HosakaKeigo/slack_summarize/assets/74914629/5e8f40d3-0a3a-4504-90f5-ddd94b9f90ea">

- OAuth & Permissionsの設定
  - Bot Token Scopesを設定
    - channels:read / channels:history / chat:write / files:read  

- Workspaceへのインストール
  - Install Appからインストール
  - **Bot User OAuth Token**を取得

- Basic Information > App CredentialsからSigning Secretを取得

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
