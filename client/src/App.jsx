import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProfileForm from "./pages/ProfileForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<ProfileForm />} />
      </Routes>
    </Router>
  );
}

export default App;
