import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import GradiantHeader from '@/mobile/components/header/gradiantHeader';
import Footer from '@/mobile/components/layout/Footer';
import { Formik, Form, ErrorMessage } from "formik";
import { categoryTabsConfig } from "@/data/categoryTabsConfig";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { useAuth } from '@/contexts/AuthContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  fetchUserInputs,
  saveUserInput,
  updateUserInput,
  updateFormValues,
  selectQuestionsBySubcategoryId,
  selectUserInputsBySubcategoryId,
  selectFormValues,
  selectLoading,
  selectError
} from '@/store/slices/willInstructionsSlice';
import { generateObjectId, convertUserInputToFormValues } from '@/services/userInputService';
import {
  QuestionItem,
  buildInitialValues,
  validate,
  isQuestionVisible
} from '@/mobile/components/WillLocation/FormFields';

// Filter and sort location questions
// This function is used by the Redux selector

const LocationInstrucationsPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [existingInputId, setExistingInputId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasSetInitialStep = useRef(false);
  const location = useLocation();

  // Get questionId from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const targetQuestionId = searchParams.get('questionId');

  // Get data from Redux store
  const locationQuestions = useAppSelector(selectQuestionsBySubcategoryId('105B'));
  const userInputs = useAppSelector(selectUserInputsBySubcategoryId('105B'));
  const formValues = useAppSelector(selectFormValues);
  const loading = useAppSelector(selectLoading);
  const reduxError = useAppSelector(selectError);

  // Fetch user inputs when component mounts
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserInputs(user.id));
    }
  }, [dispatch, user?.id]);

  // Set existing input ID if we have saved data
  useEffect(() => {
    if (userInputs.length > 0 && userInputs[0]._id) {
      setExistingInputId(userInputs[0]._id);
    }
  }, [userInputs.length]);

  // Build initial values from existing user inputs, form values, or empty values
  const initialValues = userInputs.length > 0
    ? convertUserInputToFormValues(userInputs[0])
    : formValues && Object.keys(formValues).length > 0
      ? { ...buildInitialValues(locationQuestions), ...formValues }
      : buildInitialValues(locationQuestions);

  // Set the step to the target question if provided in URL - only once when component mounts
  useEffect(() => {
    // Only set the step once to avoid infinite loops
    if (targetQuestionId && locationQuestions.length > 0 && !hasSetInitialStep.current) {
      const questionIndex = locationQuestions.findIndex(q => q.id === targetQuestionId);
      if (questionIndex !== -1) {
        setStep(questionIndex);
        // Mark that we've set the initial step
        hasSetInitialStep.current = true;
      }
    }
  }, [targetQuestionId, locationQuestions]);

  return (
    <div className="min-h-screen bg-white">
      <GradiantHeader
        showAvatar={true}
        title="Will Instructions"
      />
      <div className="container mx-auto px-4 py-6">
        <div className="flex mb-4 p-4">
          {((categoryTabsConfig as Record<string, { label: string; path: string }[]>)[categoryName || "willinstructions"] || []).map((tab) => {
            const isActive = tab.path === location.pathname;
            return (
              <button
                key={tab.label}
                type="button"
                className={
                  "flex-1 py-2 rounded-md font-medium bg-gray-100 " +
                  (isActive
                    ? "bg-white text-[#2BCFD5] border border-[#2BCFD5]"
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
        <div className="max-w-md mx-auto space-y-6">
          {/* Show error message if any */}
          {(error || reduxError) && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error || reduxError}</AlertDescription>
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validate={validate(locationQuestions)}
            enableReinitialize={true}
            onSubmit={async (values: Record<string, string>) => {
              try {
                setError(null);

                // Store form values in Redux for cross-page navigation
                dispatch(updateFormValues(values));

                // Prepare data for saving to backend
                const answersBySection: any[] = [];

                // Group answers by section
                const sectionA: any = {
                  originalSectionId: '105A',
                  isCompleted: true,
                  answers: []
                };

                const sectionB: any = {
                  originalSectionId: '105B',
                  isCompleted: true,
                  answers: []
                };

                // Process all questions and their answers
                locationQuestions.forEach((question, index) => {
                  const answer = values[question.id];
                  if (answer) {
                    const answerObj = {
                      index,
                      questionId: generateObjectId(), // Generate a MongoDB compatible ID
                      originalQuestionId: question.id,
                      question: question.text,
                      type: question.type,
                      answer
                    };

                    // Add to appropriate section
                    if (question.sectionId === '105A') {
                      sectionA.answers.push(answerObj);
                    } else if (question.sectionId === '105B') {
                      sectionB.answers.push(answerObj);
                    }
                  }
                });

                // Add non-empty sections to the array
                if (sectionA.answers.length > 0) {
                  answersBySection.push(sectionA);
                }

                if (sectionB.answers.length > 0) {
                  answersBySection.push(sectionB);
                }

                // Create user input data object
                const userData = {
                  userId: user?.id || '',
                  categoryId: generateObjectId(), // Generate a MongoDB compatible ID
                  originalCategoryId: '2', // Will Instructions category ID
                  subCategoryId: generateObjectId(), // Generate a MongoDB compatible ID
                  originalSubCategoryId: '105B',
                  answersBySection
                };

                // Update or create based on whether we have an existing record
                if (existingInputId) {
                  await dispatch(updateUserInput({
                    id: existingInputId,
                    userData
                  }));
                } else {
                  // Save to backend using Redux action
                  const result = await dispatch(saveUserInput(userData));

                  // Store the new record ID for future updates
                  const payload = result.payload as any;
                  if (payload && payload._id) {
                    setExistingInputId(payload._id);
                  }
                }

                // Navigate to next page with a slight delay to ensure Redux state is updated
                setTimeout(() => {
                  // Use willinstructions as default if categoryName is undefined
                  navigate(`/category/${categoryName || 'willinstructions'}/legal`);
                }, 100);
              } catch (err: any) {
                console.error('Error saving data:', err);
                setError(err.message || 'Failed to save data. Please try again.');
              }
            }}
          >
            {({ values, isSubmitting }: { values: Record<string, string>; isSubmitting: boolean; setFieldValue?: any }) => {
              // Find the current question to display
              const currentQuestion = locationQuestions[step];
              if (!isQuestionVisible(currentQuestion, values)) {
                // If the current question is not visible, skip to the next
                setTimeout(() => setStep(s => s + 1), 0);
                return null;
              }
              return (
                <Form className="space-y-4">
                  {/* Progress */}
                  <div className="bg-gray-50 flex justify-between items-center rounded-xl shadow-sm border p-4">
                    <span className="text-black font-semibold text-lg">Will: <span className="text-[#2BCFD5]">Location</span></span>
                    <span>
                      <CircularProgress value={step + 1} max={locationQuestions.length} />
                    </span>
                  </div>
                  {/* Question Card */}
                  <div
                    className={`bg-gray-100 rounded-xl shadow-sm border p-4 ${targetQuestionId === currentQuestion.id ? 'border-[#2BCFD5] border-2' : ''}`}
                    id={`question-${currentQuestion.id}`}
                  >
                    <QuestionItem question={currentQuestion} values={values} />
                    <ErrorMessage name={currentQuestion.id} component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  {/* Navigation */}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      type="button"
                      onClick={() => setStep(s => Math.max(0, s - 1))}
                      disabled={step === 0}
                      className="text-[#2BCFD5] underline disabled:opacity-50"
                    >
                      ← Back
                    </button>
                    {step < locationQuestions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setStep(s => s + 1)}
                        className="bg-[#2BCFD5] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#25b6bb]"
                        disabled={!values[currentQuestion.id]}
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#2BCFD5] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#25b6bb]"
                      >
                        Save
                      </button>
                    )}
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LocationInstrucationsPage;
