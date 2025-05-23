import AIClient from "../services/aiClient.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const aiClient = new AIClient(process.env.GEMINI_API_KEY); // Utilisation de la clé API stockée

export default async function imageRoutes(fastify, options) {
  fastify.post("/images/analyze", async (request, reply) => {
    try {
      const { imageUrl } = request.body;

      if (!imageUrl) {
        return reply.code(400).send({ error: "L'URL de l'image est requise." });
      }

      const prompt = `
      Tu es un expert en œnologie et en biérologie. Analyse cette image d'une bouteille de vin ou de bière et retourne un JSON strictement conforme au schéma suivant :
      {
        "nom": "Nom de la bouteille",
        "provenance": "Brasserie ou Domaine et Pays",
        "histoire": "Brève histoire de la boisson et de son fabricant",
        "accompagnement": "Suggestions de plats et fromages qui s’accordent avec cette boisson"
      }
      Réponds uniquement avec un JSON valide, sans texte additionnel, sans mise en forme et sans balises de code.
      `;

      // 🔍 Analyse de l'image via Gemini
      const result = await aiClient.analyzeImage({
        model: "gemini-1.5-flash",
        imageUrl,
        prompt,
      });

      // 🛠 Nettoyer la réponse et extraire le JSON
      const cleanedResult = result.replace(/```json|```/g, "").trim();

      // 📌 Vérification si la réponse est bien un JSON
      let jsonResponse;
      try {
        jsonResponse = JSON.parse(cleanedResult);
      } catch (parseError) {
        console.error("Erreur de parsing JSON :", parseError);
        return reply.code(500).send({ error: "La réponse de l'IA n'est pas un JSON valide." });
      }

      // 🔥 Vérification des champs attendus
      if (!jsonResponse.nom || !jsonResponse.provenance || !jsonResponse.histoire || !jsonResponse.accompagnement) {
        return reply.code(500).send({ error: "Le JSON retourné par l'IA est incomplet." });
      }
      const n8n_response = await axios.get("https://etiket.app.n8n.cloud/webhook-test/scan",{
        data: {
        jsonResponse
        }
      });
      return reply.send({ message: "Analyse réussie", data: jsonResponse });
    } catch (error) {
      console.error("Erreur lors de l'analyse de l'image :", error);
      reply.code(500).send({ error: "Erreur lors de l'analyse de l'image." });
    }
  });

  fastify.post("/images/answer", async (request, reply) => {
    try {
      const { prompt } = request.body;

      if (!prompt) {
        return reply.code(400).send({ error: "La question est requise." });
      }

      // 🔍 Réponse à la question via Gemini
      const result = await aiClient.answerPrompt(prompt);
      console.log(result);
      
      return reply.send({ message: "Réponse réussie", data: result });
    } catch (error) {
      console.error("Erreur lors de la réponse à la question :", error);
      reply.code(500).send({ error: "Erreur lors de la réponse à la question." });
    }
  } );
}
