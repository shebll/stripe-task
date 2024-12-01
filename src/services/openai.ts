import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `You are HealthChat, a specialized AI health assistant focused exclusively on health and healthcare-related topics. 

Your responsibilities:
1. ONLY answer questions related to health, medical information, wellness, and healthcare
2. For any question not related to health or healthcare, respond with: "Sorry, I can only answer your healthcare concerns."
3. When answering health questions:
   - Provide accurate, evidence-based health information
   - Maintain a professional and compassionate tone
   - Include appropriate disclaimers about consulting healthcare professionals
   - Focus on general health education and wellness guidance

Remember: If a question is not about health or healthcare, always respond with the standard message regardless of how the question is phrased.`;

export async function getAIResponse(userMessage: string): Promise<string> {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    if (error.code === "insufficient_quota") {
      return "I apologize, but the service is currently unavailable due to high demand. Please try again later.";
    }
    return "I apologize, but I am experiencing technical difficulties. Please try again later.";
  }
}

export async function generateCarePlanQuestions(
  symptoms: string
): Promise<string[]> {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a medical professional. Generate 5 relevant follow-up questions to gather more information about the patient's symptoms. Questions should be specific and help in creating a comprehensive care plan.",
        },
        {
          role: "user",
          content: `Generate 5 follow-up questions for a patient reporting: ${symptoms}`,
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
    });

    const questions =
      completion.choices[0]?.message?.content
        ?.split("\n")
        .filter((q) => q.trim())
        .slice(0, 5) || [];

    return questions;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate questions");
  }
}

export async function generateCarePlan(
  symptoms: string,
  answers: Record<string, string>
): Promise<string> {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const questionsAndAnswers = Object.entries(answers)
      .map(([q, a]) => `Q: ${q}\nA: ${a}`)
      .join("\n\n");

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a medical professional. Create a comprehensive care plan based on the patient's symptoms and their answers to follow-up questions. Include lifestyle recommendations, self-care tips, and when to seek professional medical attention.",
        },
        {
          role: "user",
          content: `Create a care plan for a patient with the following symptoms and information:\n\nSymptoms: ${symptoms}\n\nAdditional Information:\n${questionsAndAnswers}`,
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1000,
    });

    return (
      completion.choices[0]?.message?.content || "Unable to generate care plan"
    );
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate care plan");
  }
}

export async function generateDailyHealthTip(): Promise<string> {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a health and wellness expert. Provide a concise, practical daily health tip focusing on one key aspect of healthy living. Include a brief explanation of why it's important.",
        },
        {
          role: "user",
          content: "Generate a daily health tip for today.",
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 200,
    });

    return completion.choices[0]?.message?.content || "Stay healthy!";
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate daily health tip");
  }
}
