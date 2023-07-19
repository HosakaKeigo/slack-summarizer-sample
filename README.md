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
