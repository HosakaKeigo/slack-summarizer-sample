interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  choices: {
    index: number;
    message: {
      role: "assistant";
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

function summarize(content: string, model = DEFAULT_MODEL) {
  const OPENAI_BASE_URL = "https://api.openai.com/v1";
  const OPENAI_ENDPOINTS = new Map<string, string>([
    ["completion", `${OPENAI_BASE_URL}/chat/completions`],
  ]);

  const apiKey = PropertiesService.getScriptProperties().getProperty("OPENAI_API_KEY");

  const messages = [
    { role: "system", content: CHAT_GPT_SYSTEM_PROMPT },
    { role: "user", content: content },
  ];

  const headers = {
    Authorization: "Bearer " + apiKey,
    "Content-type": "application/json",
  };

  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    muteHttpExceptions: true,
    headers: headers,
    method: "post",
    payload: JSON.stringify({
      model,
      messages: messages,
    }),
  };

  try {
    const response = JSON.parse(
      UrlFetchApp.fetch(OPENAI_ENDPOINTS.get("completion"), options).getContentText()
    ) as ChatCompletionResponse;
    console.log(`completion: ${JSON.stringify(response)}`);

    const answer = response.choices[0].message.content;
    return answer;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
}
