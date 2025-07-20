const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: String,
  email: String,
  phone: String,
  github: String,
  linkedin: String,
  skills: [mongoose.Schema.Types.Mixed], // Support both string skills and categorized skills objects
  summary: String,     
  projects: String, 
  education: [mongoose.Schema.Types.Mixed], // Support both string education and categorized education objects
  experience: String,
  others: String,
  certificates: [mongoose.Schema.Types.Mixed], // Support certificates with links
  selectedTemplate: { type: String, default: "Template2" }
}, { timestamps: true });

module.exports = mongoose.model("Profile", ProfileSchema);
