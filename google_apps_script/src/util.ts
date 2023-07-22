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
