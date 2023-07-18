import { Configuration, OpenAIApi } from "openai"
import * as dotenv from 'dotenv'
import { summarizePrompt } from "./prompt";
dotenv.config()

async function summarize(body: string) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  let summary: string = "";

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k-0613",
    messages: [
      { role: "system", content: summarizePrompt },
      { role: "user", content: body }],
  });
  summary += response.data.choices[0].message?.content
  console.log(summary);
  return summary
}

export { summarize }