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

const ignorePaths = [
  "/public/stylesheets/application.css",
  "/assets/images/govuk-crest.png",
  "/assets/fonts/light-94a07e06a1-v2.woff2",
  "/assets/fonts/bold-b542beb274-v2.woff2",
  "/assets/images/favicon.ico",
  "/healthcheck",
  "/",
];

const loggerMiddleware = PinoHttp({
  logger,
  wrapSerializers: false,
  autoLogging: { ignore: (req) => ignorePaths.includes(req.url!) },
  customErrorMessage: function (error, res) {
    return "Request errored with status code: " + res.statusCode;
  },
  customSuccessMessage: function (req, res) {
    if (res.statusCode === 404) {
      return "Resource not found";
    }
    return `${req.method} completed with status code ${res.statusCode}`;
  },
  customAttributeKeys: {
    responseTime: "timeTaken",
  },
});

export { logger, loggerMiddleware };
