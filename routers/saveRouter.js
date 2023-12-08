import { Router } from "express";
import * as db_save from "../database/db_save.js";
const router = Router();

router.get("/", (_, res) => {
  res.send("Welcome to save router!");
});

router.post("/newSaveData", async (req, res) => {
  if (req.session.authenticated) {
    const body = {
      user_id: req.session.user_id,
      last_xpos: req.body.last_xpos,
      last_ypos: req.body.last_ypos,
      timer: req.body.timer,
      save_datetime: new Date(),
      is_slime_defeated: req.body.is_slime_defeated
    }
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
  } else {
    res.status(400).json({success: false, message: "Invalid session"});
    return;
  }
});

router.post("/saveData", async (req, res) => {
  if(req.session.authenticated) {
    const saveData = await db_save.getUserSave(req.session.user_id);
    if(saveData) {
  
      res.json({ success: true, message: "Retrieved user save data", 
      username: req.session.username, 
      last_xpos: saveData.last_xpos, 
      last_ypos: saveData.last_ypos, 
      save_datetime: saveData.save_datetime, 
      is_slime_defeated: saveData.is_slime_defeated,
      timer: saveData.timer});
      return;
    } else {
      res.json({success: false, message: "Player has no save data"});
      return;
    }
  } else {
    res.status(400).json({success: false, message: "Invalid session"});
    return;
  }
});

export default router;
