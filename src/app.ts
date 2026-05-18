import express from "express";
import cors from "cors";
import routes from "./routes";
import path from "path";
import { errorMiddleware } from "./middleware/error.middleware";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.use("/api", routes);


app.get("/", (req, res) => {
    res.send("Server running");
});
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use(errorMiddleware);

export default app;
