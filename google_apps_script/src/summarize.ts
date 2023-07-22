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

  const response = execChatCompletion(messages, model)
  const function_call = response.choices[0].message.function_call
  if (!function_call) {
    throw new API_Error(ErrorMap.OPENAI_FUNCTION_CALL_ERROR)
  }

  const resultJSON = JSON.parse(function_call.arguments) as { title: string, body: string }
  console.log(JSON.stringify(resultJSON))
  if (!("title" in resultJSON && "body" in resultJSON)) {
    throw new API_Error(ErrorMap.OPENAI_FUNCTION_CALL_ARGUMENT_ERROR)
  }
  console.timeEnd("summarize start: " + content)
  return resultJSON
}

function execChatCompletion(messages: ChatCompletionMessge[], model: string): ChatCompletionResponse {
  const headers = {
    Authorization: "Bearer " + getScriptProperty("OPENAI_API_KEY"),
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
    muteHttpExceptions: true,
  };

  const response = JSON.parse(
    UrlFetchApp.fetch(OPENAI_URL, options).getContentText()
  ) as ChatCompletionResponse | OpenAIError;
  console.log(`OpenAI Response: ${JSON.stringify(response)}`)
  if ("error" in response) {
    const error = response.error
    throw new API_Error({ code: error.code || "500", message: error.message, details: "For more information, see: https://platform.openai.com/docs/guides/error-codes/api-errors" });
  }
  return response
}
