const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: String,
  email: String,
  phone: String,
  github: String,
  linkedin: String,
  skills: [String],
  education: String,
  experience: String,
  others: String,
  selectedTemplate: { type: String, default: "default" }
}, { timestamps: true });

module.exports = mongoose.model("Profile", ProfileSchema);
