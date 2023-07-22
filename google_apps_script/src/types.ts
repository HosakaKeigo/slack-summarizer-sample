type API_RESPONSE = {
  status: number;
  data: API_SUCCESS | API_ERROR;
}

type API_SUCCESS = {
  summary: Summary;
}

type API_ERROR = {
  error: ErrorData
}

type ErrorData = {
  code: number;
  message: string;
  details: string;
}

type ChatCompletionResponse = {
  id: string;
  object: string;
  created: number;
  choices: {
    index: number;
    message: {
      role: "assistant";
      content: string;
      function_call?: FunctionCall;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

type ChatCompletionMessge = {
  role: "system" | "user" | "assistant";
  content: string;
}

type FunctionCall = {
  "name": string
  "arguments": string
}

type OpenAIError = {
  "error": {
    "message": string,
    "type": string,
    "param": string,
    "code": string
  }
}

type SlackPostData = {
  content: string;
  channel: string;
  thread_ts: string
}

type Summary = {
  title: string;
  body: string;
}
