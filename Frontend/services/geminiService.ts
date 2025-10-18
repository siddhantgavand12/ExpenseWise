import { GoogleGenAI } from "@google/genai";
import { Expense, Budget, UserCategory } from '../types';

// FIX: A proper implementation for the geminiService is created to provide AI-powered expense analysis.
// Per guidelines, initialize the GoogleGenAI client with an API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes the user's expense data using the Gemini API.
 * @param expenses - Array of user's expenses.
 * @param budgets - Array of user's budgets.
 * @param categories - Array of user's categories.
 * @returns A markdown string with the AI's analysis.
 */
export async function analyzeExpensesWithAI(
  expenses: Expense[],
  budgets: Budget[],
  categories: UserCategory[]
): Promise<string> {
  if (expenses.length === 0) {
    return "There are no expenses to analyze. Please add some expenses first.";
  }

  const prompt = `
You are a friendly and insightful financial advisor AI. Your goal is to help the user understand their spending habits and find ways to save money.
Analyze the provided JSON data about their recent expenses and budgets.

**User's Financial Data:**
- **Currency:** Indian Rupee (₹)
- **Spending Categories:** ${JSON.stringify(categories.map(c => c.name))}
- **Category Budgets:** ${JSON.stringify(budgets)}
- **Recent Expenses (up to 50 entries):** ${JSON.stringify(expenses.slice(-50), null, 2)}

**Your Task:**
Based on the data, provide a concise and actionable financial analysis in markdown format. Structure your response with the following sections:

## Spending Overview
Provide a brief, high-level summary of the user's spending. Mention the total amount spent and the top spending categories.

## Budget Performance
Compare the spending in each category against its budget. Identify which categories are over, under, or on budget. Use a list format.

## Key Insights
Point out 1-2 interesting or significant patterns you've noticed. This could be high spending on a particular day, frequent small purchases, or unexpected expenses.

## Actionable Recommendations
Offer 2-3 specific, practical, and easy-to-implement tips for financial improvement based on your analysis.

**Formatting Rules:**
- Use '##' for main headings and '###' for subheadings if needed.
- Use '*' for list items.
- Use '**' to bold key terms and figures (e.g., **₹1,234** or **Groceries**).
- Keep the tone encouraging and helpful.
- The entire response should be in English.
  `;

  try {
    // FIX: Using 'gemini-2.5-flash' model for its balance of speed and capability in text-based analysis, as per guidelines.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      // FIX: The prompt is correctly passed as 'contents'.
      contents: prompt,
    });
    // FIX: The generated text is correctly extracted from the 'text' property of the response object.
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Provide a user-friendly error message
    if (error instanceof Error && error.message.includes('API key not valid')) {
        return "There was an error with the AI service. Please ensure your API key is configured correctly.";
    }
    return "Sorry, I couldn't complete the analysis due to an unexpected error. Please try again later.";
  }
}

/**
 * Gets an icon suggestion for a new category using the Gemini API.
 * @param categoryName - The name of the new category.
 * @param availableIcons - A list of available icon keys.
 * @returns A string representing the suggested icon key.
 */
export async function getIconForCategory(categoryName: string, availableIcons: string[]): Promise<string> {
  const prompt = `
    From the following list of available icon names, which one best represents the category "${categoryName}"?
    Available icons: ${availableIcons.join(', ')}.
    Please respond with ONLY the single most appropriate icon name from the list. Do not add any explanation or punctuation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    const iconName = response.text.trim().toLowerCase();
    
    // Validate the response from the model
    if (availableIcons.includes(iconName)) {
      return iconName;
    }
    // Fallback if the model returns an invalid icon name
    return 'other';
  } catch (error) {
    console.error("Error getting icon from Gemini API:", error);
    // Fallback on error
    return 'other';
  }
}
