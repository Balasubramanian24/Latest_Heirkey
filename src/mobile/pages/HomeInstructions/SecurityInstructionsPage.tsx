import { Formik, Field, Form, ErrorMessage } from "formik";
import questionsData from "@/data/homeIntsructions.json";
import GradiantHeader from "@/mobile/components/header/gradiantHeader";
import Footer from "@/mobile/components/layout/Footer";
import { useNavigate } from "react-router-dom";

const securityQuestions = questionsData["104"];

const initialValues = {
  s1: "",
  s2: "",
};

export default function SecurityInstructionsPage() {
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
            const isActive = tab === "Security";
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
            if (!values.s1) errors.s1 = "Required";
            if (values.s1 === "yes" && !values.s2) errors.s2 = "Required";
            if (values.s2 && values.s2.length > 275) errors.s2 = "Maximum 275 characters";
            return errors;
          }}
          onSubmit={values => {
            console.log("Security Instructions Submitted", values);
            // navigate to next section if needed
          }}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form>
              <div className="bg-gray-50 p-5 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">
                    Home Instructions: <span className="text-[#2BCFD5]">Security</span>
                  </p>
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-sm flex items-center justify-center font-semibold">
                    1/1
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm border mt-4">
                <label className="block font-medium text-gray-700 mb-2">
                  {securityQuestions[0].text}
                </label>
                <div className="flex gap-2 mb-4">
                  {["yes", "no"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      className={
                        "flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer " +
                        (values.s1 === opt
                          ? "bg-[#2BCFD5] text-white"
                          : "bg-gray-50 hover:bg-[#25b6bb] hover:text-white")
                      }
                      onClick={() => setFieldValue("s1", opt)}
                    >
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
                <ErrorMessage name="s1" component="div" className="text-red-500 text-sm mt-1" />
                {values.s1 === "yes" && (
                  <>
                    <label className="block font-medium text-gray-700 mb-2">
                      {securityQuestions[1].text}
                    </label>
                    <Field
                      as="textarea"
                      name="s2"
                      maxLength={275}
                      className="w-full border rounded-lg px-3 py-2"
                      rows={4}
                      placeholder="Please list relevant details here."
                    />
                    <div className="text-gray-400 text-xs mt-1 mb-2">
                      {275 - (values.s2?.length || 0)} characters left
                    </div>
                    <ErrorMessage name="s2" component="div" className="text-red-500 text-sm mt-1" />
                  </>
                )}
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
