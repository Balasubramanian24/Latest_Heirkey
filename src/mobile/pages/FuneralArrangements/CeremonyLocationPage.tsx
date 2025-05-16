import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import GradiantHeader from "@/mobile/components/header/gradiantHeader";
import Footer from "@/mobile/components/layout/Footer";
import { CircularProgress } from '@/components/ui/CircularProgress';
import { categoryTabsConfig } from '@/data/categoryTabsConfig';

const initialValues = {
  f6: "",
  f7: "",
};

export default function CeremonyLocationPage() {
  const navigate = useNavigate();

  return (
    <>
      <GradiantHeader title="Funeral Arrangements" showAvatar={true} />
      <div className="p-4">
        {/* Tab Bar */}
        <div className="flex flex-row flex-nowrap gap-3 mb-4 bg-gray-50 rounded-lg p-4 overflow-x-auto scrollbar-hide">
          {categoryTabsConfig.funeralarrangements.map(tab => {
            const isActive = tab.label === "Ceremony Location";
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
              Funeral Arrangements: <span className="text-[#2BCFD5]">Ceremony Location</span>
            </p>
            <CircularProgress value={1} max={1} size={40} stroke={3} color="#2BCFD5" />
          </div>
        </div>

        {/* Form */}
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            console.log(values);
            navigate('/category/funeralarrangements/clergy');
          }}
        >
          {({ values }) => (
            <Form className="bg-gray-50 p-4 rounded-xl shadow-sm border">
              <div className="space-y-4">
                {/* Place of Worship Preference */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Do you have a Place of Worship Preference? *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer">
                      <Field type="radio" name="f6" value="yes" className="hidden" />
                      <span className={values.f6 === "yes" ? "text-[#2BCFD5]" : ""}>Yes</span>
                    </label>
                    <label className="flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer">
                      <Field type="radio" name="f6" value="no" className="hidden" />
                      <span className={values.f6 === "no" ? "text-[#2BCFD5]" : ""}>No</span>
                    </label>
                  </div>
                  <ErrorMessage name="f6" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Place Name and Location */}
                {values.f6 === "yes" && (
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">
                      What is the Name and Location of the place? *
                    </label>
                    <Field
                      name="f7"
                      as="textarea"
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="Enter place name and location"
                    />
                    <ErrorMessage name="f7" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#2BCFD5] text-white px-6 py-2 rounded-lg font-semibold mt-6"
                >
                  Save & Continue
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