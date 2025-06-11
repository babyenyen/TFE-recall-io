//IA-1-TXT: Prompt reformulé par ChatGPT (OpenAI) pour éviter des erreurs de formatage
export async function generateFlashcardsFromGemini(text) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `Tu es un générateur de flashcards en français.

                    Génère 10 flashcards au format JSON.

                    Chaque carte doit avoir :
                    - "question": string
                    - "answer": string

                    Réponds uniquement avec un tableau JSON. Aucun texte autour.

                    Voici le texte à utiliser, igonre les balises HTML :
                    ${text}`
                }]
            }]
        })
    });

    if (!response.ok) {
        throw new Error("Erreur lors de l'appel à Gemini API");
    }

    const data = await response.json();

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse le JSON renvoyé par Gemini
    const jsonStart = generatedText.indexOf("[");
    const jsonEnd = generatedText.lastIndexOf("]") + 1;
    if (jsonStart === -1 || jsonEnd === 0 || jsonEnd <= jsonStart) {
        throw new Error("Le JSON de Gemini est mal formé ou absent.");
}
    const jsonString = generatedText.substring(jsonStart, jsonEnd);
    const parsedFlashcards = JSON.parse(jsonString);
    return parsedFlashcards;
}

//IA-1-TXT: Prompt reformulé par ChatGPT (OpenAI) pour éviter des erreurs de formatage
export async function generateQuizFromGemini(text, quizType) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const selectedTypes = [];
    if (quizType.qcm) selectedTypes.push("QCM");
    if (quizType.qrm) selectedTypes.push("QRM");

    const typePhrase =
        selectedTypes.length === 1
            ? `de type ${selectedTypes[0]}`
            : `de type QCM ou QRM`;

    const prompt = `Tu es un générateur de quiz en français strictement .

Génère 1 question ${typePhrase} au format JSON.

    La question doit être un objet avec :
    - "question": string
    - "choices": tableau de 4 strings
    - "correct": un index (QCM) ou tableau d’index (QRM)

    Réponds uniquement avec un tableau JSON. Aucun texte autour.

    Voici le texte à utiliser, ignore les balises HTML :
    ${text}`;


    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        }
    );

    const data = await response.json();

    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Protection : si réponse vide ou partielle
    if (!textResponse || !textResponse.includes("[") || !textResponse.includes("]")) {
        throw new Error("Gemini a renvoyé une réponse vide ou incomplète.");
    }

    // Extraction du JSON
    const jsonStart = textResponse.indexOf("[");
    const jsonEnd = textResponse.lastIndexOf("]") + 1;
    const jsonString = textResponse.slice(jsonStart, jsonEnd);

    try {
        return JSON.parse(jsonString);
    } catch {
        //empty pour pas laisser de console.error ;)
        return [];
    }
}
