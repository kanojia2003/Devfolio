import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProfileForm from "./pages/ProfileForm";
import ProtectedRoute from "./components/ProtectedRoute";
import ResumeUploadPage from "./pages/ResumeUploadPage";
import Preview from "./pages/Preview";
import TemplateGallery from "./pages/TemplatesGallery";
function App() {
  return (
    <div className="overflow-x-hidden max-w-[100vw] min-h-screen flex flex-col">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={
            <ProtectedRoute> <ProfileForm /></ProtectedRoute>}/>
          <Route path="/upload" element={<ResumeUploadPage />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/templates" element={<TemplateGallery />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
