import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import expressSession from "express-session";

import "./configs/dotenvConfig.js";
import { corsConfig } from "./configs/corsConfig.js";
import { sessionConfig } from "./configs/sessionConfig.js";

import { printMySQLVersion } from "./database/db_utils.js";
printMySQLVersion();

import authRouter from "./routers/authRouter.js";
import saveRouter from "./routers/saveRouter.js";
import lbRouter from "./routers/lbRouter.js"

const app = express();

app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession(sessionConfig));

app.use("/auth", authRouter);
app.use("/save", saveRouter);
app.use("/leaderboard", lbRouter)

app.get('/', (req,res) => { // Homepage
    res.send("ya mum yah?")
}); 

app.get('/verify', (req, res) => {
    res.send({success: req.session.authenticated === true})
})

app.get("*", (req, res) => {
  res.status(404).send("NOT FOUND");
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});