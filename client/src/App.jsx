import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProfileForm from "./pages/ProfileForm";
import ProtectedRoute from "./components/ProtectedRoute";
import ResumeUploadPage from "./pages/ResumeUploadPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={
          <ProtectedRoute> <ProfileForm /></ProtectedRoute>}/>
            <Route path="/upload" element={<ResumeUploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
