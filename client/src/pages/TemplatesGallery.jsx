
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";

const templates = [
  // {
  //   id: "Template1",
  //   title: "Minimal Modern",
  //   color: "from-blue-500 to-purple-500",
  // },
  // {
  //   id: "Template2",
  //   title: "Sidebar Classic",
  //   color: "from-indigo-600 to-pink-600",
  // },
  // {
  //   id: "Template3",
  //   title: "Card Portfolio",
  //   color: "from-green-500 to-cyan-500",
  // },
  // {
  //   id: "TemplateModern",
  //   title: "Dynamic Interactive",
  //   color: "from-purple-600 to-cyan-400",
  // },
  {
    id: "PortfolioModern",
    title: "Advanced Portfolio",
    color: "from-indigo-500 to-pink-500",
  },
];

export default function TemplateGallery() {
  const navigate = useNavigate();

  const handleSelect = async (templateId) => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post("http://localhost:5000/api/profile", {
        selectedTemplate: templateId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert(`✅ "${templateId}" selected!`);
      navigate("/preview");
    } catch (err) {
      console.error(err);
      alert("Failed to save selected template.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex justify-center items-start">
      <div className="w-full max-w-5xl space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">Choose a Portfolio Template</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tpl) => (
            <div key={tpl.id} className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center justify-between border hover:shadow-xl transition">
              <div className={`h-28 w-full bg-gradient-to-r ${tpl.color} rounded-md mb-4`} />
              <h2 className="text-lg font-semibold text-gray-700">{tpl.title}</h2>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => navigate(`/preview?template=${tpl.id}`)}
                  className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                >
                  Preview
                </button>
                <button
                  onClick={() => handleSelect(tpl.id)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
