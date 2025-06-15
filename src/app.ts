import express from "express";
import cors from "cors";
import generateVhdlRoute from "./routes/generateVhdl";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", generateVhdlRoute);

export default app;
