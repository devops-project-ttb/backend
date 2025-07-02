import AIClient from "../services/aiClient.js";
import dotenv from "dotenv";
import axios from "axios";
import { findSimilarItem, addItemToUser } from "../models/item.js";
dotenv.config();

const aiClient = new AIClient(process.env.GEMINI_API_KEY); // Utilisation de la clé API stockée

export default async function imageRoutes(fastify, options) {
  fastify.post("/images/analyze", async (request, reply) => {
    try {
      const { imageUrl, user_id } = request.body;

      if (!imageUrl) {
        return reply.code(400).send({ error: "L'URL de l'image est requise." });
      }

      const prompt = `
Tu es un expert en œnologie et en biérologie. Analyse cette image d’une bouteille de vin ou de bière et retourne **uniquement** un JSON **valide** parfaitement conforme au schéma suivant, sans texte additionnel, sans mise en forme, sans explication, ni balises de code.

Voici le format attendu, qui correspond au modèle d'une entité "Item" dans une base de données :

{
  "item_name": "Nom complet de la boisson (marque + type + cuvée)",
  "type_id": "1" si bière et "0" si vin,
  "provenance": "Domaine ou brasserie, Ville, Pays",
  "description": "Description détaillée des caractéristiques de la boisson (style, arômes, saveurs, process de fabrication...)",
  "aromes": ["arôme principal 1", "arôme 2", "arôme 3"],
  "accords": ["plat ou fromage 1", "plat 2", "dessert 3"],
  "note": Note sur 10 en chiffre entier (si absente, mets null),
  "image": null
}
`;

      // 🔍 Analyse de l'image via Gemini
      const result = await aiClient.analyzeImage({
        model: "gemini-1.5-flash",
        imageUrl,
        prompt,
      });
      // 🛠 Nettoyer la réponse et extraire le JSON
      const cleanedResult = result.replace(/```json|```/g, "").trim();
      console.log("Réponse brute de Gemini :", cleanedResult);
      // 📌 Vérification si la réponse est bien un JSON
      let jsonResponse;
      try {
        jsonResponse = JSON.parse(cleanedResult);
      } catch (parseError) {
        console.error("Erreur de parsing JSON :", parseError);
        return reply
          .code(500)
          .send({ error: "La réponse de l'IA n'est pas un JSON valide." });
      }
      const similarItem = await findSimilarItem(jsonResponse.item_name);
      console.log("Item similaire trouvé :", similarItem);
      if (similarItem) {
        await addItemToUser(user_id, similarItem.item_id);
        return reply.send({
          message: "Boisson déjà connue",
          data: similarItem,
        });
      } else {
        const n8n_response = await axios.get(
          "https://n8n-g6sm.onrender.com/webhook/scan",
          {
            data: {
              jsonResponse,
            },
          }
        );
        return reply.send({ message: "Analyse réussie", data: jsonResponse });
      }
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
      reply
        .code(500)
        .send({ error: "Erreur lors de la réponse à la question." });
    }
  });
}
