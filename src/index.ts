import * as dotenv from 'dotenv'
import { App, AwsLambdaReceiver } from "@slack/bolt"
import { postGAS } from './postGAS';

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
});

dotenv.config()

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: awsLambdaReceiver,
  processBeforeResponse: true
});
// ======================================
// メッセージ受け取り → ファイル取得 →　テキスト要約（Google Apps Scriptでの実行）

app.message(async ({ message, client, payload }) => {
  console.log("message")
  if (message.subtype === "file_share" && message.files) {
    const fileInfo = await client.files.info({ file: message.files[0].id })
    if (!fileInfo.content) {
      await client.chat.postMessage({ text: "すみません、エラーが発生しました。", channel: message.channel, thread_ts: payload.event_ts })
      return;
    }

    postGAS({ content: fileInfo.content, channel: message.channel, thread_ts: payload.event_ts }).then(res => console.log(res))
    await client.chat.postMessage({ text: `要約中です...完了したらお知らせします。字数：${fileInfo.content.length}`, channel: message.channel, thread_ts: payload.event_ts })
    return
  }
});

//app.event("file_shared", async ({ payload, client, context }) => {
//  console.log("file_shared")
//  // files.infoでURLを取得する
//  if (context.retryNum) {
//    console.log(
//      `skipped retry. retryReason: ${context.retryReason}`
//    );
//    return;
//  }

//  const fileInfo = await client.files.info({ file: payload.file_id })
//  if (!fileInfo.content) {
//    await client.chat.postMessage({ text: "すみません、エラーが発生しました。", channel: payload.channel_id, thread_ts: payload.event_ts })
//    return;
//  }

//  await client.chat.postMessage({ text: `要約中です...完了したらお知らせします。字数：${fileInfo.content.length}`, channel: payload.channel_id, thread_ts: payload.event_ts })

//  console.log(fileInfo.content)
//  // テキスト要約
//  // ３秒以内でレスポンスを返すために別関数に委譲する。
//  const summary = await summarize(fileInfo.content)
//  console.log(summary)
//  // 要約結果を投稿
//  await client.chat.postMessage({ text: summary + "\n\n" + fileInfo.file?.permalink_public, channel: payload.channel_id, thread_ts: payload.event_ts })
//  return;
//});

export const handler = async (event, context, callback) => {
  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
}