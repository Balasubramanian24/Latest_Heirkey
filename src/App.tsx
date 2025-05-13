import useMediaQuery from "use-media";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import GoogleAuthCallback from "./components/auth/GoogleAuthCallback";

// Mobile imports
import Layout from "./mobile/components/layout/Layout";
import LandingPage from "./mobile/pages/LandingPage";
import LoginPage from "./mobile/pages/AuthPages/LoginPage";
import SplashPage from "./mobile/pages/Global/SplashPage";
import RegisterPage from "./mobile/pages/AuthPages/RegisterPage";
import ResetPassword from "./mobile/components/auth/ResetPassword";
import UserProfile from "./mobile/components/auth/UserProfile";
import ForgetPassword from "./mobile/components/auth/ForgetPassword";
import VerificationForm from "./mobile/components/auth/VerificationForm";
import DashboardPage from "./mobile/pages/Dashboard/DashboardPage";

// Web imports
import WebLandingPage from "@/web/WebLandingPage";
import WebSplashPage from "@/web/pages/Global/WebSplashPage";
import WebAuthForm from "@/web/components/auth/WebAuthForm";
import WebVerificationForm from "./web/components/auth/WebVerificationForm";
import WebResetPassword from "./web/components/auth/WebResetPassword";
import WebForgetPassword from "./web/components/auth/WebForgetPassword";
import WebUserProfile from "./web/components/auth/WebUserProfile";
import WebLayout from "./web/components/Layout/WebLayout";
import Dashboard from "./web/pages/Dashboard/Dashboard";
import HomeInstructions from "./web/pages/Dashboard/HomeInstructions/HomeInstructions";
import PetsInstructions from "./web/pages/Dashboard/HomeInstructions/PetsInstructions";
import TrashInstructions from "./web/pages/Dashboard/HomeInstructions/TrashInstructions";
import OtherInstructions from "./web/pages/Dashboard/HomeInstructions/OtherInstructions";
import SecurityInstructions from "./web/pages/Dashboard/HomeInstructions/SecurityInstructions";

export default function App() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {isMobile ? (
          // Mobile routes
          <>

            <Route path="/" element={<LandingPage />}/>
            <Route path="/auth/get-started" element={<Layout><SplashPage /></Layout>} />
            <Route path="/auth/login" element={<Layout><LoginPage /></Layout>} />
            <Route path="/auth/register" element={<Layout><RegisterPage /></Layout>} />
            <Route path="/auth/user-profile" element={<ProtectedRoute><Layout><UserProfile /></Layout></ProtectedRoute>} />
            <Route path="/auth/resetpassword" element={<Layout><ResetPassword /></Layout>} />
            <Route path="/auth/forgetpassword" element={<Layout><ForgetPassword /></Layout>} />
            <Route path="/auth/verify" element={<Layout><VerificationForm /></Layout>} />
            <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
          </>
        ) : (
          // Web routes
          <>
            <Route path="/" element={<WebLandingPage />} />
            <Route path="/auth/get-started" element={<WebSplashPage />} />
            <Route path="/auth/register" element={<WebAuthForm initialMode="register" />} />
            <Route path="/auth/login" element={<WebAuthForm initialMode="login" />} />
            <Route path="/auth/verify" element={<WebLayout><WebVerificationForm /></WebLayout>} />
            <Route path="/auth/resetpassword" element={<WebLayout><WebResetPassword /></WebLayout>} />
            <Route path="/auth/forgetpassword" element={<WebLayout><WebForgetPassword /></WebLayout>} />
            <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
            <Route path="/auth/user-profile" element={<ProtectedRoute><WebLayout><WebUserProfile /></WebLayout></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><WebLayout><Dashboard /></WebLayout></ProtectedRoute>} />
            <Route path="/auth/user-profile" element={<WebLayout><WebUserProfile /></WebLayout>} />
            <Route path="/dashboard" element={<WebLayout><Dashboard /></WebLayout>} />
            <Route path="/home-instructions" element={<HomeInstructions />} />
            <Route path="/home-instructions/pets" element={<PetsInstructions />} />
            <Route path="/home-instructions/trash" element={<TrashInstructions />} />
            <Route path="/home-instructions/other" element={<OtherInstructions />} />
            <Route path="/home-instructions/security" element={<SecurityInstructions />} />
          </>
        )}
      </Routes>
      </AuthProvider>
    </Router>
  );
}
