import express from "express";
import dotenv from "dotenv";
import { connect } from "./config/db.js";

dotenv.config();

const app = express();
app.use(express.json());

await connect();

app.get("/", (req, res) => {
    res.send("HireLens backend up and running")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})