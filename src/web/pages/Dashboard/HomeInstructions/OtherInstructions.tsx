import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import userInputService, { generateObjectId } from '@/services/userInputService';
import { useAuth } from '@/contexts/AuthContext';
import {
  Question,
  QuestionItem,
  buildValidationSchema,
  generateInitialValues,
  calculateProgress,
  handleDependentAnswers
} from '@/web/components/HomeInstructions/FormFields';
import GoodToKnowBox from '@/web/components/Global/GoodToKnowBox';
import SubCategoryFooterNav from '@/web/components/Global/SubCategoryFooterNav';
import SubCategoryTabs from '@/web/components/Global/SubCategoryTabs';
import SubCategoryTitle from '@/web/components/Global/SubCategoryTitle';
import SubCategoryHeader from '@/web/components/Global/SubCategoryHeader';

const OtherInstructions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fallback user info if not authenticated
  const userInfo = {
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Guest',
    email: user?.email || 'guest@example.com',
    avatar,
  };

  // Initialize questions from JSON data
  useEffect(() => {
    if (homeInstructionsData['103']) {
      setQuestions(homeInstructionsData['103'] as Question[]);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (values: Record<string, any>, { setSubmitting }: FormikHelpers<Record<string, any>>) => {
    try {
      console.log('Saving other instructions:', values);

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

      // Format data for API
      const userData = {
        userId: user.id, // Use actual user ID from auth context
        categoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
        originalCategoryId: '1', // Our manual category ID for Home Instructions
        subCategoryId: generateObjectId(), // Generate a valid MongoDB ObjectId
        originalSubCategoryId: '103', // Our manual subcategory ID for other instructions
        answersBySection: Object.entries(answersBySection).map(([sectionId, answers]) => ({
          originalSectionId: sectionId, // Store our original section ID
          isCompleted: true,
          answers
        }))
      };

      // Save to backend
      await userInputService.createUserInput(userData);

      setSubmitting(false);
      navigate('/category/homeinstructions/security');
    } catch (error) {
      console.error('Error saving other instructions:', error);
      setSubmitting(false);
      // Handle error (show error message, etc.)
    }
  };

  // If no questions loaded yet, return loading state
  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const validationSchema = buildValidationSchema(questions, Yup);
  const initialValues = generateInitialValues(questions);

  return (
    <div className="flex flex-col pt-20 min-h-screen">
      <AppHeader />
      <SubCategoryHeader
        title="Home Instructions"
        backTo="/dashboard"
        user={userInfo}
      />
      <SubCategoryTabs />
      <div className="container mx-auto px-6">
        <SubCategoryTitle
          category="Other"
          description="These files contain questions to help you record your details so they're easy to find later."
        />
      </div>

      {/* Main content */}
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
                  const progressStats = calculateProgress(questions, values);
                  const prevValuesRef = useRef<Record<string, any>>({});

                  // Watch for changes to parent questions and reset dependent questions
                  useEffect(() => {
                    // Only process if values have changed
                    if (JSON.stringify(prevValuesRef.current) !== JSON.stringify(values)) {
                      handleDependentAnswers(values, questions, setValues);
                      prevValuesRef.current = { ...values };
                    }
                  }, [values, setValues, questions]);

                  return (
                    <Form>
                      <div className="mt-4">
                        {questions
                          .sort((a, b) => a.order - b.order)
                          .map(question => (
                            <QuestionItem
                              key={question.id}
                              question={question}
                              values={values}
                            />
                          ))
                        }
                        <div className="mt-8 flex justify-end">
                          <Button
                            type="submit"
                            disabled={isSubmitting || !isValid || !dirty}
                            className="bg-[#1ccfc9] hover:bg-[#19bbb5]"
                          >
                            Save other information
                          </Button>
                        </div>
                        <GoodToKnowBox
                          title="Additional Home Information"
                          description="Please provide any other important information about your home that doesn't fit in the other categories."
                        />
                        <SubCategoryFooterNav
                          leftLabel="Trash"
                          leftTo="/category/homeinstructions/trash"
                          rightLabel="Security"
                          rightTo="/category/homeinstructions/security"
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

export default OtherInstructions;