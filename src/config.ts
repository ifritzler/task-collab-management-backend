import { ConnectOptions } from "mongoose";
import packageJson from "../package.json";

/**
 * Pattern for config is:
 * key: process.env['KEY'] ?? default
 */
const config = {
  version: packageJson.version,
  name: packageJson.name,
  description: packageJson.description,

  nodeEnv: process.env["NODE_ENV"] ?? "development",
  port: process.env["PORT"] ?? 3000,

  clientCorsOrigins: {
    test: process.env["DEV_ORIGIN"] ?? "*",
    development: process.env["DEV_ORIGIN"] ?? "*",
    production: process.env["PROD_ORIGIN"] ?? "none",
  },

  database: {
    test: {
      uri: process.env.DATABASE_URI ?? "mongodb://127.0.0.1:27017",
      config: {
        dbName: "test",
      } as ConnectOptions,
    },
    development: {
      uri: process.env.DATABASE_URI ?? "mongodb://127.0.0.1:27017",
      config: {
        dbName: "develop",
      } as ConnectOptions,
    },
    production: {
      uri: process.env.DATABASE_URI,
      config: {
        dbName: "production",
      } as ConnectOptions,
    },
  },
};

export default config;
