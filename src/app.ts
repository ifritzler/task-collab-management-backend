import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import fileUpload from "express-fileupload";

import config from "./config";
import errorHandler from "./middleware/errorHandler";
import fourOhFour from "./middleware/fourOhFour";
import root from "./routes/root";

const app = express();

// Apply most middleware first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.cookieSecret));
app.use(
  fileUpload({
    debug: config.nodeEnv === "development",
    useTempFiles: true,
    tempFileDir: "./tmp/",
    abortOnLimit: true,
    responseOnLimit: "Upload image too large.",
    createParentPath: true,
  }),
);

app.use(
  cors({
    // @ts-expect-error any
    origin: config.clientCorsOrigins[config.nodeEnv] ?? "*",
  }),
);

app.use(helmet());
app.use(morgan("tiny"));

// Apply routes before error handling
app.use("/api", root);

// Apply error handling last
app.use(fourOhFour);
app.use(errorHandler);

export default app;
