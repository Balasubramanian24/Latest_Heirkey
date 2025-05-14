// PetsStepperForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import questionsData from "@/data/homeIntsructions.json";
import { Question } from "@/mobile/components/HomeInstructions/FormFields";
import GradiantHeader from '@/mobile/components/header/gradiantHeader';
import Footer from '@/mobile/components/layout/Footer';
import userInputService, { generateObjectId } from '@/services/userInputService';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';


// Utility: get visible questions based on dependencies
function getVisibleQuestions(allQuestions: Question[], values: Record<string, any>) {
  return allQuestions.filter(q => {
    if (!q.dependsOn) return true;
    return values[q.dependsOn.questionId] === q.dependsOn.value;
  });
}


// Utility: split questions into steps (as per your UI)
function splitIntoSteps(questions: Question[]) {
  return [
    questions.filter(q => q.id === "q1" || q.id === "q2"),
    questions.filter(q => q.id === "q3" || q.id === "q4"),
    questions.filter(q => ["q5", "q6", "q7"].includes(q.id)),
  ];
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
  const allQuestions = questionsData["101"];
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categoryName } = useParams();

  // Validation (simple example, expand as needed)
  function validate(values: Record<string, any>) {
    const errors: Record<string, string> = {};
    getVisibleQuestions(allQuestions as Question[], values).forEach(q => {
      if (q.required && !values[q.id]) {
        errors[q.id] = "Required";
      }
      if (q.validationRules?.maxLength && values[q.id]?.length > q.validationRules.maxLength) {
        errors[q.id] = `Maximum ${q.validationRules.maxLength} characters`;
      }
    });
    return errors;
  }

  return (
     <>
      <GradiantHeader title="Home Instructions" />

      <div style={{ padding: 16 }}>
        {/* Tab Bar */}
        <div className="flex gap-2 mb-4 bg-gray-50 rounded-2xl p-1">
          {["Pets", "Trash", "Other", "Security"].map(tab => {
            // Map tab names to their routes
            const tabRoutes: Record<string, string> = {
              Pets: "/homeinstructions/pets",
              Trash: "/homeinstructions/trash",
              Other: "/homeinstructions/other",
              Security: "/homeinstructions/security",
            };
            const isActive = tab === "Pets";
            return (
              <button
                key={tab}
                type="button"
                className={
                  "flex-1 py-2 rounded-md font-medium " +
                  (isActive
                    ? "bg-white text-[#2BCFD5] border border-[#2BCFD5] shadow"
                    : "text-gray-500")
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
          validate={validate}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              console.log("Pets Instructions Submitted", values);

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
                  const question = (allQuestions as Question[]).find(q => q.id === key);
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
                originalCategoryId: '1', // Our manual category ID for Home Instructions
                subCategoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
                originalSubCategoryId: '101', // Our manual subcategory ID for pets
                answersBySection: [{
                  originalSectionId: '101A', // Store our original section ID
                  isCompleted: true,
                  answers
                }]
              };

              // Save to backend
              await userInputService.createUserInput(userData);

              navigate(`/category/${categoryName}/trash`);
            } catch (err: any) {
              console.error('Error saving pet instructions:', err);
              setError(err.message || 'Failed to save your answers. Please try again.');
              setSubmitting(false);
            }
          }}
        >
          {({ values, isSubmitting }) => {
            // Watch for q1 === "no"
            useEffect(() => {
              if (values.q1 === "no") {
                const petFields = {
                  q1: "no",
                  q2: null,
                  q3: null,
                  q4: null,
                  q5: null,
                  q6: null,
                  q7: null,
                };
                console.log("petFields", petFields);
                localStorage.setItem("petsInstructions", JSON.stringify(petFields));
                navigate("/homeinstructions/trash");
              }
            }, [values.q1, navigate]);

            // Dynamically get visible questions and steps
            const visibleQuestions = getVisibleQuestions(allQuestions as Question[], values);
            const steps = splitIntoSteps(visibleQuestions);
            const currentStepQuestions = steps[step];

            return (
            <Form>
              {/* Card for the whole step */}
              <div className="bg-gray-50 p-5 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">
                    Home Instructions: <span className="text-[#2BCFD5]">Pets</span>
                  </p>
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-sm flex items-center justify-center font-semibold">
                    {step + 1}/{steps.length}
                  </div>
                </div>
              </div>

                <div className="space-y-4 mt-8 bg-gray-50 p-5 rounded-xl shadow-sm border">
                  {currentStepQuestions.map(q => (
                    <div key={q.id}>
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
                </div>

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
                    onClick={() => setStep(s => s + 1)}
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
      <Footer />
    </>
  );
}