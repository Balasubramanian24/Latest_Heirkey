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

const FuneralNotification = () => {
  const [savedAnswers, setSavedAnswers] = useState<Record<string, string>>({});
  const [existingInputId, setExistingInputId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  // Get data from Redux store using selectors
  const questions = useAppSelector((state: any) =>
    state.funeralArrangements.questions['205']?.filter((q: Question) => q.sectionId === '205D') || []
  );
  const loading = useAppSelector((state: any) => state.funeralArrangements.loading);
  const userInputs = useAppSelector((state: any) => state.funeralArrangements.userInputs);
  const tabs = categoryTabsConfig['funeralarrangements'];

  // Get the questionId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const targetQuestionId = queryParams.get('questionId');

  /**
   * Fetch user inputs when component mounts
   */
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserInputs(user.id));
    }
  }, [dispatch, user]);

  /**
   * Process user inputs to get saved answers
   */
  useEffect(() => {
    if (userInputs.length > 0 && !loading) {
      // Find the user input for this subcategory
      const userInput = userInputs.find((input: UserInput) => input.originalSubCategoryId === '205D');

      if (userInput) {
        // Convert to form values
        const formValues = convertUserInputToFormValues(userInput);
        setSavedAnswers(formValues);

        // Store the existing record ID
        setExistingInputId(userInput._id || null);
      }
    }
  }, [userInputs, loading]);

  /**
   * Scroll to the target question if specified in URL
   */
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
  /**
   * Handles form submission for funeral notification details
   * Processes form values, validates, and saves to the backend
   */
  const handleSubmit = async (values: Record<string, string>, { setSubmitting }: FormikHelpers<Record<string, string>>) => {
    try {
      // Check if user is authenticated
      if (!user || !user.id) {
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
          // Only include answers that are not empty strings or undefined
          if (answer !== undefined && answer !== '') {
            sections[question.sectionId].push({
              index: sections[question.sectionId].length,
              originalQuestionId: question.id,
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
        originalSectionId: sectionId,
        isCompleted: true,
        answers: answers as Array<{
          index: number;
          originalQuestionId: string;
          question: string;
          type: string;
          answer: string;
        }>
      }));

      // Check if there are any answers to save
      const hasAnswers = formattedAnswersBySection.some(section => section.answers.length > 0);
      if (!hasAnswers) {
        setSubmitting(false);
        return; // Exit early if there are no answers
      }

      // Ensure all answers are properly formatted with string values
      const sanitizedAnswersBySection = formattedAnswersBySection.map(section => ({
        ...section,
        originalSectionId: section.originalSectionId || "205D", // Ensure we have a section ID
        isCompleted: true,
        answers: section.answers
          .filter(answer => answer && answer.originalQuestionId) // Filter out invalid answers
          .map(answer => ({
            index: answer.index || 0,
            originalQuestionId: answer.originalQuestionId,
            question: answer.question || "",
            type: answer.type || "text", // Ensure we have a valid type
            answer: String(answer.answer || "").trim()
          }))
      }));

      // Check if we're updating an existing record or creating a new one
      if (existingInputId) {
        try {
          // Update existing record using Redux action
          await dispatch(updateUserInput({
            id: existingInputId,
            userData: {
              userId: user.id,
              categoryId: generateObjectId(),
              originalCategoryId: '3', // Funeral Arrangements category ID
              subCategoryId: generateObjectId(),
              originalSubCategoryId: '205D', // Notification subcategory ID
              answersBySection: sanitizedAnswersBySection
            } as UserInput
          })).unwrap();
        } catch (updateError) {
          // Try direct API call if Redux action fails
          try {
            const response = await fetch(`/v1/api/user-inputs/${existingInputId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                userId: user.id,
                originalCategoryId: '3',
                originalSubCategoryId: '205D',
                answersBySection: sanitizedAnswersBySection
              }),
            });

            if (!response.ok) {
              throw new Error(`API error: ${response.status}`);
            }
          } catch (directApiError) {
            throw directApiError;
          }
        }
      } else {
        // Format data for API
        const userData: Omit<UserInput, '_id'> = {
          userId: user.id,
          categoryId: generateObjectId(),
          originalCategoryId: '3', // Funeral Arrangements category ID
          subCategoryId: generateObjectId(),
          originalSubCategoryId: '205D', // Notification subcategory ID
          answersBySection: sanitizedAnswersBySection
        };

        // Save to backend using Redux action
        let result;
        try {
          result = await dispatch(saveUserInput(userData)).unwrap();
        } catch (apiError: any) {
          // Try direct API call if Redux action fails
          try {
            const response = await fetch('/v1/api/user-inputs', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                userId: user.id,
                originalCategoryId: '3',
                originalSubCategoryId: '205D',
                answersBySection: sanitizedAnswersBySection
              }),
            });

            if (!response.ok) {
              throw new Error(`API error: ${response.status}`);
            }

            result = await response.json();
          } catch (directApiError) {
            throw directApiError;
          }
        }

        // Store the new record ID for future updates
        if (result && result._id) {
          setExistingInputId(result._id);
        }
      }

      setSubmitting(false);
      navigate('/category/funeralarrangements/proceedings');
    } catch (error: any) {
      // Handle error silently in production, log only in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error saving notification details:', error);
      }

      setSubmitting(false);
      // TODO: Add user-friendly error notification here
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
          category="Notifications"
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
                        <GoodToKnowBox
                            title="Editing my Answers"
                            description="Each topic below is a part of your funeral arrangements, with questions to help you provide important information for you and your loved ones. Click any topic to answer the questions at your own pace—we'll save everything for you."
                        />
                        <SubCategoryFooterNav
                          leftLabel="Clergy"
                            leftTo="/category/funeralarrangements/clergy"
                            rightLabel="Proceedings"
                            rightTo="/category/funeralarrangements/proceedings"
                          />
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

export default FuneralNotification;
