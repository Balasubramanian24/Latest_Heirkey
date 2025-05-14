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

const SecurityInstructions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const navigate = useNavigate();
  
  const user = {
    name: 'Francis Nixon',
    email: 'fnixon35@hotmail.com',
  };

  // Initialize questions from JSON data
  useEffect(() => {
    if (homeInstructionsData['104']) {
      setQuestions(homeInstructionsData['104'] as Question[]);
    }
  }, []);

  // Handle form submission
  const handleSubmit = (values: Record<string, any>, { setSubmitting }: FormikHelpers<Record<string, any>>) => {
    console.log('Saving security instructions:', values);
    // Here you would save the data to your backend
    setSubmitting(false);
    navigate('/homeinstructions');
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
      
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-[#183153] to-[#1ccfc9] text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Home Instructions: Security</h1>
              <Link to="/dashboard" className="flex items-center text-sm hover:underline">
                <span className="mr-1">←</span> Back to Categories
              </Link>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-4">
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm opacity-80">{user.email}</div>
              </div>
              <Avatar className="rounded-full w-14 h-14 bg-white overflow-hidden">
                <img src={avatar} alt={user.name} className="w-full h-full object-cover" />
              </Avatar>
            </div>
          </div>
        </div>
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
                            Save security information
                          </Button>
                        </div>
                        <GoodToKnowBox
                          title="Home Security Details"
                          description="Please provide information about your home security system below. This will help your loved ones understand how to secure your home."
                        />
                        <SubCategoryFooterNav
                          leftLabel="Other"
                          leftTo="/category/homeinstructions/other"
                          rightLabel="Category Review"
                          rightTo="/category/homeinstructions/review"
                        />
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
          
          {/* Right column - Search panel */}
          <div>
            <SearchPanel />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SecurityInstructions; 