import OpenAI from 'openai';

export async function detectLanguage(text: string): Promise<string> {
    const openai = new OpenAI();
    
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: "Detect the language of the following text and return only the ISO language code (e.g., 'en', 'ar', 'es')."
            },
            { role: "user", content: text }
        ]
    });

    return response.choices[0].message.content?.trim() || 'en';
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
    const openai = new OpenAI();
    
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: `Translate the following text to ${targetLanguage}. Maintain the original formatting and structure.`
            },
            { role: "user", content: text }
        ]
    });

    return response.choices[0].message.content || text;
}
