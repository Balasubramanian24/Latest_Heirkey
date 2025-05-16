import { useNavigate, useParams } from 'react-router-dom';
import GradiantHeader from '@/mobile/components/header/gradiantHeader';
import Footer from '@/mobile/components/layout/Footer';
import willInstructionsData from "@/data/willInstructions.json";
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

const getLegalQuestions = (questions: Question[]) =>
  questions
    .filter(q => q.sectionId === "105C")
    .sort((a, b) => a.order - b.order);

const buildInitialValues = (questions: Question[]) =>
  questions.reduce((acc, q) => ({ ...acc, [q.id]: "" }), {});

const validate = (questions: Question[]) => (values: Record<string, any>) => {
  const errors: Record<string, string> = {};
  questions.forEach(q => {
    if (isQuestionVisible(q, values, questions) && q.required && !values[q.id]) {
      errors[q.id] = "Required";
    }
  });
  return errors;
};

function isQuestionVisible(q: Question, values: Record<string, any>, sectionQuestions: Question[]) {
  if (!q.dependsOn) return true;
  // If the dependency is not in the current section, ignore the dependency
  if (!sectionQuestions.some(lq => lq.id === q.dependsOn?.questionId)) return true;
  return values[q.dependsOn.questionId] === q.dependsOn.value;
}

const LegalInstructionsPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const allQuestions: Question[] = willInstructionsData["105"];
  const legalQuestions = getLegalQuestions(allQuestions);
  const initialValues = buildInitialValues(legalQuestions);
  const tabs = categoryTabsConfig[categoryName as keyof typeof categoryTabsConfig] || [];
  const currentPath = `/category/${categoryName}/legal`;

  return (
    <div className="min-h-screen bg-white">
      <GradiantHeader 
        showAvatar={true}
        title="Legal Instructions"
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
          <Formik
            initialValues={initialValues}
            validate={validate(legalQuestions)}
            onSubmit={(values) => {
              // Save or submit logic here
              navigate(`/category/${categoryName}/review`);
            }}
          >
            {({ values, isSubmitting }: { values: Record<string, any>; isSubmitting: boolean }) => {
              // Progress calculation
              const answeredCount = legalQuestions.filter(q => values[q.id] && isQuestionVisible(q, values, legalQuestions)).length;
              const totalCount = legalQuestions.filter(q => isQuestionVisible(q, values, legalQuestions)).length;
              return (
                <Form className="space-y-4">
                  {/* Progress */}
                  <div className="bg-gray-50 flex justify-between items-center rounded-xl shadow-sm border p-4 mb-4">
                    <span className="text-black font-semibold text-lg">Will: <span className="text-[#2BCFD5]">Legal</span></span>
                    <span>
                      <CircularProgress value={answeredCount} max={totalCount} />
                    </span>
                  </div>
                  {/* Questions */}
                  {legalQuestions.map((q) =>
                    isQuestionVisible(q, values, legalQuestions) && (
                      <div key={q.id} className="bg-gray-100 rounded-xl shadow-sm border p-4">
                        <label className="block font-medium text-gray-700 mb-2">
                          {q.text}{q.required && " *"}
                        </label>
                        {q.type === "boolean" ? (
                          <div className="flex space-x-4">
                            <label className={`flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer bg-gray-50 hover:bg-[#25b6bb] hover:text-white ${values[q.id] === 'yes' ? 'bg-[#2BCFD5] text-white' : ''}`}> 
                              <Field type="radio" name={q.id} value="yes" className="hidden" />
                              Yes
                            </label>
                            <label className={`flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer bg-gray-50 hover:bg-[#25b6bb] hover:text-white ${values[q.id] === 'no' ? 'bg-[#2BCFD5] text-white' : ''}`}> 
                              <Field type="radio" name={q.id} value="no" className="hidden" />
                              No
                            </label>
                          </div>
                        ) : (
                          <Field
                            name={q.id}
                            as={q.type === "text" ? "textarea" : "input"}
                            type={q.type === "number" ? "number" : "text"}
                            className="w-full border rounded-lg px-3 py-2"
                            rows={q.type === "text" ? 3 : undefined}
                            placeholder={q.placeholder || ""}
                          />
                        )}
                        <ErrorMessage name={q.id} component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    )
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#2BCFD5] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#25b6bb] w-full"
                  >
                    Save
                  </button>
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

export default LegalInstructionsPage;
