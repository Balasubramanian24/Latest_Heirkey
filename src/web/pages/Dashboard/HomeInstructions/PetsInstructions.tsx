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

const PetsInstructions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fallback user info if not authenticated
  const userInfo = {
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Guest',
    email: user?.email || 'guest@example.com',
  };

  useEffect(() => {
    if (homeInstructionsData['101']) {
      setQuestions(homeInstructionsData['101'] as Question[]);
    }
  }, []);

  const handleSubmit = (values: Record<string, any>, { setSubmitting }: FormikHelpers<Record<string, any>>) => {
    console.log('Saving pet instructions:', values);
    setSubmitting(false);
    navigate('/homeinstructions');
  };

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
                  const progressStats = calculateProgress(questions, values);
                  const prevValuesRef = useRef<Record<string, any>>({});
                  
                  
                  useEffect(() => {
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