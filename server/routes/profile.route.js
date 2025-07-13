const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const Profile = require("../models/profile.model");

// GET user profile
router.get("/", verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ uid: req.user.uid });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// POST (create/update) user profile
router.post("/", verifyToken, async (req, res) => {
  try {
    const update = req.body;
    update.skills = update.skills?.split(",").map(skill => skill.trim()); // convert string → array
    const profile = await Profile.findOneAndUpdate(
      { uid: req.user.uid },
      { ...update, uid: req.user.uid },
      { new: true, upsert: true }
    );
    res.json({ message: "Profile saved successfully", profile });
  } catch (err) {
    res.status(500).json({ error: "Failed to save profile" });
  }
});

module.exports = router;
