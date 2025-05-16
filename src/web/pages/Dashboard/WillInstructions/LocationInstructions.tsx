import { useEffect, useState, useRef } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import AppHeader from '@/web/components/Layout/AppHeader';
import Footer from '@/web/components/Layout/Footer';
import SearchPanel from '@/web/pages/Global/SearchPanel';
import GoodToKnowBox from '@/web/components/Global/GoodToKnowBox';
import SubCategoryTabs from '@/web/components/Global/SubCategoryTabs';
import SubCategoryFooterNav from '@/web/components/Global/SubCategoryFooterNav';
import {
  QuestionItem,
  buildValidationSchema,
  generateInitialValues
} from '@/web/components/WillInstructions/FormFields';
import SubCategoryHeader from '@/web/components/Global/SubCategoryHeader';
import avatar from '@/assets/global/defaultAvatar/defaultImage.jpg';
import SubCategoryTitle from '@/web/components/Global/SubCategoryTitle';
import {
  fetchUserInputs,
  saveUserInput,
  updateUserInput,
  updateFormValues,
  selectQuestionsBySubcategoryId,
  selectUserInputsBySubcategoryId,
  selectFormValues
} from '@/store/slices/willInstructionsSlice';
import { generateObjectId } from '@/services/userInputService';

const LocationInstructions = () => {
  const [existingInputId, setExistingInputId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get questions and form values from Redux
  const questions = useAppSelector(selectQuestionsBySubcategoryId('105B'));
  const userInputs = useAppSelector(selectUserInputsBySubcategoryId('105B'));
  const formValues = useAppSelector(selectFormValues);

  const tabs = [
    { label: 'Location', path: '/category/willinstructions/location' },
    { label: 'Legal Representation', path: '/category/willinstructions/legal' }
  ];

  // Use a ref to track if we've already processed the user inputs
  const processedUserInputs = useRef(false);

  // Fetch user inputs only once when component mounts
  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchUserInputs(user.id));
    }
  }, [dispatch, user]);

  // Process user inputs only once when they're loaded
  useEffect(() => {
    // Only process if we have user inputs and haven't processed them yet
    if (userInputs && userInputs.length > 0 && !processedUserInputs.current) {
      // Mark as processed to prevent infinite loops
      processedUserInputs.current = true;

      // Set the existing input ID for form submission
      setExistingInputId(userInputs[0]._id || null);

      // Combine all answers from all sections into a single form values object
      const combinedFormValues: Record<string, string> = {};
      userInputs.forEach(input => {
        input.answersBySection.forEach(section => {
          section.answers.forEach(answer => {
            if (answer.originalQuestionId) {
              combinedFormValues[answer.originalQuestionId] = answer.answer;
            }
          });
        });
      });

      // Update form values in Redux - only once
      dispatch(updateFormValues(combinedFormValues));
    }
  }, [userInputs, dispatch]);

  if (questions.length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col pt-20 min-h-screen">
      <AppHeader />
      <SubCategoryHeader
        title="Will & Testament"
        backTo="/dashboard"
        user={{
          name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Guest',
          email: user?.email || 'guest@example.com',
          avatar,
        }}
      />
      <SubCategoryTabs tabs={tabs} />
      <div className="container mx-auto px-6">
        <SubCategoryTitle
          mainCategory="Will & Testament"
          category="Location"
          description="These files contain questions to help you record your details so they're easy to find later."
        />
      </div>
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Formik
                initialValues={formValues || generateInitialValues(questions as any)}
                validationSchema={Yup.object(buildValidationSchema(questions as any, Yup))}
                onSubmit={async (values) => {
                  try {
                    // Store form values in Redux for cross-page navigation
                    dispatch(updateFormValues(values));

                    // Format answers by section
                    const formattedAnswersBySection = [
                      {
                        originalSectionId: '105A',
                        isCompleted: true,
                        answers: questions
                          .filter(q => q.sectionId === '105A')
                          .map((q, index) => ({
                            index,
                            originalQuestionId: q.id,
                            question: q.text,
                            type: q.type,
                            answer: values[q.id] || ''
                          }))
                      },
                      {
                        originalSectionId: '105B',
                        isCompleted: true,
                        answers: questions
                          .filter(q => q.sectionId === '105B')
                          .map((q, index) => ({
                            index,
                            originalQuestionId: q.id,
                            question: q.text,
                            type: q.type,
                            answer: values[q.id] || ''
                          }))
                      }
                    ];

                    // Check if we're updating an existing record or creating a new one
                    if (existingInputId) {
                      console.log('Updating existing record:', existingInputId);

                      // Update existing record using Redux action
                      await dispatch(updateUserInput({
                        id: existingInputId,
                        userData: {
                          userId: user?.id || 'guest',
                          categoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
                          originalCategoryId: '2', // Will Instructions category
                          subCategoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
                          originalSubCategoryId: '105B',
                          answersBySection: formattedAnswersBySection
                        }
                      }));

                      console.log('Successfully updated record');
                    } else {
                      console.log('Creating new record');

                      // Format data for API
                      const userData = {
                        userId: user?.id || 'guest', // Use actual user ID from auth context
                        categoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
                        originalCategoryId: '2', // Our manual category ID for Will Instructions
                        subCategoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
                        originalSubCategoryId: '105B', // Our manual subcategory ID for location
                        answersBySection: formattedAnswersBySection
                      };

                      // Save to backend using Redux action
                      const result = await dispatch(saveUserInput(userData));

                      // Store the new record ID for future updates
                      const payload = result.payload as any;
                      if (payload && payload._id) {
                        setExistingInputId(payload._id);
                      }
                    }

                    // Navigate to next page with a slight delay to ensure Redux state is updated
                    setTimeout(() => {
                      navigate('/category/willinstructions/legal');
                    }, 100);
                  } catch (error) {
                    console.error('Error saving data:', error);
                    // Handle error (show message to user)
                  }
                }}
              >
                {({ values, isSubmitting }) => (
                  <Form>
                    {questions.map((question) => (
                      <QuestionItem key={question.id} question={question as any} formValues={values} />
                    ))}
                    <GoodToKnowBox
                      title="Editing my Answers"
                      description="Each topic below is a part of your home documents, with questions to help you provide important information for you and your loved ones. Click any topic to answer the questions at your own pace—we'll save everything for you."
                    />
                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#2BCFD5] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#25b6bb] w-full"
                      >
                        {isSubmitting ? 'Saving...' : 'Save and Continue'}
                      </button>
                    </div>
                    <SubCategoryFooterNav
                      leftLabel="All topics"
                      leftTo="/dashboard"
                      rightLabel="Legal Representation"
                      rightTo="/category/willinstructions/legal"
                    />
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          <div>
            <SearchPanel />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LocationInstructions;