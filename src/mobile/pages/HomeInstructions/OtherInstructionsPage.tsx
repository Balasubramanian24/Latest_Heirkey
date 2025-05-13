import { Formik, Field, Form, ErrorMessage } from "formik";
import questionsData from "@/data/homeIntsructions.json";
import GradiantHeader from "@/mobile/components/header/gradiantHeader";
import Footer from "@/mobile/components/layout/Footer";
import { useNavigate } from "react-router-dom";

const otherQuestions = questionsData["103"];

const initialValues = {
  o1: "",
};

export default function OtherInstructionsPage() {
  const navigate = useNavigate();

  // Tab routes
  const tabRoutes: Record<string, string> = {
    Pets: "/home-instructions/pets",
    Trash: "/home-instructions/trash",
    Other: "/home-instructions/other",
    Security: "/home-instructions/security",
  };

  return (
    <>
      <GradiantHeader title="Home Instructions" />
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

        <Formik
          initialValues={initialValues}
          validate={values => {
            const errors: Record<string, string> = {};
            if (values.o1 && values.o1.length > 275) {
              errors.o1 = "Maximum 275 characters";
            }
            return errors;
          }}
          onSubmit={values => {
            console.log("Other Instructions Submitted", values);
            navigate("/home-instructions/security");
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
