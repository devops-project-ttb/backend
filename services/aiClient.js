import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
class AIClient {
  constructor(apiKey) {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.geminiAI = new GoogleGenerativeAI(apiKey);
  }

  async analyzeImage({ model = "gemini-1.5-flash", imageUrl, prompt }) {
    try {
      const modelInstance = this.geminiAI.getGenerativeModel({ model });

      const response = await modelInstance.generateContent([
        { text: prompt },
        { inlineData: { mimeType: "image/png", data: imageUrl } },
      ]);
      // const n8n_response = await axios.get(process.env.N8N_WEBHOOK_URL)
      
      return response.response.text();
    } catch (error) {
      console.error(`Erreur lors de l'analyse de l'image avec Gemini: ${error.message}`);
      throw new Error("Échec de la requête vers Gemini.");
    }
  }


  async imageUrlToBase64(imageUrl) {
    try {
      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      return Buffer.from(response.data).toString("base64");
    } catch (error) {
      console.error(`Erreur lors de la conversion de l'image en Base64: ${error.message}`);
      throw new Error("Impossible de convertir l'image.");
    }
  }

  async answerPrompt(prompt, model = "gemini-1.5-flash") {
    try {
      const modelInstance = this.geminiAI.getGenerativeModel({ model });
  
      const response = await modelInstance.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
  
      return response.response.text();
    } catch (error) {
      console.error(`Erreur lors de la réponse à la requête: ${error.message}`);
      throw new Error("Impossible de répondre à la requête.");
    }
  }
}

export default AIClient;
