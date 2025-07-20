// client/src/templates/Templates1.jsx
import React from "react";

export default function Template1({ data }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-4 py-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6 border">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700">{data.name}</h1>
            <p className="text-gray-600">{data.email} • {data.phone}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <a
              href={data.linkedin}
              className="text-sm text-blue-600 hover:underline mr-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href={data.github}
              className="text-sm text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Section: Skills */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-1 mb-2">Skills</h2>
          <ul className="list-disc ml-6 text-gray-700">
            {Array.isArray(data.skills) && data.skills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </section>

        {/* Section: Education */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-1 mb-2">Education</h2>
          <p className="whitespace-pre-line text-gray-700">{data.education}</p>
        </section>

        {/* Section: Experience */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-1 mb-2">Experience</h2>
          <p className="whitespace-pre-line text-gray-700">{data.experience}</p>
        </section>

        {/* Section: Projects */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-1 mb-2">Projects</h2>
          <p className="whitespace-pre-line text-gray-700">{data.projects}</p>
        </section>

        {/* Section: Others */}
        {data.others && (
          <section>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-1 mb-2">Other Information</h2>
            <p className="whitespace-pre-line text-gray-700">{data.others}</p>
          </section>
        )}
      </div>
    </div>
  );
}