// src/data/portfolioData.js

const portfolioData = {
  name: "Neeraj Kanojia",
  email: "neeraj@example.com",
  phone: "+91 9876543210",
  github: "https://github.com/kanojia2003",
  linkedin: "https://linkedin.com/in/neeraj-kanojia",
skills: [
  { category: "Programming Languages", items: ["JavaScript", "Python", "C++"] },
  { category: "Web Technologies", items: ["React.js", "Node.js", "MongoDB", "Firebase", "Express.js", "Tailwind CSS"] },
  { category: "Tools", items: ["Git", "VS Code", "Postman"] },
  { category: "Soft Skills", items: ["Communication", "Teamwork", "Problem Solving"] }
],
  education: `B.Tech in Information Technology, Munbai University
2022 - 2023
CGPA: 8.23`,

  experience: `Software Developer Intern at ABC Corp
June 2022 – Aug 2022
- Built a real-time chat app with WebSocket and Firebase
- Reduced API latency by 40% by optimizing Express routes`,

  others: `🏆 Achievements
• Won 1st place at CodeFest 2022 (200+ participants)
• Finalist at Google Solution Challenge

📜 Certifications
• Full Stack Web Dev - Udemy
• Firebase Essentials - Coursera`,

  profilePhoto: "", // Leave blank for now – future support
};

export default portfolioData;
