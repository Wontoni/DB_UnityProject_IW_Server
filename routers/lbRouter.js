import { Router } from "express";
import * as db_leaderboard from "../database/db_leaderboard.js";
const router = Router();

router.get('/', (req, res) => {
    res.send("Welcom to leaderboard.")
})

router.get('/getLeaderboardData', async (req, res) => {
    if (req.session.authenticated) {
       const lbData = await db_leaderboard.getLeaderboardData()

        if (lbData) {
            res.json({success: true, message: "Retrieved leaderboard data",
            data: lbData})
        }  else {
            res.json({success: false, message: "Leaderboard error"});
            return;
          }

      } else {
        res.status(400).json({success: false, message: "Invalid session"});
        return;
      }
})