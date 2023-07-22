class API_Error extends Error {
  data: ErrorData;

  constructor(data: ErrorData) {
    super(data.message);
    this.data = data;
  }
}

type ErrorType = "INVALID_REQUEST_ARG" | "SLACK_SEND_MESSAGE_ERROR" | "OPENAI_FUNCTION_CALL_ERROR" | "OPENAI_FUNCTION_CALL_ARGUMENT_ERROR" | "GOOGLE_DOCUMENT_CREATE_ERROR";

const ErrorMap: Record<ErrorType, ErrorData> = {
  INVALID_REQUEST_ARG: {
    code: 400,
    message: "Bad Request",
    details: "Request argument is invalid.",
  },
  SLACK_SEND_MESSAGE_ERROR: {
    code: 401,
    message: "Slack Error",
    details: "Failed to send message to Slack.",
  },
  OPENAI_FUNCTION_CALL_ERROR: {
    code: 500,
    message: "OpenAI Function call error",
    details: "function_call property not found in the response from OpenAI API",
  },
  OPENAI_FUNCTION_CALL_ARGUMENT_ERROR: {
    code: 500,
    message: "OpenAI Function call property error",
    details: "expected property not found in the function_call.arguments",
  },
  GOOGLE_DOCUMENT_CREATE_ERROR: {
    code: 500,
    message: "Google Document Create Error",
    details: "Failed to create Google Document.",
  },
};
