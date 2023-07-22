/**
 * GPTでの要約
 * Function Callingで指定した形式のJSONを返す。
 */
function summarize(content: string, model = DEFAULT_MODEL): Summary {
  console.time("summarize start: " + content)
  const messages: ChatCompletionMessge[] = [
    { role: "system", content: CHAT_GPT_SYSTEM_PROMPT },
    { role: "user", content: content },
  ];

  try {
    const response = execChatCompletion(messages, model)
    const function_call = response.choices[0].message.function_call
    if (!function_call) {
      throw new Error("function_call not found")
    }

    const resultJSON = JSON.parse(function_call.arguments) as { title: string, body: string }
    console.log(JSON.stringify(resultJSON))
    if (!("title" in resultJSON && "body" in resultJSON)) {
      throw new Error("Function Call: property not found");
    }
    console.timeEnd("summarize start: " + content)
    return resultJSON
  }
  catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
}

function execChatCompletion(messages: ChatCompletionMessge[], model: string): ChatCompletionResponse {
  const headers = {
    Authorization: "Bearer " + PropertiesService.getScriptProperties().getProperty("OPENAI_API_KEY"),
    "Content-type": "application/json",
  };
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    headers: headers,
    method: "post",
    payload: JSON.stringify({
      model,
      messages,
      functions: GPT_FUNCTION,
      function_call: { name: GPT_FUNCTION[0].name }
    }),
  };

  try {
    const response = JSON.parse(
      UrlFetchApp.fetch(OPENAI_URL, options).getContentText()
    ) as ChatCompletionResponse | OpenAIError;
    if ("error" in response) {
      throw new Error(`${response.error.code}: ${response.error.message}`);
    }
    return response
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
}