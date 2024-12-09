import OpenAI from "openai";
import { PlanType } from "../components/planquestionnaire";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generatePlanQuestions(
  type: PlanType,
  goals: string
): Promise<string[]> {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  const prompt =
    type === "workout"
      ? "You are a certified fitness trainer. Generate 5 relevant questions to create a personalized workout plan. Questions should cover fitness level, schedule, equipment access, and any limitations."
      : "You are a certified nutritionist. Generate 5 relevant questions to create a personalized diet plan. Questions should cover dietary preferences, restrictions, current eating habits, and lifestyle.";

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: `Generate questions for someone with these goals: ${goals}`,
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

export async function generatePlan(
  type: PlanType,
  goals: string,
  answers: Record<string, string>
): Promise<string> {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  const questionsAndAnswers = Object.entries(answers)
    .map(([q, a]) => `Q: ${q}\nA: ${a}`)
    .join("\n\n");

  const prompt =
    type === "workout"
      ? "You are a certified fitness trainer. Create a detailed workout plan based on the user's goals and answers. Include exercise descriptions, sets, reps, and weekly schedule."
      : "You are a certified nutritionist. Create a detailed meal plan based on the user's goals and answers. Include meal suggestions, portions, and nutritional guidance.";

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: `Create a ${type} plan with the following information:\n\nGoals: ${goals}\n\nUser Information:\n${questionsAndAnswers}`,
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || "Unable to generate plan";
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error(`Failed to generate ${type} plan`);
  }
}
