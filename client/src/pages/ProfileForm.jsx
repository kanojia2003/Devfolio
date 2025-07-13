import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", github: "", linkedin: "",
    skills: "", education: "", experience: "", others: ""
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parsedSuccess, setParsedSuccess] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const profile = res.data;
        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          github: profile.github || "",
          linkedin: profile.linkedin || "",
          skills: profile.skills?.join(", ") || "",
          education: profile.education || "",
          experience: profile.experience || "",
          others: profile.others || ""
        });
      } catch (err) {
        console.log("No profile found.");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (e) => setResumeFile(e.target.files[0]);

  const handleParseResume = async () => {
    if (!resumeFile) return alert("Please upload a resume first.");

    const formDataToSend = new FormData();
    formDataToSend.append("resume", resumeFile);

    try {
      setParsing(true);
      const res = await axios.post("http://localhost:7000/parse-resume", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const parsed = res.data;
      setFormData({
        name: parsed.name || "", email: parsed.email || "", phone: parsed.phone || "",
        github: parsed.github || "", linkedin: parsed.linkedin || "",
        skills: parsed.skills?.join(", ") || "", education: parsed.education || "",
        experience: parsed.experience || "", others: parsed.others || ""
      });

      setParsedSuccess(true);
      setTimeout(() => setParsedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Error parsing resume");
    } finally {
      setParsing(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const token = await auth.currentUser.getIdToken();

      console.log("🔐 Sending token to backend:", token.slice(0, 20), "...");

      const res = await axios.post("http://localhost:5000/api/profile", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-8 transition-all duration-300">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Build Your <span className="text-indigo-600">Developer Profile</span>
        </h1>

        {/* Resume Upload */}
        <div className="border border-dashed border-indigo-400 rounded-lg p-4 bg-indigo-50">
          <label className="block text-indigo-700 font-semibold mb-2">Upload Resume (.pdf)</label>
          <div className="flex items-center flex-wrap gap-4">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="text-sm bg-white border rounded px-3 py-1"
            />
            <button
              onClick={handleParseResume}
              disabled={parsing || !resumeFile}
              className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
            >
              {parsing ? "Parsing..." : "Parse & Autofill"}
            </button>
            {parsedSuccess && (
              <span className="text-green-600 text-sm font-semibold animate-bounce">✔️ Resume Parsed!</span>
            )}
          </div>
        </div>

        {loadingProfile ? (
          <p className="text-center text-gray-500 animate-pulse">Loading profile...</p>
        ) : (
          <>
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
              <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
              <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
              <Input label="GitHub" name="github" value={formData.github} onChange={handleChange} />
              <Input label="LinkedIn" name="linkedin" value={formData.linkedin} onChange={handleChange} />
              <Input label="Skills (comma separated)" name="skills" value={formData.skills} onChange={handleChange} />
            </div>

            <TextArea label="Education" name="education" value={formData.education} onChange={handleChange} />
            <TextArea label="Experience" name="experience" value={formData.experience} onChange={handleChange} />
            <TextArea label="Other Info (Achievements, Awards, etc.)" name="others" value={formData.others} onChange={handleChange} />

            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              {saveSuccess ? "✅ Saved!" : "Save Profile"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Reusable Input Field
const Input = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

// Reusable TextArea
const TextArea = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={4}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);
