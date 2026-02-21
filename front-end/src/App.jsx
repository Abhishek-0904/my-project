import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResumeProvider } from "./pages/resumecontext";
import Templete from "./pages/templete";
import Form from "./pages/form";
import ResumeView from "./pages/ResumeView";
import Login from "./pages/Login";

function App() {
  return (
    <ResumeProvider>
      <div className="app-container">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Templete />} />
            <Route path="/form" element={<Form />} />
            <Route path="/view" element={<ResumeView />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ResumeProvider>
  );
}

export default App;
