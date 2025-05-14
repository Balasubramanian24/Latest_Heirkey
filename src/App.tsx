import useMediaQuery from "use-media";
import { Routes, Route, BrowserRouter as Router, useParams } from "react-router-dom";
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
import CategoryConfirmPage from "./mobile/pages/categoryconfirm/categoryconfirm";
import HomeInstructionsPage from '@/mobile/pages/HomeInstructions/HomeInstructionsPage';
import PetsInstructionsPage from '@/mobile/pages/HomeInstructions/PetsInstructionsPage';
import TrashInstructionsPage from '@/mobile/pages/HomeInstructions/TrashInstructionsPage';
import OtherInstructionsPage from "./mobile/pages/HomeInstructions/OtherInstructionsPage";
import SecurityInstructionsPage from "./mobile/pages/HomeInstructions/SecurityInstructionsPage";
import HomeInstructionsReviewPage from "./mobile/pages/HomeInstructions/HomeInstructionsReviewPage";



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
import PetsInstructions from "./web/pages/Dashboard/HomeInstructions/PetsInstructions";
import TrashInstructions from "./web/pages/Dashboard/HomeInstructions/TrashInstructions";
import OtherInstructions from "./web/pages/Dashboard/HomeInstructions/OtherInstructions";
import SecurityInstructions from "./web/pages/Dashboard/HomeInstructions/SecurityInstructions";
import HomeInstructions from "./web/pages/Dashboard/HomeInstructions/HomeInstructions";
import CategoryStartup from "./web/pages/Global/CategoryStartup";
import HomeInstructionsReview from "./web/pages/Dashboard/HomeInstructions/HomeInstructionsReview";


function CategoryStartupWrapper() {
  const { categoryName } = useParams();
  return <CategoryStartup category={categoryName} />;
}

function HomeInstructionsWrapper() {
  const { categoryName } = useParams();
  return <HomeInstructions category={categoryName} />;
}

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
            <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />

            <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
            
            <Route path="/category/:categoryName" element={<Layout><CategoryConfirmPage /></Layout>} />
            <Route path="/category/:categoryName/info" element={<Layout><HomeInstructionsPage /></Layout>} />
            <Route path="/category/:categoryName/pets" element={<Layout><PetsInstructionsPage /></Layout>} />
            <Route path="/category/:categoryName/trash" element={<Layout><TrashInstructionsPage /></Layout>} />
            <Route path="/category/:categoryName/other" element={<Layout><OtherInstructionsPage /></Layout>} />
            <Route path="/category/:categoryName/security" element={<Layout><SecurityInstructionsPage /></Layout>} />
            
            <Route path="/category/:categoryName/review" element={<Layout><HomeInstructionsReviewPage /></Layout>} />
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

            
            <Route path="/category/:categoryName" element={<CategoryStartupWrapper />} />
            <Route path="/category/:categoryName/info" element={<HomeInstructionsWrapper />} />
            <Route path="/category/:categoryName/pets" element={<PetsInstructions />} />
            <Route path="/category/:categoryName/trash" element={<TrashInstructions />} />
            <Route path="/category/:categoryName/other" element={<OtherInstructions />} />
            <Route path="/category/:categoryName/security" element={<SecurityInstructions />} />

            <Route path="/category/homeinstructions/review" element={<HomeInstructionsReview />} />

          </>
        )}
      </Routes>
      </AuthProvider>
    </Router>
  );
}
