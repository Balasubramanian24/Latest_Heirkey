import { Formik, Field, Form, ErrorMessage } from "formik";
import questionsData from "@/data/homeIntsructions.json";
import GradiantHeader from "@/mobile/components/header/gradiantHeader";
import Footer from "@/mobile/components/layout/Footer";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import userInputService, { generateObjectId, convertUserInputToFormValues } from '@/services/userInputService';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from '@/components/ui/alert';
import ScrollToQuestion from '@/mobile/components/HomeInstructions/ScrollToQuestion';
import { castToQuestionType } from '@/mobile/utils/questionUtils';

const otherQuestions = castToQuestionType(questionsData["103"]);

const initialValues = {
  o1: "",
};

export default function OtherInstructionsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryName } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedAnswers, setSavedAnswers] = useState<Record<string, string>>({});
  const [existingInputId, setExistingInputId] = useState<string | null>(null);
  const { user } = useAuth();

  // Get the questionId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const targetQuestionId = queryParams.get('questionId');

  // Tab routes
  const tabRoutes: Record<string, string> = {
    Pets: "/category/homeinstructions/pets",
    Trash: "/category/homeinstructions/trash",
    Other: "/category/homeinstructions/other",
    Security: "/category/homeinstructions/security",
  };

  // Fetch saved answers when component mounts
  useEffect(() => {
    const fetchSavedAnswers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (user && user.id) {
          // Try to fetch existing user input for this subcategory
          const userInputs = await userInputService.getUserInputsBySubcategory(
            user.id,
            '1', // Home Instructions category
            '103' // Other subcategory
          );

          if (userInputs && userInputs.length > 0) {
            // Use the first matching record
            const userInput = userInputs[0];
            setExistingInputId(userInput._id);

            // Convert the saved answers to form values
            const formValues = convertUserInputToFormValues(userInput);
            setSavedAnswers(formValues);
          }
        }
      } catch (error) {
        console.error('Error fetching saved answers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedAnswers();
  }, [user]);

  if (isLoading) {
    return (
      <>
        <GradiantHeader title="Home Instructions"
        showAvatar={true}
        />
        <div className="p-4 text-center">Loading your answers...</div>
      </>
    );
  }

  return (
    <>
      <GradiantHeader title="Home Instructions" 
      showAvatar={true}
      />
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
          initialValues={Object.keys(savedAnswers).length > 0 ? savedAnswers : initialValues}
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
                .filter(([, value]) => value !== "") // Filter out empty answers
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

              // Format the answers by section
              const formattedAnswersBySection = [{
                originalSectionId: '103A', // Store our original section ID
                isCompleted: true,
                answers
              }];

              // Check if we're updating an existing record or creating a new one
              if (existingInputId) {
                console.log('Updating existing record:', existingInputId);

                try {
                  // Update existing record
                  await userInputService.updateUserInput(existingInputId, {
                    answersBySection: formattedAnswersBySection
                  });
                  console.log('Successfully updated record');
                } catch (error) {
                  console.error('Error updating record:', error);
                  // If PATCH fails, fall back to creating a new record
                  console.log('Falling back to creating a new record');
                  setExistingInputId(null);
                }
              }

              // If no existing record or update failed, create a new one
              if (!existingInputId) {
                // Format data for API
                const userData = {
                  userId: user.id, // Use actual user ID from auth context
                  categoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
                  originalCategoryId: '1', // Our manual category ID for Home Instructions
                  subCategoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
                  originalSubCategoryId: '103', // Our manual subcategory ID for other
                  answersBySection: formattedAnswersBySection
                };

                // Save to backend
                const result = await userInputService.createUserInput(userData);

                // Store the new record ID for future updates
                if (result && typeof result === 'object') {
                  const typedResult = result as { _id: string };
                  setExistingInputId(typedResult._id);
                }
              }

              // Navigate to the next page or back to review if we came from there
              if (targetQuestionId) {
                navigate(`/category/${categoryName}/review`);
              } else {
                navigate(`/category/${categoryName}/security`);
              }
            } catch (err: unknown) {
              console.error('Error saving other instructions:', err);
              const errorMessage = err instanceof Error ? err.message : 'Failed to save your answers. Please try again.';
              setError(errorMessage);
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
                <ScrollToQuestion questions={otherQuestions}>
                  {(refs) => (
                    <div
                      id={`question-${otherQuestions[0].id}`}
                      ref={(el: HTMLDivElement | null) => {
                        refs[otherQuestions[0].id] = el;
                      }}
                    >
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
                    </div>
                  )}
                </ScrollToQuestion>
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
