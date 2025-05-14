import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Avatar } from '@radix-ui/react-avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';
import AppHeader from '@/web/components/Layout/AppHeader';
import Footer from '@/web/components/Layout/Footer';
import avatar from '@/assets/global/defaultAvatar/defaultImage.jpg';
import homeInstructionsData from '@/data/homeIntsructions.json';
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
import ScrollToQuestion from '@/web/components/HomeInstructions/ScrollToQuestion';
import GoodToKnowBox from '@/web/components/Global/GoodToKnowBox';
import SubCategoryFooterNav from '@/web/components/Global/SubCategoryFooterNav';
import SubCategoryTabs from '@/web/components/Global/SubCategoryTabs';
import SubCategoryTitle from '@/web/components/Global/SubCategoryTitle';
import SubCategoryHeader from '@/web/components/Global/SubCategoryHeader';

const PetsInstructions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [savedAnswers, setSavedAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [existingInputId, setExistingInputId] = useState<string | null>(null);
  const [existingCategoryId, setExistingCategoryId] = useState<string | null>(null);
  const [existingSubCategoryId, setExistingSubCategoryId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Get the questionId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const targetQuestionId = queryParams.get('questionId');

  // Initialize questions from JSON data and fetch saved answers
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Set questions from JSON data
      if (homeInstructionsData['101']) {
        setQuestions(homeInstructionsData['101'] as Question[]);
      }

      // Fetch saved answers if user is authenticated
      if (user && user.id) {
        try {
          // Fetch user inputs for this subcategory
          const userInputs = await userInputService.getUserInputsBySubcategory(user.id, '1', '101');

          if (userInputs && userInputs.length > 0) {
            // Get the first user input
            const userInput = userInputs[0];

            // Convert to form values
            const formValues = convertUserInputToFormValues(userInput);
            setSavedAnswers(formValues);

            // Store the existing record IDs
            setExistingInputId(userInput._id);
            setExistingCategoryId(userInput.categoryId);
            setExistingSubCategoryId(userInput.subCategoryId);

            console.log('Loaded saved answers:', formValues);
            console.log('Existing record ID:', userInput._id);
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
  }, [isLoading, targetQuestionId]);

  // Handle form submission
  const handleSubmit = async (values: Record<string, any>, { setSubmitting }: FormikHelpers<Record<string, any>>) => {
    try {
      console.log('Saving pet instructions:', values);

      // Check if user is authenticated
      if (!user || !user.id) {
        console.error('User not authenticated');
        throw new Error('You must be logged in to save answers');
      }

      // Group answers by section
      const answersBySection = questions
        .reduce((sections: Record<string, any[]>, question) => {
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
      const formattedAnswersBySection = Object.entries(answersBySection).map(([sectionId, answers]) => ({
        originalSectionId: sectionId, // Store our original section ID
        isCompleted: true,
        answers
      }));

      // Check if we're updating an existing record or creating a new one
      if (existingInputId) {
        console.log('Updating existing record:', existingInputId);

        try {
          // Update existing record
          await userInputService.updateUserInput(existingInputId, {
            answersBySection: formattedAnswersBySection
          });
          console.log('Successfully updated record');
        } catch (error) {
          console.error('Error updating record:', error);
          // If PATCH fails, fall back to creating a new record
          console.log('Falling back to creating a new record');
          setExistingInputId(null);
        }
      }

      if (!existingInputId) {
        console.log('Creating new record');

        // Format data for API
        const userData = {
          userId: user.id, // Use actual user ID from auth context
          categoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
          originalCategoryId: '1', // Our manual category ID for Home Instructions
          subCategoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
          originalSubCategoryId: '101', // Our manual subcategory ID for pets
          answersBySection: formattedAnswersBySection
        };

        // Save to backend
        const result = await userInputService.createUserInput(userData);

        // Store the new record ID for future updates
        if (result && typeof result === 'object') {
          const typedResult = result as { _id: string; categoryId: string; subCategoryId: string };
          setExistingInputId(typedResult._id);
          setExistingCategoryId(typedResult.categoryId);
          setExistingSubCategoryId(typedResult.subCategoryId);
        }
      }

      setSubmitting(false);
      navigate('/category/homeinstructions/trash');
    } catch (error) {
      console.error('Error saving pet instructions:', error);
      setSubmitting(false);
      // Handle error (show error message, etc.)
    }
  };

  if (questions.length === 0 || isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const validationSchema = buildValidationSchema(questions, Yup);

  // Merge generated initial values with saved answers
  const baseInitialValues = generateInitialValues(questions);
  const initialValues = { ...baseInitialValues, ...savedAnswers };

  return (
    <div className="flex flex-col pt-20 min-h-screen">
      <AppHeader />
      <SubCategoryHeader
        title="Home Instructions"
        backTo="/dashboard"
        user={{
          name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Guest',
          email: user?.email || 'guest@example.com',
          avatar,
        }}
      />
      <SubCategoryTabs />
      <div className="container mx-auto px-6">
        <SubCategoryTitle
          category="Pets"
          description="These files contain questions to help you record your details so they're easy to find later."
        />
      </div>

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Questions */}
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
                              {questions
                                .sort((a, b) => a.order - b.order)
                                .map(question => (
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
                            Save pet information
                          </Button>
                        </div>
                        <GoodToKnowBox
                          title="Filling in Your Pet Information"
                          description="Please provide information about your pets below. This will help your loved ones understand important details about your furry friends."
                        />
                        <SubCategoryFooterNav
                          leftLabel="All topics"
                          leftTo="/category/homeinstructions/info"
                          rightLabel="Trash"
                          rightTo="/category/homeinstructions/trash"
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

export default PetsInstructions;