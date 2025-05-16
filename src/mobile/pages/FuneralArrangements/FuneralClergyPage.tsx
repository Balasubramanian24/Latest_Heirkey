import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import GradiantHeader from "@/mobile/components/header/gradiantHeader";
import Footer from "@/mobile/components/layout/Footer";
import { CircularProgress } from '@/components/ui/CircularProgress';
import { categoryTabsConfig } from '@/data/categoryTabsConfig';
import funeralArrangementsData from '@/data/funeralArrangements.json';

const clergyQuestions = (funeralArrangementsData["205"] || []).filter(
  q => ["f8", "f9", "f10"].includes(q.id)
);

const initialValues = {
  f8: "",
  f9: "",
  f10: "",
};

export default function FuneralClergyPage() {
  const navigate = useNavigate();

  return (
    <>
      <GradiantHeader title="Funeral Arrangements" showAvatar={true} />
      <div className="p-4">
        {/* Tab Bar */}
        <div className="flex flex-row flex-nowrap gap-3 mb-4 bg-gray-50 rounded-lg p-1 overflow-x-auto scrollbar-hide">
          {categoryTabsConfig.funeralarrangements.map(tab => {
            const isActive = tab.label === "Clergy";
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
              Funeral Arrangements: <span className="text-[#2BCFD5]">Clergy</span>
            </p>
            <CircularProgress value={1} max={1} size={40} stroke={3} color="#2BCFD5" />
          </div>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={initialValues}
          validate={values => {
            const errors: Record<string, string> = {};
            clergyQuestions.forEach(q => {
              if (q.required && !(values as Record<string, any>)[q.id]) {
                errors[q.id] = "Required";
              }
            });
            return errors;
          }}
          onSubmit={(values) => {
            // You can handle form data here if needed
            navigate('/category/funeralarrangements/notification');
          }}
        >
          {({ values }) => (
            <Form className="bg-gray-50 p-4 rounded-xl shadow-sm border">
              <div className="space-y-4">
                {/* Preferred Clergy Member (boolean) */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    {clergyQuestions[0]?.text} *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer">
                      <Field type="radio" name="f8" value="yes" className="hidden" />
                      <span className={values.f8 === "yes" ? "text-[#2BCFD5]" : ""}>Yes</span>
                    </label>
                    <label className="flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer">
                      <Field type="radio" name="f8" value="no" className="hidden" />
                      <span className={values.f8 === "no" ? "text-[#2BCFD5]" : ""}>No</span>
                    </label>
                  </div>
                  <ErrorMessage name="f8" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Name of Clergy Member (text) */}
                {values.f8 === "yes" && (
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">
                      {clergyQuestions[1]?.text} *
                    </label>
                    <Field
                      name="f9"
                      type="text"
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="Enter clergy name"
                    />
                    <ErrorMessage name="f9" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                )}

                {/* Contact number or email of Clergy (text) */}
                {values.f8 === "yes" && (
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">
                      {clergyQuestions[2]?.text} *
                    </label>
                    <Field
                      name="f10"
                      type="text"
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="Enter contact number or email"
                    />
                    <ErrorMessage name="f10" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
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