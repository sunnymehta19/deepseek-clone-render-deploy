import "dotenv/config";
import express from 'express'
import cookieParser from "cookie-parser";
import cors from "cors"
import database from "./config/mongooseConnection.js"

database();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
  })
);

import userRouter from "./routes/auth/authRouter.js"
import promptRouter from "./routes/prompt/promptRouter.js"

app.use("/api/user", userRouter);
app.use("/api/deepseek", promptRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});