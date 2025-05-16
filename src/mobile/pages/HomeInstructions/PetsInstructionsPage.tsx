// PetsStepperForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Question } from "@/mobile/components/HomeInstructions/FormFields";
import GradiantHeader from '@/mobile/components/header/gradiantHeader';
import Footer from '@/mobile/components/layout/Footer';
import { generateObjectId, convertUserInputToFormValues } from '@/services/userInputService';
import { useAuth } from '@/contexts/AuthContext';
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


// Utility: get visible questions based on dependencies
function getVisibleQuestions(allQuestions: Question[], values: Record<string, any>) {
  // For existing data with q1="yes", ensure all questions are visible
  if (values.q1 === "yes" && values.q5) {
    console.log('Existing data with q1="yes" and q5 exists, showing all questions');
    return allQuestions;
  }

  // Normal filtering logic
  const visibleQuestions = allQuestions.filter(q => {
    if (!q.dependsOn) return true;
    // Only show questions that depend on q1="yes" when q1 is actually "yes"
    if (q.dependsOn.questionId === "q1") {
      return values[q.dependsOn.questionId] === q.dependsOn.value;
    }
    return values[q.dependsOn.questionId] === q.dependsOn.value;
  });
  return visibleQuestions;
}


// Utility: split questions into steps (as per your UI)
function splitIntoSteps(questions: Question[]) {
  // If q1 is "no", only show the first question
  if (questions.length === 1) {
    return [questions];
  }

  // Create the steps array
  const steps = [
    questions.filter(q => q.id === "q1" || q.id === "q2"),
    questions.filter(q => q.id === "q3" || q.id === "q4"),
    questions.filter(q => ["q5", "q6", "q7"].includes(q.id)),
  ];

  // Filter out empty steps
  const nonEmptySteps = steps.filter(step => step.length > 0);
  return nonEmptySteps;
}

// Initial values for Formik
const initialValues = {
  q1: "", // Do you have pets?
  q2: "",
  q3: "",
  q4: "",
  q5: "",
  q6: "",
  q7: "",
};

