import { saveLog } from "./logStorage.js";
import pino from "pino";
const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: { colorize: true },
  },
  hooks: {
    logMethod(inputArgs, method) {
      saveLog(inputArgs[0]);
      return method.apply(this, inputArgs);
    },
  },
});
export default logger;
