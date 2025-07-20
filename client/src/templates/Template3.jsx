
export default function Template3({ data }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 text-gray-900 px-4 py-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6 border">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-pink-700">{data.name}</h1>
            <p className="text-gray-600">{data.email} • {data.phone}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-4">
            {data.linkedin && (
              <a
                href={data.linkedin}
                className="text-sm text-purple-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            )}
            {data.github && (
              <a
                href={data.github}
                className="text-sm text-purple-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Section: Skills */}
        <section>
          <h2 className="text-lg font-semibold text-pink-800 border-b pb-1 mb-2">Skills</h2>
          <ul className="list-disc ml-6 text-gray-700">
            {Array.isArray(data.skills) && data.skills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </section>

        {/* Section: Education */}
        <section>
          <h2 className="text-lg font-semibold text-pink-800 border-b pb-1 mb-2">Education</h2>
          <p className="whitespace-pre-line text-gray-700">{data.education}</p>
        </section>

        {/* Section: Experience */}
        <section>
          <h2 className="text-lg font-semibold text-pink-800 border-b pb-1 mb-2">Experience</h2>
          <p className="whitespace-pre-line text-gray-700">{data.experience}</p>
        </section>

        {/* Section: Projects */}
        <section>
          <h2 className="text-lg font-semibold text-pink-800 border-b pb-1 mb-2">Projects</h2>
          <p className="whitespace-pre-line text-gray-700">{data.projects}</p>
        </section>

        {/* Section: Others */}
        {data.others && (
          <section>
            <h2 className="text-lg font-semibold text-pink-800 border-b pb-1 mb-2">Other Information</h2>
            <p className="whitespace-pre-line text-gray-700">{data.others}</p>
          </section>
        )}
      </div>
    </div>
  );
}