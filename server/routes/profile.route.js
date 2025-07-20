// server/routes/profile.route.js
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

// POST/UPDATE profile
router.post("/", verifyToken, async (req, res) => {
  const user = req.user;
  let {
    name, email, phone, github, linkedin,
    skills, education, experience, summary, projects, others, certificates,
    selectedTemplate
  } = req.body;

  // Skills should already be processed on the client side
  // No need to process skills here as they're already in the correct format

  try {
    const profileData = {
      name, email, phone, github, linkedin,
      skills,
      education, experience, summary, projects, others, certificates,
      selectedTemplate,
    };

    const updated = await Profile.findOneAndUpdate(
      { uid: user.uid },
      { uid: user.uid, ...profileData },
      { upsert: true, new: true }
    );

    res.json({ message: "Profile updated", profile: updated });
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ error: "Failed to save profile" });
  }
});

module.exports = router;