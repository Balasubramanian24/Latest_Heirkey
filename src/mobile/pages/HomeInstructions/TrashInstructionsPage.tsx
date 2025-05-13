import { Formik, Field, Form, ErrorMessage } from "formik";
import questionsData from "@/data/homeIntsructions.json";
import GradiantHeader from "@/mobile/components/header/gradiantHeader";
import { useNavigate } from "react-router-dom";
import Footer from '@/mobile/components/layout/Footer';

const trashQuestions = questionsData["102"];

const initialValues = {
  t1: "",
};

export default function TrashInstructionsPage() {
  const navigate = useNavigate();

  return (
    <>
      <GradiantHeader title="Home Instructions" />
      <div style={{ padding: 16 }}>
        {/* Tab Bar */}
        <div className="flex gap-2 mb-4 bg-gray-50 rounded-lg p-1">
          {["Pets", "Trash", "Other", "Security"].map(tab => {
            // Map tab names to their routes
            const tabRoutes: Record<string, string> = {
              Pets: "/home-instructions/pets",
              Trash: "/home-instructions/trash",
              Other: "/home-instructions/other",
              Security: "/home-instructions/security",
            };
            const isActive = tab === "Trash";
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

        <Formik
          initialValues={initialValues}
          validate={values => {
            const errors: Record<string, string> = {};
            if (!values.t1) errors.t1 = "Required";
            return errors;
          }}
          onSubmit={values => {
            console.log("Pets Instructions Submitted", values);
            navigate("/home-instructions/other");
          }}
        >
          {({ values, isSubmitting }) => (
            <Form>

              <div className="bg-gray-50 p-5 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">
                    Home Instructions: <span className="text-[#2BCFD5]">Trash</span>
                  </p>
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-sm flex items-center justify-center font-semibold">
                    1/1
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm border mt-4">
                <label className="block font-medium text-gray-700 mb-2">
                  {trashQuestions[0].text}
                </label>
                <Field
                  as="select"
                  name="t1"
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select</option>
                  {trashQuestions[0].options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </Field>
                <ErrorMessage name="t1" component="div" className="text-red-500 text-sm mt-1" />
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
