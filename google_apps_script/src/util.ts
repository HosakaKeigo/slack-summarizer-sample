/**
 * スクリプトプロパティの取得・エラー処理用
 */
function getScriptProperty(key: keyof typeof ScriptPropertyKeysMap): string {
  const mappedKey = ScriptPropertyKeysMap[key];
  const value = ScriptProperties.getProperty(mappedKey);
  if (!value) {
    const error = ErrorMap.MISSING_SCRIPT_PROPERTIES
    error.details = `key: ${key}`
    throw new API_Error(error);
  }

  return value;
}


function chunkText(text: string, maxLength: number = CHUNK_SIZE): string[] {
  if (text.length <= maxLength) {
    return [text];
  }

  const lines = text.split('\n');

  const chunks: string[] = [];
  let currentChunk = '';

  for (const line of lines) {
    if ((currentChunk + line).length > maxLength) {
      chunks.push(currentChunk);
      currentChunk = line;
    } else {
      currentChunk += line;
    }
  }

  if (currentChunk !== '') {
    chunks.push(currentChunk);
  }

  return chunks;
}
