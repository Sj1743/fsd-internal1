import express from "express";
import cors from "cors";
import { taskRouter } from "./routes/tasks.js";
const app = express();
const port = Number(process.env.PORT ?? 4000);
app.use(cors());
app.use(express.json());
app.get("/health", (_req, res) => res.json({ success: true, status: "ok" }));
app.use("/api/tasks", taskRouter);
app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
});
