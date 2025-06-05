export async function generateFlashcardsFromGemini(chapter) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: `Tu es un générateur de flashcards en français strictement. Génère 10 flashcards en JSON (question + réponse) à partir de strictement ce chapitre : ${chapter}` }]
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
    const jsonString = generatedText.substring(jsonStart, jsonEnd);
    const parsedFlashcards = JSON.parse(jsonString);
    return parsedFlashcards;
}
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

    Voici le texte :
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
