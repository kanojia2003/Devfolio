// client/src/pages/ProfileForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    resume: "", // URL to resume for download
    summary: "",
    education: "",
    experience: "",
    projects: "",
    skills: "", // skills as multi-line string for textarea
    others: "",
    certificates: "" // certificates with links
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parsedSuccess, setParsedSuccess] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
          resume: profile.resume || "",
          summary: profile.summary || "",
          // Convert education data to formatted string for textarea
          education: Array.isArray(profile.education) 
            ? profile.education.map(edu => {
                // Check if education is a category object with entries
                if (edu && typeof edu === 'object' && edu.category && Array.isArray(edu.entries)) {
                  return `${edu.category}: ${edu.entries.map(entry => 
                    `${entry.degree || ''} | ${entry.institution || ''} | ${entry.date || ''} | ${entry.description || ''}`
                  ).join('\n')}`;  
                }
                // Otherwise, it's a simple education object
                else if (edu && typeof edu === 'object') {
                  return `${edu.degree || ''} | ${edu.institution || ''} | ${edu.date || ''} | ${edu.description || ''}`;
                }
                return edu;
              }).join('\n') 
            : (profile.education || ""),
          experience: profile.experience || "",
          projects: profile.projects || "",
          // Convert skills data to formatted string for textarea
          skills: Array.isArray(profile.skills) 
            ? profile.skills.map(skill => {
                // Check if skill is an object with category and items
                if (skill && typeof skill === 'object' && skill.category && Array.isArray(skill.items)) {
                  return `${skill.category}: ${skill.items.join(', ')}`;
                }
                // Otherwise, it's a simple string skill
                return skill;
              }).join('\n') 
            : (profile.skills || ""),
          others: profile.others || "",
          certificates: profile.certificates || ""
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
        name: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
        github: parsed.github || "",
        linkedin: parsed.linkedin || "",
        resume: parsed.resume || "",
        summary: parsed.summary || "",
        // Convert parsed education to formatted string
        education: Array.isArray(parsed.education) 
          ? parsed.education.map(edu => {
              // Check if education is already categorized
              if (edu && typeof edu === 'object' && edu.category && Array.isArray(edu.entries)) {
                return `${edu.category}: ${edu.entries.map(entry => 
                  `${entry.degree || ''} | ${entry.institution || ''} | ${entry.date || ''} | ${entry.description || ''}`
                ).join('\n')}`;
              }
              // Otherwise, it's a simple education object
              else if (edu && typeof edu === 'object') {
                return `${edu.degree || ''} | ${edu.institution || ''} | ${edu.date || ''} | ${edu.description || ''}`;
              }
              return edu;
            }).join('\n') 
          : (parsed.education || ""),
        experience: parsed.experience || "",
        projects: parsed.projects || "",
        // Convert parsed skills to formatted string
        skills: Array.isArray(parsed.skills) 
          ? parsed.skills.map(skill => {
              // Check if skill is already categorized
              if (skill && typeof skill === 'object' && skill.category && Array.isArray(skill.items)) {
                return `${skill.category}: ${skill.items.join(', ')}`;
              }
              return skill;
            }).join('\n') 
          : (parsed.skills || ""),
        others: parsed.others || "",
        certificates: parsed.certificates || ""
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
      // Process the data before sending
      const payload = {
        ...formData,
        // Process skills with categories
        skills: formData.skills.split('\n')
          .map(line => line.trim())
          .filter(Boolean)
          .map(line => {
            // Check if line has a category format (Category: skills)
            if (line.includes(':')) {
              const [category, skillsStr] = line.split(':').map(part => part.trim());
              const skills = skillsStr.split(',').map(skill => skill.trim()).filter(Boolean);
              return {
                category,
                items: skills
              };
            } else {
              // If no category format, just return the skill
              return line;
            }
          }),
        // Process projects to extract title, description, GitHub and live links
        projects: (() => {
          // If projects is already an array, return it as is
          if (Array.isArray(formData.projects)) {
            return formData.projects;
          }
          
          // If projects is a string, process it
          if (typeof formData.projects === 'string') {
            return formData.projects.split('\n')
              .map(line => line.trim())
              .filter(Boolean)
              .map(line => {
                // Check if line has pipe format (Project #: Title | Description | GitHub | Demo)
                if (line.includes('|')) {
                  // Remove any project numbering
                  const cleanLine = line.replace(/^(\d+\.\s|Project\s+\d+:|#\d+\s)/i, '').trim();
                  const parts = cleanLine.split('|').map(part => part.trim());
                  if (parts.length >= 2) {
                    return {
                      title: parts[0] || '',
                      description: parts[1] || '',
                      github: parts[2] || null,
                      demo: parts[3] || null,
                      technologies: []
                    };
                  }
                }
                // Return the line as is if it doesn't match the format
                return line;
              });
          }
          
          // If projects is neither an array nor a string, return an empty array
          return [];
        })(),
        // Process education with categories
        education: (() => {
          // First, group lines by category
          const lines = formData.education.split('\n').map(line => line.trim()).filter(Boolean);
          const result = [];
          let currentCategory = null;
          let currentEntries = [];

          for (const line of lines) {
            // Check if line defines a new category
            if (line.includes(':')) {
              // If we were processing a previous category, add it to results
              if (currentCategory && currentEntries.length > 0) {
                result.push({
                  category: currentCategory,
                  entries: currentEntries
                });
              }

              // Start a new category
              const [category, entryStr] = line.split(':').map(part => part.trim());
              currentCategory = category;
              currentEntries = [];

              // If there's entry data after the colon, process it
              if (entryStr) {
                const parts = entryStr.split('|').map(part => part.trim());
                if (parts.length >= 1) {
                  currentEntries.push({
                    degree: parts[0] || '',
                    institution: parts[1] || '',
                    date: parts[2] || '',
                    description: parts[3] || ''
                  });
                }
              }
            } else {
              // This is a regular entry line (no category prefix)
              const parts = line.split('|').map(part => part.trim());

              // If no current category, create a default one
              if (!currentCategory) {
                currentCategory = 'Education';
              }

              // Add this entry to the current category
              if (parts.length >= 1) {
                currentEntries.push({
                  degree: parts[0] || '',
                  institution: parts[1] || '',
                  date: parts[2] || '',
                  description: parts[3] || ''
                });
              }
            }
          }

          // Add the last category if it exists
          if (currentCategory && currentEntries.length > 0) {
            result.push({
              category: currentCategory,
              entries: currentEntries
            });
          }

          return result.length > 0 ? result : [{
            category: 'Education',
            entries: formData.education.split('\n')
              .map(line => line.trim())
              .filter(Boolean)
              .map(line => {
                const parts = line.split('|').map(part => part.trim());
                return {
                  degree: parts[0] || '',
                  institution: parts[1] || '',
                  date: parts[2] || '',
                  description: parts[3] || ''
                };
              })
          }];
        })(),
        // Process certificates to extract links
        certificates: (typeof formData.certificates === 'string' ? formData.certificates : '')
          .split('\n')
          .filter(Boolean)
          .map(cert => {
            const parts = cert.split('|').map(part => part.trim());
            return {
              title: parts[0] || '',
              issuer: parts[1] || '',
              date: parts[2] || '',
              link: parts[3] || ''
            };
          })
      };
      await axios.post("http://localhost:5000/api/profile", payload, {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-2 py-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-8 transition-all duration-300">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Build Your <span className="text-indigo-600">Developer Profile</span>
        </h1>
        <p className="text-center text-gray-500 mb-4">
          Upload your resume and autofill your profile details. Edit any field before saving.
        </p>

        {/* Resume Upload */}
        <div className="border border-dashed border-indigo-400 rounded-lg p-4 bg-indigo-50 mb-2">
          <label className="block text-indigo-700 font-semibold mb-2">Upload Resume (.pdf)</label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="text-sm bg-white border rounded px-3 py-1 w-full sm:w-auto"
            />
            <button
              onClick={handleParseResume}
              disabled={parsing || !resumeFile}
              className={`bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition w-full sm:w-auto ${parsing || !resumeFile ? "opacity-60 cursor-not-allowed" : ""}`}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
              <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
              <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
              <Input label="GitHub" name="github" value={formData.github} onChange={handleChange} />
              <Input label="LinkedIn" name="linkedin" value={formData.linkedin} onChange={handleChange} />
              <Input label="Resume URL (for download)" name="resume" value={formData.resume} onChange={handleChange} placeholder="URL to your resume file" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Skills (Format: Category: Skill1, Skill2, Skill3)</label>
              <div className="mb-2 text-xs text-gray-500">
                Example:<br />
                Languages: JavaScript, TypeScript, Python<br />
                Frontend: React, HTML, CSS, Tailwind<br />
                Backend: Node.js, Express, MongoDB<br />
                Databases: MySQL, PostgreSQL<br />
                Tools: Git, Docker, VS Code
              </div>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoComplete="off"
                placeholder="Category: Skill1, Skill2, Skill3"
              />
            </div>
            <TextArea label="Summary / About" name="summary" value={formData.summary} onChange={handleChange} />
            <div>
              <label className="block text-gray-700 font-medium mb-1">Education (Format: Category: Degree | Institution | Date | Description)</label>
              <div className="mb-2 text-xs text-gray-500">
                Example:<br />
                Degrees: Bachelor of Science in Computer Science | Stanford University | 2018-2022 | Graduated with honors<br />
                Certifications: AWS Certified Developer | Amazon Web Services | 2023 | Advanced cloud computing certification<br />
                Courses: Machine Learning | Coursera | 2021 | Completed with distinction
              </div>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleChange}
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoComplete="off"
                placeholder="Category: Degree | Institution | Date | Description"
              />
            </div>
            <TextArea label="Experience" name="experience" value={formData.experience} onChange={handleChange} />
            <div>
              <label className="block text-gray-700 font-medium mb-1">Projects</label>
              <div className="mb-2 text-xs text-gray-500">
                <p className="font-semibold mb-1">Format each project on a new line:</p>
                <p><span className="font-medium">Project #:</span> Title | Description | GitHub Link | Live Project Link</p>
                <p className="mt-2">Examples:</p>
                <p>Project 1: Portfolio Website | A personal portfolio built with React | https://github.com/user/portfolio | https://myportfolio.com</p>
                <p>Project 2: Task Manager | A task management app with React and Node.js | https://github.com/user/tasks | https://mytaskapp.com</p>
                <p className="mt-2 text-indigo-600 font-medium">Note: Both GitHub and Live Project links will be displayed as buttons on your portfolio.</p>
              </div>
              <textarea
                name="projects"
                value={formData.projects}
                onChange={handleChange}
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoComplete="off"
                placeholder="Project 1: My Project | Project description | https://github.com/username/project | https://live-project-url.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Certifications (Format: Title | Issuer | Date | Certificate Link)</label>
              <div className="mb-2 text-xs text-gray-500">
                Example:<br />
                AWS Certified Developer | Amazon Web Services | 2023 | https://credential.net/abc123<br />
                React Nanodegree | Udacity | 2022 | https://confirm.udacity.com/xyz456
              </div>
              <textarea
                name="certificates"
                value={formData.certificates}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoComplete="off"
              />
            </div>
            <TextArea label="Other Info (Achievements, etc.)" name="others" value={formData.others} onChange={handleChange} />

            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition mt-2"
            >
              {saveSuccess ? "✅ Saved!" : "Save Profile"}
            </button>
          </>
        )}

        <footer className="text-xs text-gray-400 opacity-80 mt-8 text-center">
          © 2025 Devfolio. Crafted for modern developers 🚀
        </footer>
      </div>
    </div>
  );
}

const Input = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      autoComplete="off"
    />
  </div>
);

const TextArea = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={4}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      autoComplete="off"
      placeholder={placeholder}
    />
  </div>
);