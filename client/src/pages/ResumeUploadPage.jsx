import React, { useState } from "react";
import axios from "axios";

export default function ResumeUploadPage() {
  const [file, setFile] = useState(null); // State to hold the selected file
  const [parsedData, setParsedData] = useState(null); // State to hold the parsed data from the backend
  const [loading, setLoading] = useState(false); // State to manage loading state during file upload

  // Function to handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Get the first file selected
  };
 // Function to handle file upload and parsing
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF resume file.");
      return;
    }
// Create a FormData object to send the file
    const formData = new FormData(); // Create a new FormData object
    formData.append("resume", file);  // Append the file to the FormData object

    // Send the file to the Flask backend for parsing
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:7000/parse-resume", formData, // Make a POST request to the backend
        {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setParsedData(res.data); // Set the parsed data received from the backend
    } catch (err) {
      alert("Error parsing resume. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Upload Your Resume</h1>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="mb-4 w-full text-sm"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:scale-[1.03] transition duration-200"
        >
          {loading ? "Uploading..." : "Parse Resume"}
        </button>

        {parsedData && (
          <div className="mt-6 text-left">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Parsed Data:</h2>
            <div className="text-sm text-gray-800 bg-gray-100 p-4 rounded">
              <p><strong>Name:</strong> {parsedData.name || "Not found"}</p>
              <p><strong>Email:</strong> {parsedData.email || "Not found"}</p>
              {/* Add more fields here if you extract them in Flask */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
