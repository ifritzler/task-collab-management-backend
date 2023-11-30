import { ConnectOptions } from "mongoose";
import packageJson from "../package.json";

/**
 * Pattern for config is:
 * key: process.env['KEY'] ?? default
 */
export const config = {
  version: packageJson.version,
  name: packageJson.name,
  description: packageJson.description,
  cookieSecret: process.env.cookieSecret ?? "secret",
  nodeEnv: process.env["NODE_ENV"] ?? "development",
  port: process.env["PORT"] ?? 3000,

  clientCorsOrigins: {
    test: process.env["DEV_ORIGIN"] ?? "*",
    development: process.env["DEV_ORIGIN"] ?? "*",
    production: process.env["PROD_ORIGIN"] ?? "none",
  },

  jwtTokenSecret: process.env["JWT_TOKEN_SECRET"] as string,
  jwtRefreshSecret: process.env["JWT_TOKEN_REFRESH_SECRET"] as string,

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
