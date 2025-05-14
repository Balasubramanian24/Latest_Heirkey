import { Formik, Field, Form, ErrorMessage } from "formik";
import questionsData from "@/data/homeIntsructions.json";
import GradiantHeader from "@/mobile/components/header/gradiantHeader";
import Footer from "@/mobile/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import userInputService, { generateObjectId } from '@/services/userInputService';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from "react";
import { Alert, AlertDescription } from '@/components/ui/alert';

const otherQuestions = questionsData["103"];

const initialValues = {
  o1: "",
};

export default function OtherInstructionsPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Tab routes
  const tabRoutes: Record<string, string> = {
    Pets: "/homeinstructions/pets",
    Trash: "/homeinstructions/trash",
    Other: "/homeinstructions/other",
    Security: "/homeinstructions/security",
  };

  return (
    <>
      <GradiantHeader title="Home Instructions" />
      <div style={{ padding: 16 }}>
        {/* Tab Bar */}
        <div className="flex gap-2 mb-4 bg-gray-50 rounded-lg p-1">
          {["Pets", "Trash", "Other", "Security"].map(tab => {
            const isActive = tab === "Other";
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
                  if (!isActive) navigate(tabRoutes[tab]);
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
            if (values.o1 && values.o1.length > 275) {
              errors.o1 = "Maximum 275 characters";
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              console.log("Other Instructions Submitted", values);

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
                  const question = otherQuestions.find(q => q.id === key);
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
                originalSubCategoryId: '103', // Our manual subcategory ID for other
                answersBySection: [{
                  originalSectionId: '103A', // Store our original section ID
                  isCompleted: true,
                  answers
                }]
              };

              // Save to backend
              await userInputService.createUserInput(userData);

              navigate("/homeinstructions/security");
            } catch (err: any) {
              console.error('Error saving other instructions:', err);
              setError(err.message || 'Failed to save your answers. Please try again.');
              setSubmitting(false);
            }
          }}
        >
          {({ values, isSubmitting }) => (
            <Form>
              <div className="bg-gray-50 p-5 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">
                    Home Instructions: <span className="text-[#2BCFD5]">Other</span>
                  </p>
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-sm flex items-center justify-center font-semibold">
                    1/1
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm border mt-4">
                <label className="block font-medium text-gray-700 mb-2">
                  {otherQuestions[0].text}
                  </label>
                <Field
                  as="textarea"
                  name="o1"
                  maxLength={275}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={4}
                  placeholder="Please list them here."
                />
                <div className="text-gray-400 text-xs mt-1 mb-2">
                  {275 - (values.o1?.length || 0)} characters left
                </div>
                <ErrorMessage name="o1" component="div" className="text-red-500 text-sm mt-1" />
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
