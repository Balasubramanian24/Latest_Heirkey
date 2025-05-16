import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import GradiantHeader from "@/mobile/components/header/gradiantHeader";
import Footer from "@/mobile/components/layout/Footer";
import { CircularProgress } from '@/components/ui/CircularProgress';
import { categoryTabsConfig } from '@/data/categoryTabsConfig';

const initialValues = {
  f1: "",
  f2: "",
  f3: "",
  f4: "",
  f5: "",
};

export default function FuneralDetailsPage() {
  const navigate = useNavigate();

  return (
    <>
      <GradiantHeader title="Funeral Arrangements" showAvatar={true} />
      <div className="p-4">
        {/* Tab Bar */}
        <div className="flex flex-row flex-nowrap gap-3 mb-4 bg-gray-50 rounded-lg p-1 overflow-x-auto scrollbar-hide">
          {categoryTabsConfig.funeralarrangements.map(tab => {
            const isActive = tab.label === "Details";
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
              Funeral Arrangements: <span className="text-[#2BCFD5]">Details</span>
            </p>
            <CircularProgress value={1} max={1} size={40} stroke={3} color="#2BCFD5" />
          </div>
        </div>

        {/* Form */}
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            console.log(values);
            navigate('/category/funeralarrangements/ceremonylocation');
          }}
        >
          {({ values }) => (
            <Form className="bg-gray-50 p-4 rounded-xl shadow-sm border">
              <div className="space-y-4">
                {/* Funeral Home Preference */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Do you have a Funeral Home Preference? *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer">
                      <Field type="radio" name="f1" value="yes" className="hidden" />
                      <span className={values.f1 === "yes" ? "text-[#2BCFD5]" : ""}>Yes</span>
                    </label>
                    <label className="flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer">
                      <Field type="radio" name="f1" value="no" className="hidden" />
                      <span className={values.f1 === "no" ? "text-[#2BCFD5]" : ""}>No</span>
                    </label>
                  </div>
                  <ErrorMessage name="f1" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Funeral Home Name */}
                {values.f1 === "yes" && (
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">
                      Name of Funeral Home *
                    </label>
                    <Field
                      name="f2"
                      type="text"
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="Enter funeral home name"
                    />
                    <ErrorMessage name="f2" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                )}

                {/* Prepaid Question */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Is your Funeral Prepaid? *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer">
                      <Field type="radio" name="f3" value="yes" className="hidden" />
                      <span className={values.f3 === "yes" ? "text-[#2BCFD5]" : ""}>Yes</span>
                    </label>
                    <label className="flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer">
                      <Field type="radio" name="f3" value="no" className="hidden" />
                      <span className={values.f3 === "no" ? "text-[#2BCFD5]" : ""}>No</span>
                    </label>
                  </div>
                  <ErrorMessage name="f3" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Burial Plot Question */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Do you have a burial plot? *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer">
                      <Field type="radio" name="f4" value="yes" className="hidden" />
                      <span className={values.f4 === "yes" ? "text-[#2BCFD5]" : ""}>Yes</span>
                    </label>
                    <label className="flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer">
                      <Field type="radio" name="f4" value="no" className="hidden" />
                      <span className={values.f4 === "no" ? "text-[#2BCFD5]" : ""}>No</span>
                    </label>
                  </div>
                  <ErrorMessage name="f4" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Plot Deed Location */}
                {values.f4 === "yes" && (
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">
                      If you have a plot, where is the deed located? *
                    </label>
                    <Field
                      name="f5"
                      type="text"
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="Enter deed location"
                    />
                    <ErrorMessage name="f5" component="div" className="text-red-500 text-sm mt-1" />
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