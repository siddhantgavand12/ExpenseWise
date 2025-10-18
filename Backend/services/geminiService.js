const { GoogleGenAI } = require("@google/genai");

// This assumes you have API_KEY set in your .env file
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function getIconForCategory(categoryName, availableIcons) {
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
    
    if (availableIcons.includes(iconName)) {
      return iconName;
    }
    return 'other'; // Fallback
  } catch (error) {
    console.error("Error getting icon from Gemini API on server:", error);
    return 'other'; // Fallback
  }
}

module.exports = { getIconForCategory };
