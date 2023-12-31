import { Router } from "express";
import * as db_save from "../database/db_save.js";
const router = Router();

router.get("/", (_, res) => {
  res.send("Welcome to save router!");
});

router.post("/newSaveData", async (req, res) => {
  const session = req.cookies.session;
  req.sessionStore.get(session, async (err, session) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error getting events" });
      return;
    }
    if (session === null) {
      res.status(400).json({ message: "Invalid session" });
      return;
    }
    const body = {
      user_id: session.user_id,
      last_xpos: req.body.last_xpos,
      last_ypos: req.body.last_ypos,
      timer: req.body.timer,
      save_datetime: new Date(),
      is_slime_defeated: req.body.is_slime_defeated,
      is_pumpkin_defeated: req.body.is_pumpkin_defeated
    }

    console.log(session.user_id);

    let success;
    if (req.body.has_save == true) {
      // Update query
      success = db_save.setUserSave(body);
    } else {
      // Insert query
      success = db_save.newUserSave(body);
    }
    if (success) {
      res.json({success: true, message: "Succesfully saved user data"});
      return;
    } else {
      res.status(500).json({success: false, message: "Failed to save user data"});
      return;
    }
  })
});

router.post("/saveData", async (req, res) => {
  const session = req.cookies.session;
  req.sessionStore.get(session, async (err, session) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error getting events" });
      return;
    }
    if (session === null) {
      res.status(400).json({ message: "Invalid session" });
      return;
    }
    const saveData = await db_save.getUserSave(session.user_id);
    if(saveData) {
      res.json({ success: true, message: "Retrieved user save data", 
      username: session.username, 
      last_xpos: saveData.last_xpos, 
      last_ypos: saveData.last_ypos, 
      save_datetime: saveData.save_datetime, 
      is_slime_defeated: saveData.is_slime_defeated,
      is_pumpkin_defeated: saveData.is_pumpkin_defeated,
      timer: saveData.timer});
      return;
    } else {
      res.json({success: false, message: "Player has no save data"});
      return;
    }


  })
});

export default router;
