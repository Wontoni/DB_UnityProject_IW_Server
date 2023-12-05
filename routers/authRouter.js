import { Router } from "express";
import { hash, compare, genSaltSync } from "bcrypt";
import * as db_auth from "../database/db_auth.js";

const hashCount = 12;
const router = Router();
const hashSalt = genSaltSync(hashCount);

router.get("/", (_, res) => {
  res.send("Welcome to authentication router!");
});

router.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const hashedPassword = await hash(password, hashSalt);
  const credentials = {
    email,
    username,
    password: hashedPassword,
    date: new Date(),
  };
  try {
    const isSuccessful = await db_auth.register(credentials);
    if (isSuccessful) {
      res.json({ success: true });
      return;
    }
    res.status(500).json({ message: "Error registering user" });
  } catch (error) {
    console.log(error);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(403).json({ message: "User or email already exists" });
      return;
    }
    res.status(500).json({ message: "Error registering user" });
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await db_auth.getUserByEmail(email);
    if (!user) {
      res.json({ message: "User not found" });
      return;
    }
    if (!(await compare(password, user.password))) {
      res.json({ message: "Incorrect password" });
      return;
    }
    req.session.authenticated = true;
    req.session.user_id = user.user_id;
    req.session.username = user.username;

    let saveData;
    if(user.has_save) {
      saveData = await db_auth.getUserSave(user.user_id);
    }
    const userInfo = {
      username: user.username,
      saveData: saveData
    };
    

    res.json({ success: true, user: userInfo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error logging in" });
    return;
  }
});

router.post("/logout", (req, res) => {
  if (req.session.authenticated) {
    req.session.destroy();
    res.send({success: true});
  } else {
    res.status(500).send({success: false, message: "Error logging out"});
  }
});

export default router;
