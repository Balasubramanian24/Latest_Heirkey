import useMediaQuery from "use-media";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import WebLandingPage from "./web/WebLandingPage";
import WebSplashPage from "@/web/components/auth/WebSplashPage";


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
      </Routes>
    </Router>
  );

 
}

