import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from 'yup';
import GradiantHeader from "@/mobile/components/header/gradiantHeader";
import Footer from "@/mobile/components/layout/Footer";
import { CircularProgress } from '@/components/ui/CircularProgress';
import { categoryTabsConfig } from '@/data/categoryTabsConfig';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { generateObjectId, convertUserInputToFormValues } from '@/services/userInputService';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  fetchUserInputs,
  saveUserInput,
  updateUserInput,
  UserInput,
  selectUserInputsBySubcategoryId,
  selectLoading,
  selectError
} from '@/store/slices/funeralArrangementsSlice';

// Initial values for the form
const initialValues = {
  f1: "",
  f2: "",
  f3: "",
  f4: "",
  f5: "",
};

// Validation schema
const validationSchema = Yup.object().shape({
  f1: Yup.string().required('Please select an option'),
  f2: Yup.string().when('f1', {
    is: 'yes',
    then: (schema) => schema.required('Please provide the funeral home name')
  }),
  f3: Yup.string().required('Please select an option'),
  f4: Yup.string().required('Please select an option'),
  f5: Yup.string().when('f4', {
    is: 'yes',
    then: (schema) => schema.required('Please provide the deed location')
  })
});

export default function FuneralDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [savedAnswers, setSavedAnswers] = useState<Record<string, string>>({});
  const [existingInputId, setExistingInputId] = useState<string | null>(null);
  const [formError, setError] = useState<string | null>(null);

  // Get data from Redux store
  const userInputs = useAppSelector((state) => selectUserInputsBySubcategoryId('205A')(state));
  const isLoading = useAppSelector(selectLoading);
  const reduxError = useAppSelector(selectError);

  // Get the questionId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const targetQuestionId = queryParams.get('questionId');

  // Fetch user inputs when component mounts
  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchUserInputs(user.id));
    }
  }, [dispatch, user]);

  // Process user inputs when they are loaded
  useEffect(() => {
    if (userInputs && userInputs.length > 0) {
      // Use the first matching record
      const userInput = userInputs[0];

      // Only update state if we have a new ID or if it's the first time
      if (userInput._id && userInput._id !== existingInputId) {
        setExistingInputId(userInput._id);

        // Convert the saved answers to form values
        const formValues = convertUserInputToFormValues(userInput);
        setSavedAnswers(formValues);
      } else if (!existingInputId && userInput._id) {
        // First time setting the ID
        setExistingInputId(userInput._id);

        // Convert the saved answers to form values
        const formValues = convertUserInputToFormValues(userInput);
        setSavedAnswers(formValues);
      }
    }
  }, [userInputs, existingInputId]);

  // Show loading state if data is being fetched
  if (isLoading) {
    return (
      <>
        <GradiantHeader title="Funeral Arrangements" showAvatar={true} />
        <div className="p-4 text-center">Loading your answers...</div>
      </>
    );
  }

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

        {/* Error message */}
        {(formError || reduxError) && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{formError || reduxError}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <Formik
          initialValues={Object.keys(savedAnswers).length > 0 ? savedAnswers : initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              // Check if user is authenticated
              if (!user || !user.id) {
                setError('You must be logged in to save answers');
                return;
              }

              // Format the answers for the backend
              const answers = Object.entries(values)
                .filter(([_, value]) => value !== "") // Filter out empty answers
                .map(([key, value], index) => {
                  let questionText = "";
                  let questionType = "text";

                  switch(key) {
                    case 'f1':
                      questionText = "Do you have a Funeral Home Preference?";
                      questionType = "boolean";
                      break;
                    case 'f2':
                      questionText = "Name of Funeral Home";
                      break;
                    case 'f3':
                      questionText = "Is your Funeral Prepaid?";
                      questionType = "boolean";
                      break;
                    case 'f4':
                      questionText = "Do you have a burial plot?";
                      questionType = "boolean";
                      break;
                    case 'f5':
                      questionText = "If you have a plot, where is the deed located?";
                      break;
                  }

                  // Log the answer being saved
                  console.log('Saving answer:', { key, value, questionText, questionType });

                  return {
                    index,
                    originalQuestionId: key,
                    question: questionText,
                    type: questionType,
                    answer: value
                  };
                });

              // Format the answers by section
              const formattedAnswersBySection = [{
                originalSectionId: '205A', // Store our original section ID for details
                isCompleted: true,
                answers
              }];

              // Check if we're updating an existing record or creating a new one
              if (existingInputId) {
                console.log('Updating existing record:', existingInputId);

                try {
                  // Update existing record using Redux action
                  await dispatch(updateUserInput({
                    id: existingInputId,
                    userData: {
                      userId: user.id,
                      categoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
                      originalCategoryId: '3', // Category ID for Funeral Arrangements
                      subCategoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
                      originalSubCategoryId: '205A', // Subcategory ID for details
                      answersBySection: formattedAnswersBySection
                    } as UserInput
                  })).unwrap();

                  console.log('Successfully updated record');
                  // Navigate to the next page immediately after saving
                  navigate('/category/funeralarrangements/ceremonylocation');
                } catch (error) {
                  console.error('Error updating record:', error);
                  // If update fails, fall back to creating a new record
                  console.log('Falling back to creating a new record');
                  setExistingInputId(null);
                }
              }

              // If no existing record or update failed, create a new one
              if (!existingInputId) {
                // Format data for API
                const userData: Omit<UserInput, '_id'> = {
                  userId: user.id, // Use actual user ID from auth context
                  categoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
                  originalCategoryId: '3', // Category ID for Funeral Arrangements
                  subCategoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
                  originalSubCategoryId: '205A', // Subcategory ID for details
                  answersBySection: formattedAnswersBySection
                };

                // Save to backend using Redux action
                const result = await dispatch(saveUserInput(userData)).unwrap();

                // Store the new record ID for future updates
                if (result && result._id) {
                  setExistingInputId(result._id);
                  // Navigate to the next page immediately after saving
                  navigate('/category/funeralarrangements/ceremonylocation');
                }
              }

              setSubmitting(false);

              // Navigate to the review page if we came from a specific question
              if (targetQuestionId) {
                navigate(`/category/funeralarrangements/review`);
              }
            } catch (err: unknown) {
              console.error('Error saving funeral details:', err);
              const errorMessage = err instanceof Error ? err.message : 'Failed to save your answers. Please try again.';
              setError(errorMessage);
              setSubmitting(false);
            }
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