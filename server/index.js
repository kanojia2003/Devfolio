const express = require('express');
const cors = require('cors');
const verifyToken = require("./middleware/verifyToken");

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send("API Running 🚀"));


// ✅ Add your protected route here
app.post("/api/profile", verifyToken, (req, res) => {
  const user = req.user; // set by verifyToken middleware
  const { name, bio } = req.body;

  console.log("Verified UID:", user.uid);

  // Later you can save this data to MongoDB here

  return res.json({
    message: "Profile received!",
    userId: user.uid,
    name,
    bio
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
