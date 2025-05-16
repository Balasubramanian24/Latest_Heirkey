import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import AppHeader from '@/web/components/Layout/AppHeader';
import Footer from '@/web/components/Layout/Footer';
import avatar from '@/assets/global/defaultAvatar/defaultImage.jpg';
import SearchPanel from '@/web/pages/Global/SearchPanel';
import { generateObjectId, convertUserInputToFormValues } from '@/services/userInputService';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  fetchUserInputs,
  saveUserInput,
  updateUserInput,
  UserInput
} from '@/store/slices/funeralArrangementsSlice';
import {
  Question,
  QuestionItem,
  buildValidationSchema,
  generateInitialValues,
  handleDependentAnswers
} from '@/web/components/FuneralInstructions/FormFields';
import ScrollToQuestion from '@/web/components/FuneralInstructions/ScrollToQuestion';
import GoodToKnowBox from '@/web/components/Global/GoodToKnowBox';
import SubCategoryFooterNav from '@/web/components/Global/SubCategoryFooterNav';
import SubCategoryTabs from '@/web/components/Global/SubCategoryTabs';
import SubCategoryTitle from '@/web/components/Global/SubCategoryTitle';
import SubCategoryHeader from '@/web/components/Global/SubCategoryHeader';
import { categoryTabsConfig } from '@/data/categoryTabsConfig';

