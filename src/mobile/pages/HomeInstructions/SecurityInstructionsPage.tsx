import { Formik, Field, Form, ErrorMessage } from "formik";
import questionsData from "@/data/homeIntsructions.json";
import GradiantHeader from "@/mobile/components/header/gradiantHeader";
import Footer from "@/mobile/components/layout/Footer";
import { useNavigate, useParams } from "react-router-dom";
import userInputService, { generateObjectId } from '@/services/userInputService';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from "react";
import { Alert, AlertDescription } from '@/components/ui/alert';

const securityQuestions = questionsData["104"];

const initialValues = {
  s1: "",
  s2: "",
};

export default function SecurityInstructionsPage() {
  const navigate = useNavigate();
  const { categoryName } = useParams<{ categoryName: string }>();
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Tab routes using the category param
  const tabRoutes: Record<string, string> = {
    Pets: `/category/${categoryName}/pets`,
    Trash: `/category/${categoryName}/trash`,
    Other: `/category/${categoryName}/other`,
    Security: `/category/${categoryName}/security`,
  };

  // Fallback routes in case categoryName is undefined
  const fallbackTabRoutes: Record<string, string> = {
    Pets: "/homeinstructions/pets",
    Trash: "/homeinstructions/trash",
    Other: "/homeinstructions/other",
    Security: "/homeinstructions/security",
  };

  // Use dynamic routes if categoryName is available, otherwise use fallback
  const getTabRoute = (tab: string) => {
    if (categoryName) {
      return tabRoutes[tab];
    }
    return fallbackTabRoutes[tab];
  };

  return (
    <>
      <GradiantHeader title="Home Instructions" />
      <div style={{ padding: 16 }}>
        {/* Tab Bar */}
        <div className="flex gap-2 mb-4 bg-gray-50 rounded-lg p-1">
          {["Pets", "Trash", "Other", "Security"].map(tab => {
            const isActive = tab === "Security";
            return (
              <button
                key={tab}
                type="button"
                className={
                  "flex-1 py-2 rounded-md font-medium " +
                  (isActive
                    ? "bg-white text-[#2BCFD5] border border-[#2BCFD5] shadow"
                    : "text-gray-500 hover:bg-[#25b6bb] hover:text-white")
                }
                disabled={isActive}
                onClick={() => {
                  if (!isActive) navigate(getTabRoute(tab));
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Formik
          initialValues={initialValues}
          validate={values => {
            const errors: Record<string, string> = {};
            if (!values.s1) errors.s1 = "Required";
            if (values.s1 === "yes" && !values.s2) errors.s2 = "Required";
            if (values.s2 && values.s2.length > 275) errors.s2 = "Maximum 275 characters";
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              console.log("Security Instructions Submitted", values);

              // Check if user is authenticated
              if (!user || !user.id) {
                console.error('User not authenticated');
                setError('You must be logged in to save answers');
                return;
              }

              // Format the answers for the backend
              const answers = Object.entries(values)
                .filter(([_, value]) => value !== "") // Filter out empty answers
                .map(([key, value], index) => {
                  const question = securityQuestions.find(q => q.id === key);
                  return {
                    index,
                    originalQuestionId: key,
                    question: question?.text || key,
                    type: question?.type || "text",
                    answer: value
                  };
                });

              // Format data for API
              const userData = {
                userId: user.id, // Use actual user ID from auth context
                categoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
                subCategoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
                originalSubCategoryId: '104', // Our manual subcategory ID for security
                answersBySection: [{
                  originalSectionId: '104A', // Store our original section ID
                  isCompleted: true,
                  answers
                }]
              };

              // Save to backend
              await userInputService.createUserInput(userData);

              // Navigate to the review page with dynamic category
              if (categoryName) {
                navigate(`/category/${categoryName}/review`);
              } else {
                // Fallback to old route if categoryName not available
                navigate(`/homeinstructions/review`);
              }
            } catch (err: any) {
              console.error('Error saving security instructions:', err);
              setError(err.message || 'Failed to save your answers. Please try again.');
              setSubmitting(false);
            }
          }}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form>
              <div className="bg-gray-50 p-5 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">
                    Home Instructions: <span className="text-[#2BCFD5]">Security</span>
                  </p>
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-sm flex items-center justify-center font-semibold">
                    1/1
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm border mt-4">
                <label className="block font-medium text-gray-700 mb-2">
                  {securityQuestions[0].text}
                </label>
                <div className="flex gap-2 mb-4">
                  {["yes", "no"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      className={
                        "flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer " +
                        (values.s1 === opt
                          ? "bg-[#2BCFD5] text-white"
                          : "bg-gray-50 hover:bg-[#25b6bb] hover:text-white")
                      }
                      onClick={() => setFieldValue("s1", opt)}
                    >
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
                <ErrorMessage name="s1" component="div" className="text-red-500 text-sm mt-1" />
                {values.s1 === "yes" && (
                  <>
                    <label className="block font-medium text-gray-700 mb-2">
                      {securityQuestions[1].text}
                    </label>
                    <Field
                      as="textarea"
                      name="s2"
                      maxLength={275}
                      className="w-full border rounded-lg px-3 py-2"
                      rows={4}
                      placeholder="Please list relevant details here."
                    />
                    <div className="text-gray-400 text-xs mt-1 mb-2">
                      {275 - (values.s2?.length || 0)} characters left
                    </div>
                    <ErrorMessage name="s2" component="div" className="text-red-500 text-sm mt-1" />
                  </>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2BCFD5] text-white px-6 py-2 rounded-lg font-semibold mt-6 hover:bg-[#25b6bb]"
                >
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <Footer />
    </>
  );
}
