import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {

    try {

        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."


        const ai = new GoogleGenAI({});

        const stream = await ai.interactions.create({
            model: "gemini-3.8-flash",
            input: prompt,
            stream: true,
            generation_config: {
                thinking_level: "low",
            },
        });

        let output = "";
        for await (const event of stream) {

            if (event.event_type === "step.delta") {
                if (event.delta.type === "text") {
                    output += event.delta.text;
                }
            }

        }

        return Response.json({ success: true, message: output }, { status: 200 });

    } catch (error) {
        console.error("Error suggesting messages:", error);
        return Response.json({ success: false, message: "Error suggesting messages" }, { status: 500 });
    }

}