const CeremonyLocation = () => {
  const [savedAnswers, setSavedAnswers] = useState<Record<string, string>>({});
  const [existingInputId, setExistingInputId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  // Get data from Redux store using selectors
  const questions = useAppSelector((state: any) =>
    state.funeralArrangements.questions['205']?.filter((q: Question) => q.sectionId === '205B') || []
  );
  const loading = useAppSelector((state: any) => state.funeralArrangements.loading);
  const userInputs = useAppSelector((state: any) => state.funeralArrangements.userInputs);
  const tabs = categoryTabsConfig['funeralarrangements'];

  // Get the questionId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const targetQuestionId = queryParams.get('questionId');

  // Fetch user inputs when component mounts
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserInputs(user.id));
    }
  }, [dispatch, user]);

  // Process user inputs to get saved answers
  useEffect(() => {
    if (userInputs.length > 0 && !loading) {
      // Find the user input for this subcategory
      const userInput = userInputs.find((input: UserInput) => input.originalSubCategoryId === '205B');

      if (userInput) {
        // Convert to form values
        const formValues = convertUserInputToFormValues(userInput);
        setSavedAnswers(formValues);

        // Store the existing record ID
        setExistingInputId(userInput._id || null);

        console.log('Loaded saved answers:', formValues);
        console.log('Existing record ID:', userInput._id);
      }
    }
  }, [userInputs, loading]);

  // Scroll to the target question if specified in URL
  useEffect(() => {
    if (!loading && targetQuestionId) {
      // Use setTimeout to ensure the DOM has been updated
      setTimeout(() => {
        const element = document.getElementById(`question-${targetQuestionId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add a highlight effect
          element.classList.add('bg-yellow-100');
          setTimeout(() => {
            element.classList.remove('bg-yellow-100');
          }, 2000);
        }
      }, 500);
    }
  }, [loading, targetQuestionId]);

  // Handle form submission
  const handleSubmit = async (values: Record<string, string>, { setSubmitting }: FormikHelpers<Record<string, string>>) => {
    try {
      console.log('Saving ceremony location details:', values);

      // Check if user is authenticated
      if (!user || !user.id) {
        console.error('User not authenticated');
        throw new Error('You must be logged in to save answers');
      }

      // Group answers by section
      const answersBySection = questions
        .reduce((sections: Record<string, Array<{
          index: number;
          originalQuestionId: string;
          question: string;
          type: string;
          answer: string;
        }>>, question: Question) => {
          if (!sections[question.sectionId]) {
            sections[question.sectionId] = [];
          }

          const answer = values[question.id];
          if (answer) {
            sections[question.sectionId].push({
              index: sections[question.sectionId].length,
              originalQuestionId: question.id, // Store our original question ID
              question: question.text,
              type: question.type,
              answer
            });
          }

          return sections;
        }, {});

      // Format answers data
      const formattedAnswersBySection: Array<{
        originalSectionId: string;
        isCompleted: boolean;
        answers: Array<{
          index: number;
          originalQuestionId: string;
          question: string;
          type: string;
          answer: string;
        }>;
      }> = Object.entries(answersBySection).map(([sectionId, answers]) => ({
        originalSectionId: sectionId, // Store our original section ID
        isCompleted: true,
        answers: answers as Array<{
          index: number;
          originalQuestionId: string;
          question: string;
          type: string;
          answer: string;
        }>
      }));

      // Check if we're updating an existing record or creating a new one
      if (existingInputId) {
        console.log('Updating existing record:', existingInputId);

        // Update existing record using Redux action
        await dispatch(updateUserInput({
          id: existingInputId,
          userData: {
            userId: user.id,
            categoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
            originalCategoryId: '3', // Funeral Arrangements category ID
            subCategoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
            originalSubCategoryId: '205B', // Ceremony Location subcategory ID
            answersBySection: formattedAnswersBySection
          } as UserInput
        })).unwrap();

        console.log('Successfully updated record');
      } else {
        console.log('Creating new record');

        // Format data for API
        const userData: Omit<UserInput, '_id'> = {
          userId: user.id, // Use actual user ID from auth context
          categoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
          originalCategoryId: '3', // Funeral Arrangements category ID
          subCategoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
          originalSubCategoryId: '205B', // Ceremony Location subcategory ID
          answersBySection: formattedAnswersBySection
        };

        // Save to backend using Redux action
        const result = await dispatch(saveUserInput(userData)).unwrap();

        // Store the new record ID for future updates
        if (result && result._id) {
          setExistingInputId(result._id);
        }
      }

      setSubmitting(false);
      navigate('/category/funeralarrangements/clergy');
    } catch (error) {
      console.error('Error saving ceremony location details:', error);
      setSubmitting(false);
      // Handle error (show error message, etc.)
    }
  };

  if (questions.length === 0 || loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const validationSchema = buildValidationSchema(questions, Yup);
  const baseInitialValues = generateInitialValues(questions);
  const initialValues = { ...baseInitialValues, ...savedAnswers };

  return (
    <div className="flex flex-col pt-20 min-h-screen">
      <AppHeader />
      <SubCategoryHeader
        title="Funeral Arrangements"
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
          mainCategory="Funeral Arrangements"
          category="Location"
          description="These files contain questions to help you record your details so they're easy to find later."
        />
      </div>
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, isSubmitting, isValid, dirty, setValues }) => {
                  // Handle dependent answers when values change
                  // We use a simple comparison instead of useEffect and useRef
                  // to avoid React Hook errors inside render props
                  const handleDependentFields = () => {
                    handleDependentAnswers(values, questions, setValues);
                  };

                  // Call once when component renders
                  if (Object.keys(values).length > 0) {
                    setTimeout(handleDependentFields, 0);
                  }

                  return (
                    <Form>
                      <div className="mt-4">
                        <ScrollToQuestion questions={questions}>
                          {(refs) => (
                            <>
                              {[...questions]
                                .sort((a: Question, b: Question) => a.order - b.order)
                                .map((question: Question) => (
                                  <div
                                    key={question.id}
                                    id={`question-${question.id}`}
                                    ref={(el: HTMLDivElement | null) => {
                                      refs[question.id] = el;
                                    }}
                                  >
                                    <QuestionItem
                                      question={question}
                                      values={values}
                                    />
                                  </div>
                                ))
                              }
                            </>
                          )}
                        </ScrollToQuestion>
                        <div className="mt-8 flex justify-end">
                          <Button
                            type="submit"
                            disabled={isSubmitting || !isValid || !dirty}
                            className="bg-[#1ccfc9] hover:bg-[#19bbb5]"
                          >
                            Save & Continue
                          </Button>
                        </div>

                        <div className="mt-8 flex justify-between">
                          <SubCategoryFooterNav
                            leftLabel="Details"
                            leftTo="/category/funeralarrangements/details"
                            rightLabel="Clergy"
                            rightTo="/category/funeralarrangements/clergy"
                          />
                        </div>

                        <div className="mt-8">
                          <GoodToKnowBox
                            title="Editing my Answers"
                            description="Each topic below is a part of your funeral arrangements, with questions to help you provide important information for you and your loved ones. Click any topic to answer the questions at your own pace—we'll save everything for you."
                          />
                        </div>
                      </div>
                    </Form>
                  );
                }}
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

export default CeremonyLocation;
