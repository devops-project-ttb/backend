import fs from "fs";
import path from "path";

const logsDir = "./logs"; // Dossier des logs
const logFilePath = path.join(logsDir, `logs-${new Date().toISOString().split("T")[0]}.jsonl`);

function removeCircularReferences(obj) {
  const seen = new WeakSet();
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return undefined; 
        seen.add(value);
      }
      return value;
    })
  );
}

export function saveLog(logData) {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  if(typeof logData === "string") logData = { message: logData };
  const safeLogData = maskSensitiveData(logData); // Nettoie les logs avant écriture

  fs.appendFile(logFilePath, safeLogData + "\n", (err) => {
    if (err) console.error("Erreur lors de l'écriture du log :", err);
  });
}

function maskSensitiveData(data) {
  const sensitiveKeys = ["password", "token", "apiKey","imageurl"];
  const visitedObjects = new WeakSet();

  function deepMask(obj) {
    if (typeof obj !== "object" || obj === null) return;

    if (visitedObjects.has(obj)) return;
    visitedObjects.add(obj);

    for (const key in obj) {
      if (sensitiveKeys.includes(key.toLowerCase())) {
        obj[key] = "********"; // Remplace les valeurs sensibles
      } else {
        deepMask(obj[key]); // Continue de parcourir l'objet récursivement
      }
    }
  }

  try {
    let logData = removeCircularReferences(data); // Supprime les références circulaires
    deepMask(logData); // Masque les données sensibles
    return JSON.stringify(logData);
  } catch (e) {
    console.error("Erreur lors du masquage des données sensibles :", e);
    return data;
  }
}
