import app from "./app";
import config from "./config";
import mongoose from "mongoose";

// @ts-expect-error any
mongoose.connect(config.database[config.nodeEnv].uri, config.database[config.nodeEnv].config).then(
  () => {
    console.info("Database ready ✅");
    app.listen(config.port, () => {
      console.info(`🚀 ${config.name} ${config.version} 🚀`);
      console.info(`🚀 Listening on ${config.port} with NODE_ENV=${config.nodeEnv} 🚀`);
    });
  },
  (reason) => {
    console.error(reason);
    process.exit(1);
  },
);