export default function PetsInstructionsPage() {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(0);
  const [savedAnswers, setSavedAnswers] = useState<Record<string, any>>({});
  const [existingInputId, setExistingInputId] = useState<string | null>(null);
  const [formError, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { categoryName } = useParams();

  // Get data from Redux store
  const allQuestions = useAppSelector((state) => selectQuestionsBySubcategoryId('101')(state));
  const userInputs = useAppSelector((state) => selectUserInputsBySubcategoryId('101')(state));
  const isLoading = useAppSelector(selectLoading);
  const reduxError = useAppSelector(selectError);

  // Cast questions to the correct type - memoize to prevent recalculation on every render
  const typedQuestions = useState(() => castToQuestionType(allQuestions))[0];

  // Get the questionId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const targetQuestionId = queryParams.get('questionId');

  // Validation (simple example, expand as needed)
  function validate(values: Record<string, any>) {
    const errors: Record<string, string> = {};
    getVisibleQuestions(typedQuestions, values).forEach(q => {
      if (q.required && !values[q.id]) {
        errors[q.id] = "Required";
      }
      if (q.validationRules?.maxLength && values[q.id]?.length > q.validationRules.maxLength) {
        errors[q.id] = `Maximum ${q.validationRules.maxLength} characters`;
      }
    });
    return errors;
  }

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
      // console.log('Loaded user input:', userInput);

      // Only update state if we have a new ID or if it's the first time
      if (userInput._id && userInput._id !== existingInputId) {
        setExistingInputId(userInput._id);

        // Convert the saved answers to form values
        const formValues = convertUserInputToFormValues(userInput);
        // console.log('Converted form values:', formValues);
        setSavedAnswers(formValues);

        // Always reset to step 0 when loading data, unless coming from a specific question
        if (!targetQuestionId) {
          // console.log('Resetting to step 0 when loading data');
          setStep(0);
        }
      } else if (!existingInputId && userInput._id) {
        // First time setting the ID
        setExistingInputId(userInput._id);

        // Convert the saved answers to form values
        const formValues = convertUserInputToFormValues(userInput);
        // console.log('Converted form values (first time):', formValues);
        setSavedAnswers(formValues);

        // Always reset to step 0 when loading data, unless coming from a specific question
        if (!targetQuestionId) {
          // console.log('Resetting to step 0 when loading data (first time)');
          setStep(0);
        }
      }
    }
  }, [userInputs, existingInputId, targetQuestionId]);

  // Handle target question in a separate effect to avoid infinite loops
  useEffect(() => {
    if (targetQuestionId) {
      // Find which step contains this question
      const steps = splitIntoSteps(typedQuestions);
      for (let i = 0; i < steps.length; i++) {
        if (steps[i].some(q => q.id === targetQuestionId)) {
          setStep(i);
          break;
        }
      }
    }
  }, [targetQuestionId, typedQuestions]);

  // Reset success message when step changes
  useEffect(() => {
    setShowSuccessMessage(false);
  }, [step]);

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
        <div className="flex gap-2 mb-4 bg-gray-50 rounded-2xl p-1">
          {categoryTabsConfig.homeinstructions.map(tab => {
            const isActive = tab.label === "Pets";
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
          validate={validate}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              console.log("Pets Instructions Submitted", values);
              // console.log("Current step at submission:", step);

              // Check if user is authenticated
              if (!user || !user.id) {
                console.error('User not authenticated');
                setError('You must be logged in to save answers');
                return;
              }

              // Get the current steps based on the values
              // const visibleQuestions = getVisibleQuestions(typedQuestions, values);
              // const steps = splitIntoSteps(visibleQuestions);
              // console.log('Total steps at submission:', steps.length);

              // We should only reach here if we're on the last step and clicked Save
              // console.log('On last step, saving to backend');

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
                originalSectionId: '101A', // Store our original section ID
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
                      originalSubCategoryId: '101',
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
                  originalSubCategoryId: '101', // Our manual subcategory ID for pets
                  answersBySection: formattedAnswersBySection
                };

                // Save to backend using Redux action
                const result = await dispatch(saveUserInput(userData)).unwrap();

                // Store the new record ID for future updates
                if (result && result._id) {
                  setExistingInputId(result._id);
                }
              }

              // If we came from the review page, go back there
              if (targetQuestionId) {
                // console.log('Navigating back to review page');
                navigate(`/category/${categoryName}/review`);
              } else {
                // Always save the data first
                // console.log('Data saved successfully');

                // NEVER navigate to trash page automatically
                // Just show a success message and let the user decide when to navigate

                // If we're not on the third step, force navigation to the third step
                if (step < 2) {
                  console.log('Not on third step yet, moving to third step');
                  setStep(2);
                } else {
                  console.log('On third step, staying here after save');
                  // Show success message
                  setShowSuccessMessage(true);
                }

                // Always finish the submission
                setSubmitting(false);
              }
            } catch (err: unknown) {
              console.error('Error saving pet instructions:', err);
              const errorMessage = err instanceof Error ? err.message : 'Failed to save your answers. Please try again.';
              setError(errorMessage);
              setSubmitting(false);
            }
          }}
        >
          {({ values, isSubmitting }) => {
            // Dynamically get visible questions and steps
            const visibleQuestions = getVisibleQuestions(typedQuestions, values);
            // console.log('Visible questions:', visibleQuestions.map(q => q.id));

            const steps = splitIntoSteps(visibleQuestions);
            // console.log('Steps:', steps.map(step => step.map(q => q.id)));
            // console.log('Current step:', step, 'of', steps.length);

            // Check if step is out of bounds and adjust if needed
            if (steps.length > 0 && step >= steps.length) {
              // console.log('Step out of bounds, adjusting to:', steps.length - 1);
              // Use setTimeout to avoid state updates during render
              setTimeout(() => {
                setStep(steps.length - 1);
              }, 0);
            }

            // Get current step questions, with fallback to empty array if undefined
            const currentStepQuestions = steps[step] || [];

            return (
            <Form>
              {/* Card for the whole step */}
              <div className="bg-gray-50 p-5 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">
                    Home Instructions: <span className="text-[#2BCFD5]">Pets</span>
                  </p>
                  <CircularProgress 
                    value={step + 1} 
                    max={steps.length} 
                    size={40} 
                    stroke={3}
                    color="#2BCFD5"
                  />
                </div>
              </div>

              <div className="space-y-4 mt-8 bg-gray-50 p-5 rounded-xl shadow-sm border">
                <ScrollToQuestion questions={currentStepQuestions}>
                  {(refs) => (
                    <>
                      {currentStepQuestions.map(q => (
                        <div
                          key={q.id}
                          id={`question-${q.id}`}
                          ref={(el: HTMLDivElement | null) => {
                            refs[q.id] = el;
                          }}
                        >
                          <label className="block font-medium text-gray-700 mb-2">
                            {q.text}{q.required && " *"}
                          </label>
                          {q.type === "boolean" ? (
                            <div className="flex space-x-4">
                              <label className="flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer bg-gray-50 hover:bg-[#25b6bb] hover:text-white">
                                <Field type="radio" name={q.id} value="yes" className="hidden" />
                                Yes
                              </label>
                              <label
                                className="flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer bg-gray-50 hover:bg-[#25b6bb] hover:text-white"
                              >
                                <Field type="radio" name={q.id} value="no" className="hidden" />
                                No
                              </label>
                            </div>
                          ) : q.type === "choice" ? (
                            <Field
                              as="select"
                              name={q.id}
                              className="w-full border rounded-lg px-3 py-2"
                            >
                              <option value="">Select</option>
                              {q.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </Field>
                          ) : (
                            <Field
                              name={q.id}
                              as={q.id === "q4" ? "textarea" : "input"}
                              type={q.type?.toLowerCase() === "number" ? "number" : "text"}
                              className="w-full border rounded-lg px-3 py-2"
                              rows={q.id === "q4" ? 3 : undefined}
                            />
                          )}
                          <ErrorMessage name={q.id} component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      ))}
                    </>
                  )}
                </ScrollToQuestion>
              </div>

              {/* Success message */}
              {/* {showSuccessMessage && (
                <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Data saved successfully!</p>
                    <p className="text-sm">Your pet information has been saved.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/category/${categoryName}/trash`)}
                    className="bg-[#2BCFD5] text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Continue to Trash →
                  </button>
                </div>
              )} */}

              <div className="mt-6 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  disabled={step === 0}
                  className="text-[#2BCFD5] underline disabled:opacity-50"
                >
                  ← Back
                </button>

                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      // console.log('Next button clicked, moving to step:', step + 1);
                      // console.log('Current visible questions:', visibleQuestions.map(q => q.id));
                      // console.log('Current steps:', steps.map(s => s.map(q => q.id)));

                      // Force move to the next step
                      setStep(prevStep => {
                        const newStep = prevStep + 1;
                        // console.log('Setting step to:', newStep);
                        return newStep;
                      });
                    }}
                    disabled={currentStepQuestions.some(q => q.required && !(values as Record<string, any>)[q.id])}
                    className="bg-[#2BCFD5] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#25b6bb]"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#2BCFD5] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#25b6bb]"
                    // onClick={() => {
                      // console.log('Save button clicked, current step:', step, 'of', steps.length);
                      // console.log('Current visible questions:', visibleQuestions.map(q => q.id));
                      // console.log('Current steps:', steps.map(s => s.map(q => q.id)));
                      // console.log('Current step questions:', currentStepQuestions.map(q => q.id));
                    // }}
                    onClick={() => navigate(`/category/${categoryName}/trash`)}
                  >
                    {step < 2 ? 'Save & Continue' : 'Save & Finish'}
                  </button>
                )}
              </div>
            </Form>
             );
          }}
        </Formik>
      </div>
      <Footer />
    </>
  );
}