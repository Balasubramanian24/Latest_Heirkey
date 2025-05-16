import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import GradiantHeader from "@/mobile/components/header/gradiantHeader";
import Footer from "@/mobile/components/layout/Footer";
import { CircularProgress } from '@/components/ui/CircularProgress';
import { categoryTabsConfig } from '@/data/categoryTabsConfig';
import funeralArrangementsData from '@/data/funeralArrangements.json';

const proceedingsQuestions = (funeralArrangementsData["205"] || []).filter(
  q => ["f12", "f13", "f14", "f15"].includes(q.id)
);

const initialValues = {
  f12: "",
  f13: "",
  f14: "",
  f15: "",
};

export default function FuneralProceedingsPage() {
  const navigate = useNavigate();

  return (
    <>
      <GradiantHeader title="Funeral Arrangements" showAvatar={true} />
      <div className="p-4">
        {/* Tab Bar */}
        <div className="flex flex-row flex-nowrap gap-3 mb-4 bg-gray-50 rounded-lg p-1 overflow-x-auto scrollbar-hide">
          {categoryTabsConfig.funeralarrangements.map(tab => {
            const isActive = tab.label === "Proceedings";
            return (
              <button
                key={tab.label}
                className={`flex-1 py-2 rounded-md font-medium whitespace-nowrap ${
                  isActive
                    ? "bg-white text-[#2BCFD5] border border-[#2BCFD5] shadow"
                    : "text-gray-500"
                }`}
                disabled={isActive}
                onClick={() => !isActive && navigate(tab.path)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Progress Header */}
        <div className="bg-gray-50 p-5 rounded-xl shadow-sm border mb-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">
              Funeral Arrangements: <span className="text-[#2BCFD5]">Proceedings</span>
            </p>
            <CircularProgress value={1} max={1} size={40} stroke={3} color="#2BCFD5" />
          </div>
        </div>

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validate={values => {
            const errors: Record<string, string> = {};
            proceedingsQuestions.forEach(q => {
              // Only validate visible/required questions
              if (q.required && !(values as Record<string, any>)[q.id]) {
                errors[q.id] = "Required";
              }
            });
            return errors;
          }}
          onSubmit={() => {
            navigate('/category/funeralarrangements/review');
          }}
        >
          {({ values }) => (
            <Form className="bg-gray-50 p-4 rounded-xl shadow-sm border">
              <div className="space-y-4">
                {/* f12: Do you have specific Funeral Arrangements you would like to be done? */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    {proceedingsQuestions[0]?.text} *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer">
                      <Field type="radio" name="f12" value="yes" className="hidden" />
                      <span className={values.f12 === "yes" ? "text-[#2BCFD5]" : ""}>Yes</span>
                    </label>
                    <label className="flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer">
                      <Field type="radio" name="f12" value="no" className="hidden" />
                      <span className={values.f12 === "no" ? "text-[#2BCFD5]" : ""}>No</span>
                    </label>
                  </div>
                  <ErrorMessage name="f12" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* f13, f14, f15: Only show if f12 is "yes" */}
                {values.f12 === "yes" && (
                  <>
                    {proceedingsQuestions.slice(1).map(q => (
                      <div key={q.id}>
                        <label className="block font-medium text-gray-700 mb-2">
                          {q.text}
                        </label>
                        <Field
                          as="textarea"
                          name={q.id}
                          rows={3}
                          className="w-full border rounded-lg px-3 py-2"
                          placeholder={q.text}
                        />
                        <ErrorMessage name={q.id} component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    ))}
                  </>
                )}

                <button
                  type="submit"
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