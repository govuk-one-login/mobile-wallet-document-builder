import pino from "pino";
import PinoHttp from "pino-http";
import { getLogLevel } from "../config/appConfig";

const logger = pino({
  name: "mobile-wallet-document-builder",
  level: getLogLevel(),
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    bindings: (bindings) => {
      return { hostname: bindings.hostname };
    },
  },
  serializers: {
    req: (req) => {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
      };
    },
    res: (res) => {
      return {
        status: res.statusCode,
      };
    },
  },
});

const loggerMiddleware = PinoHttp({
  logger,
  wrapSerializers: false,
  customErrorMessage: function (error, res) {
    return "Request errored with status code: " + res.statusCode;
  },
  customSuccessMessage: function (req, res) {
    if (res.statusCode === 404) {
      return "resource not found";
    }
    return `${req.method} completed with status code ${res.statusCode}`;
  },
  customAttributeKeys: {
    responseTime: "timeTaken",
  },
});

export { logger, loggerMiddleware };
