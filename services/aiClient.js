import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

class AIClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.geminiAI = new GoogleGenerativeAI(apiKey);
  }

  async analyzeImage({ model = "gemini-1.5-flash", imageUrl, prompt }) {
    try {
      const modelInstance = this.geminiAI.getGenerativeModel({ model });

      // Convertir l'image en Base64
      const imageBase64 = await this.imageUrlToBase64(imageUrl);

      // Envoyer la requête avec l'image encodée
      const response = await modelInstance.generateContent([
        { text: prompt },
        { inlineData: { mimeType: "image/png", data: imageBase64 } },
      ]);

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
}

export default AIClient;
