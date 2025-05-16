import { Formik, Field, Form, ErrorMessage } from "formik";
import GradiantHeader from "@/mobile/components/header/gradiantHeader";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Footer from '@/mobile/components/layout/Footer';
import { generateObjectId, convertUserInputToFormValues } from '@/services/userInputService';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from '@/components/ui/alert';
import ScrollToQuestion from '@/mobile/components/HomeInstructions/ScrollToQuestion';
import { castToQuestionType } from '@/mobile/utils/questionUtils';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  fetchUserInputs,
  saveUserInput,
  updateUserInput,
  UserInput,
  selectUserInputsBySubcategoryId,
  selectQuestionsBySubcategoryId,
  selectLoading,
  selectError
} from '@/store/slices/homeInstructionsSlice';
import { categoryTabsConfig } from '@/data/categoryTabsConfig';
import { CircularProgress } from '@/components/ui/CircularProgress';

const initialValues = {
  t1: "",
};

export default function TrashInstructionsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryName } = useParams();
  const [savedAnswers, setSavedAnswers] = useState<Record<string, any>>({});
  const [existingInputId, setExistingInputId] = useState<string | null>(null);
  const [formError, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Get data from Redux store
  const trashQuestions = useAppSelector((state) => selectQuestionsBySubcategoryId('102')(state));
  const userInputs = useAppSelector((state) => selectUserInputsBySubcategoryId('102')(state));
  const isLoading = useAppSelector(selectLoading);
  const reduxError = useAppSelector(selectError);

  // Cast questions to the correct type - memoize to prevent recalculation on every render
  const typedQuestions = useState(() => castToQuestionType(trashQuestions))[0];

  // Get the questionId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const targetQuestionId = queryParams.get('questionId');

  // Fetch user inputs when component mounts
  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchUserInputs(user.id));
    }
  }, [dispatch, user]);

  // Process user inputs when they are loaded
  useEffect(() => {
    if (userInputs && userInputs.length > 0) {
      // Use the first matching record
      const userInput = userInputs[0];

      // Only update state if we have a new ID or if formValues have changed
      if (userInput._id && userInput._id !== existingInputId) {
        setExistingInputId(userInput._id);

        // Convert the saved answers to form values
        const formValues = convertUserInputToFormValues(userInput);
        setSavedAnswers(formValues);
      } else if (!existingInputId && userInput._id) {
        // First time setting the ID
        setExistingInputId(userInput._id);

        // Convert the saved answers to form values
        const formValues = convertUserInputToFormValues(userInput);
        setSavedAnswers(formValues);
      }
    }
  }, [userInputs, existingInputId]);

  // Handle target question in a separate effect to avoid infinite loops
  useEffect(() => {
    if (targetQuestionId && typedQuestions.length > 0) {
      // Find the question and scroll to it if needed
      const questionElement = document.getElementById(`question-${targetQuestionId}`);
      if (questionElement) {
        questionElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [targetQuestionId]);

  if (isLoading) {
    return (
      <>
        <GradiantHeader title="Home Instructions" />
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
          {categoryTabsConfig.homeinstructions.map(tab => {
            const isActive = tab.label === "Trash";
            return (
              <button
                key={tab.label}
                type="button"
                className={
                  "flex-1 py-2 rounded-md font-medium " +
                  (isActive
                    ? "bg-white text-[#2BCFD5] border border-[#2BCFD5] shadow"
                    : "text-gray-500")
                }
                disabled={isActive}
                onClick={() => {
                  if (!isActive) navigate(tab.path);
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {(formError || reduxError) && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{formError || reduxError}</AlertDescription>
          </Alert>
        )}

        <Formik
          initialValues={Object.keys(savedAnswers).length > 0 ? savedAnswers : initialValues}
          validate={values => {
            const errors: Record<string, string> = {};
            if (!values.t1) errors.t1 = "Required";
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              console.log("Trash Instructions Submitted", values);

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
                  const question = typedQuestions.find(q => q.id === key);
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
                originalSectionId: '102A', // Store our original section ID
                isCompleted: true,
                answers
              }];

              // Check if we're updating an existing record or creating a new one
              if (existingInputId) {
                console.log('Updating existing record:', existingInputId);

                try {
                  // Update existing record using Redux action
                  await dispatch(updateUserInput({
                    id: existingInputId,
                    userData: {
                      userId: user.id,
                      categoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
                      originalCategoryId: '1',
                      subCategoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
                      originalSubCategoryId: '102',
                      answersBySection: formattedAnswersBySection
                    } as UserInput
                  })).unwrap();

                  console.log('Successfully updated record');
                } catch (error) {
                  console.error('Error updating record:', error);
                  // If update fails, fall back to creating a new record
                  console.log('Falling back to creating a new record');
                  setExistingInputId(null);
                }
              }

              // If no existing record or update failed, create a new one
              if (!existingInputId) {
                // Format data for API
                const userData: Omit<UserInput, '_id'> = {
                  userId: user.id, // Use actual user ID from auth context
                  categoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
                  originalCategoryId: '1', // Our manual category ID for Home Instructions
                  subCategoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
                  originalSubCategoryId: '102', // Our manual subcategory ID for trash
                  answersBySection: formattedAnswersBySection
                };

                // Save to backend using Redux action
                const result = await dispatch(saveUserInput(userData)).unwrap();

                // Store the new record ID for future updates
                if (result && result._id) {
                  setExistingInputId(result._id);
                }
              }

              // Navigate to the next page or back to review if we came from there
              if (targetQuestionId) {
                navigate(`/category/${categoryName}/review`);
              } else {
                navigate(`/category/${categoryName}/other`);
              }
            } catch (err: any) {
              console.error('Error saving trash instructions:', err);
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
                    Home Instructions: <span className="text-[#2BCFD5]">Trash</span>
                  </p>
                  <CircularProgress 
                    value={1} 
                    max={1} 
                    size={40} 
                    stroke={3}
                    color="#2BCFD5"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl shadow-sm border mt-4">
                <ScrollToQuestion questions={typedQuestions}>
                  {(refs) => (
                    <div
                      id={`question-${typedQuestions[0]?.id}`}
                      ref={(el: HTMLDivElement | null) => {
                        if (typedQuestions[0]) {
                          refs[typedQuestions[0].id] = el;
                        }
                      }}
                    >
                      <label className="block font-medium text-gray-700 mb-2">
                        {typedQuestions[0]?.text}
                      </label>
                      <Field
                        as="select"
                        name="t1"
                        className="w-full border rounded-lg px-3 py-2"
                      >
                        <option value="">Select</option>
                        {typedQuestions[0]?.options?.map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="t1" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  )}
                </ScrollToQuestion>

                <button
                  type="submit"
                  disabled={isSubmitting || !values.t1}
                  className="w-full bg-[#2BCFD5] text-white px-6 py-2 rounded-lg font-semibold mt-6"
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
