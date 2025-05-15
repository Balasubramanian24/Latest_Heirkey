import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import AppHeader from '@/web/components/Layout/AppHeader';
import Footer from '@/web/components/Layout/Footer';
import avatar from '@/assets/global/defaultAvatar/defaultImage.jpg';
import funeralArrangementsData from '@/data/funeralArrangements.json';
import SearchPanel from '@/web/pages/Global/SearchPanel';
import userInputService, { generateObjectId, convertUserInputToFormValues } from '@/services/userInputService';
import { useAuth } from '@/contexts/AuthContext';
import {
  Question,
  QuestionItem,
  buildValidationSchema,
  generateInitialValues,
  handleDependentAnswers
} from '@/web/components/HomeInstructions/FormFields';
import GoodToKnowBox from '@/web/components/Global/GoodToKnowBox';
import SubCategoryFooterNav from '@/web/components/Global/SubCategoryFooterNav';
import SubCategoryTabs from '@/web/components/Global/SubCategoryTabs';
import SubCategoryTitle from '@/web/components/Global/SubCategoryTitle';
import SubCategoryHeader from '@/web/components/Global/SubCategoryHeader';
import { categoryTabsConfig } from '@/data/categoryTabsConfig';

const FuneralNotification = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [savedAnswers, setSavedAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [existingInputId, setExistingInputId] = useState<string | null>(null);
  const [existingCategoryId, setExistingCategoryId] = useState<string | null>(null);
  const [existingSubCategoryId, setExistingSubCategoryId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const tabs = categoryTabsConfig['funeralarrangements'];

  // Get the questionId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const targetQuestionId = queryParams.get('questionId');

  // Initialize questions from JSON data and fetch saved answers
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Set questions from JSON data (section 205D)
      if (funeralArrangementsData['205']) {
        // Map questions to ensure type compatibility
        const rawQuestions = funeralArrangementsData['205'].filter(q => q.sectionId === '205D');
        const mappedQuestions = rawQuestions.map(q => {
          if (q.type === 'text' || q.type === 'textarea' || q.type === 'number' || q.type === 'boolean' || q.type === 'choice') {
            return q;
          }
          // Default to text if type is missing or unknown
          return { ...q, type: 'text' };
        });
        setQuestions(mappedQuestions as Question[]);
      }
      // Fetch saved answers if user is authenticated
      if (user && user.id) {
        try {
          // Fetch user inputs for this subcategory
          const userInputs = await userInputService.getUserInputsBySubcategory(user.id, '2', '205D');
          if (userInputs && userInputs.length > 0) {
            const userInput = userInputs[0];
            const formValues = convertUserInputToFormValues(userInput);
            setSavedAnswers(formValues);
            setExistingInputId(userInput._id);
            setExistingCategoryId(userInput.categoryId);
            setExistingSubCategoryId(userInput.subCategoryId);
          }
        } catch (error) {
          console.error('Error fetching saved answers:', error);
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, [user]);

  // Scroll to the target question if specified in URL
  useEffect(() => {
    if (!isLoading && targetQuestionId) {
      setTimeout(() => {
        const element = document.getElementById(`question-${targetQuestionId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('bg-yellow-100');
          setTimeout(() => {
            element.classList.remove('bg-yellow-100');
          }, 2000);
        }
      }, 500);
    }
  }, [isLoading, targetQuestionId]);

  // Handle form submission
  const handleSubmit = async (values: Record<string, any>, { setSubmitting }: FormikHelpers<Record<string, any>>) => {
    try {
      if (!user || !user.id) {
        throw new Error('You must be logged in to save answers');
      }
      // Group answers by section
      const answersBySection = questions.reduce((sections: Record<string, any[]>, question) => {
        if (!sections[question.sectionId]) {
          sections[question.sectionId] = [];
        }
        const answer = values[question.id];
        if (answer !== undefined) {
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
      const formattedAnswersBySection = Object.entries(answersBySection).map(([sectionId, answers]) => ({
        originalSectionId: sectionId,
        isCompleted: true,
        answers
      }));
      if (existingInputId) {
        try {
          await userInputService.updateUserInput(existingInputId, {
            answersBySection: formattedAnswersBySection
          });
        } catch (error) {
          setExistingInputId(null);
        }
      }
      if (!existingInputId) {
        const userData = {
          userId: user.id,
          categoryId: generateObjectId(),
          originalCategoryId: '2', // Funeral Arrangements
          subCategoryId: generateObjectId(),
          originalSubCategoryId: '205D',
          answersBySection: formattedAnswersBySection
        };
        const result = await userInputService.createUserInput(userData);
        if (result && typeof result === 'object') {
          const typedResult = result as { _id: string; categoryId: string; subCategoryId: string };
          setExistingInputId(typedResult._id);
          setExistingCategoryId(typedResult.categoryId);
          setExistingSubCategoryId(typedResult.subCategoryId);
        }
      }
      setSubmitting(false);
      navigate('/category/funeralarrangements/proceedings');
    } catch (error) {
      setSubmitting(false);
    }
  };

  if (questions.length === 0 || isLoading) {
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
          category="Funeral Arrangements: Notifications"
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
                  const handleDependentFields = () => {
                    handleDependentAnswers(values, questions, setValues);
                  };
                  if (Object.keys(values).length > 0) {
                    setTimeout(handleDependentFields, 0);
                  }
                  return (
                    <Form>
                      <div className="mt-4">
                        {questions
                          .sort((a, b) => a.order - b.order)
                          .map(question => (
                            <div key={question.id} id={`question-${question.id}`}>
                              <QuestionItem question={question} values={values} />
                            </div>
                          ))}
                        <div className="mt-8 flex justify-between">
                          <SubCategoryFooterNav
                            leftLabel="Clergy"
                            leftTo="/category/funeralarrangements/funeralclergy"
                            rightLabel="Proceedings"
                            rightTo="/category/funeralarrangements/proceedings"
                          />
                        </div>
                        <div className="mt-8">
                          <GoodToKnowBox
                            title="Editing my Answers"
                            description="Each topic below is a part of your home documents, with questions to help you provide important information for you and your loved ones. Click any topic to answer the questions at your own pace—we'll save everything for you."
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

export default FuneralNotification;
