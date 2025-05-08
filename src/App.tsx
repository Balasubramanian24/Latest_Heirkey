import useMediaQuery from "use-media";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import WebLandingPage from "./web/WebLandingPage";
import MobileLandingPage from "./mobile/MobileLandingPage";

export default function App() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<MobileLandingPage />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router> 
      <Routes>
        <Route path="/" element={<WebLandingPage />} />
      </Routes>
    </Router>
  );

 
}

