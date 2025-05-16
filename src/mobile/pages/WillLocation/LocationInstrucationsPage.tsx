import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import GradiantHeader from '@/mobile/components/header/gradiantHeader';
import willInstructionsData from "@/data/willInstructions.json";
import Footer from '@/mobile/components/layout/Footer';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { categoryTabsConfig } from "@/data/categoryTabsConfig";
import { CircularProgress } from "@/components/ui/CircularProgress";

interface Question {
  id: string;
  text: string;
  type: string;
  required: boolean;
  sectionId: string;
  order: number;
  dependsOn?: { questionId: string; value: string };
  placeholder?: string;
  [key: string]: any;
}

const getLocationQuestions = (questions: Question[]) =>
  questions
    .filter(q => q.sectionId === "105A" || q.sectionId === "105B")
    .sort((a, b) => a.order - b.order);

const buildInitialValues = (questions: Question[]) =>
  questions.reduce((acc, q) => ({ ...acc, [q.id]: "" }), {});

const validate = (questions: Question[]) => (values: Record<string, any>) => {
  const errors: Record<string, string> = {};
  questions.forEach(q => {
    // Only validate if the question is visible
    if (isQuestionVisible(q, values) && q.required && !values[q.id]) {
      errors[q.id] = "Required";
    }
  });
  return errors;
};

function isQuestionVisible(q: Question, values: Record<string, any>) {
  if (!q.dependsOn) return true;
  return values[q.dependsOn.questionId] === q.dependsOn.value;
}

const LocationInstrucationsPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const allQuestions: Question[] = willInstructionsData["105"];
  const locationQuestions = getLocationQuestions(allQuestions);
  const initialValues = buildInitialValues(locationQuestions);
  const [step, setStep] = useState(0);
  const tabs = categoryTabsConfig[categoryName as keyof typeof categoryTabsConfig] || [];
  const currentPath = `/category/${categoryName}/location`;

  // Get the visible questions up to the current step
  const visibleQuestions = locationQuestions.filter((q, idx) =>
    idx <= step && isQuestionVisible(q, initialValues)
  );

  return (
    <div className="min-h-screen bg-white">
      <GradiantHeader 
        showAvatar={true}
        title="Will Location"
      />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex gap-2 mb-4 bg-gray-50 rounded-md p-1">
            {tabs.map(tab => {
              const isActive = currentPath === tab.path;
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
          {/* Stepper Tabs */}
          <Formik
            initialValues={initialValues}
            validate={validate(locationQuestions)}
            onSubmit={(values) => {
              // Save or submit logic here (optionally store values)
              navigate(`/category/${categoryName}/legal`);
            }}
          >
            {({ values, isSubmitting, setFieldValue }: { values: Record<string, any>; isSubmitting: boolean; setFieldValue: any }) => {
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
                  <div className="bg-gray-50 flex justify-between items-center rounded-xl shadow-sm border p-4 mb-4">
                    <span className="text-black font-semibold text-lg">Will: <span className="text-[#2BCFD5]">Location</span></span>
                    <span>
                      <CircularProgress value={step + 1} max={locationQuestions.length} />
                    </span>
                  </div>
                  {/* Question Card */}
                  <div className="bg-gray-100 rounded-xl shadow-sm border p-4">
                    <label className="block font-medium text-gray-700 mb-2">
                      {currentQuestion.text}{currentQuestion.required && " *"}
                    </label>
                    {currentQuestion.type === "boolean" ? (
                      <div className="flex space-x-4">
                        <label className={`flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer bg-gray-50 hover:bg-[#25b6bb] hover:text-white ${values[currentQuestion.id] === 'yes' ? 'bg-[#2BCFD5] text-white' : ''}`}> 
                          <Field type="radio" name={currentQuestion.id} value="yes" className="hidden" />
                          Yes
                        </label>
                        <label className={`flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer bg-gray-50 hover:bg-[#25b6bb] hover:text-white ${values[currentQuestion.id] === 'no' ? 'bg-[#2BCFD5] text-white' : ''}`}> 
                          <Field type="radio" name={currentQuestion.id} value="no" className="hidden" />
                          No
                        </label>
                      </div>
                    ) : (
                      <Field
                        name={currentQuestion.id}
                        as={currentQuestion.type === "text" ? "textarea" : "input"}
                        type={currentQuestion.type === "number" ? "number" : "text"}
                        className="w-full border rounded-lg px-3 py-2"
                        rows={currentQuestion.type === "text" ? 3 : undefined}
                        placeholder={currentQuestion.placeholder || ""}
                      />
                    )}
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
