import React, { useEffect, useState } from "react";
import Template1 from "../templates/Templates1";
import Template2 from "../templates/Template2";
import Template3 from "../templates/Template3";
import TemplateModern from "../templates/TemplateModern";
import PortfolioModern from "../templates/PortfolioModern";

import portfolioData from "../data/portfolioData";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth"; 
export default function Preview() {
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState(null);
  const [template, setTemplate] = useState("Template1"); // default fallback

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (!currentUser) {
      setUserData(portfolioData); // fallback for public view
      setTemplate(searchParams.get("template") || "Template1");
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(res.data);
      setTemplate(res.data.selectedTemplate || "Template1");
    } catch (err) {
      console.error("Error fetching profile data:", err);
    }
  });

  return () => unsubscribe();
}, [searchParams]);

  const renderTemplate = () => {
    switch (template) {
      // case "Template1":
      //   return <Template1 data={userData} />;
      // case "Template2":
      //   return <Template2 data={userData} />;
      // case "Template3":
      //   return <Template3 data={userData} />;
      case "TemplateModern":
        return <TemplateModern data={userData} />;
      case "PortfolioModern":
        return <PortfolioModern data={userData} />;
      default:
        return <Template1 data={userData} />;
    }
  };

  return (
    <div className="overflow-x-hidden w-full max-w-[100vw] min-h-screen flex flex-col">
      {userData ? (
        renderTemplate()
      ) : (
        <div className="text-center text-gray-500 py-10 flex-grow">Loading preview...</div>
      )}
    </div>
  );
}
