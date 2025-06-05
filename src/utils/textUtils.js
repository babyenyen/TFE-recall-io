// IA-1-CODE: Logique suggérée par ChatGPT (OpenAI)
export function chunkText(text, chunkSize = 1500) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
}
