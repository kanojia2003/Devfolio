import React, { useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase';

export default function ProfileForm() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!auth.currentUser) {
      alert("User not logged in");
      return;
    }
    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const data = { name, bio };
      await axios.post("http://localhost:5000/api/profile", data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Profile submitted successfully!");
      setName('');
      setBio('');
    } catch (err) {
      alert("Error submitting profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl mb-4 font-semibold text-center text-gray-800">Profile Form</h2>
        <input
          type="text"
          value={name}
          placeholder="Your Name"
          onChange={e => setName(e.target.value)}
          className="mb-3 px-4 py-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-500"
        />
        <textarea
          value={bio}
          placeholder="Short Bio"
          onChange={e => setBio(e.target.value)}
          className="mb-3 px-4 py-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-500"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full px-4 py-2 bg-green-600 text-white rounded font-semibold shadow hover:scale-[1.03] transition duration-200 ${loading && "opacity-60"}`}
        >
          {loading ? "Submitting..." : "Submit Profile"}
        </button>
      </div>
    </div>
  );
}