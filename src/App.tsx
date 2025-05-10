import useMediaQuery from "use-media";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import WebLandingPage from "./web/WebLandingPage";
import WebSplashPage from "@/web/components/pages/WebSplashPage";
import AuthLogin from "./web/components/auth/AuthLogin";
import AuthRegister from "./web/components/auth/AuthRegister";

export default function App() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <Router>
        <Routes>

        </Routes>
      </Router>
    );
  }

  return (
    <Router> 
      <Routes>
        <Route path="/" element={<WebLandingPage />} />
        <Route path="/auth/get-started" element={<WebSplashPage/>} />
        <Route path="/auth/login" element={<AuthLogin/>} />
        <Route path="/auth/register" element={<AuthRegister/>} />
      </Routes>
    </Router>
  );

 
}

