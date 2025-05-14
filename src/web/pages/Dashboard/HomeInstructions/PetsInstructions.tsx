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
import SubCategoryTabs from '@/web/components/Global/SubCategoryTabs';
import SubCategoryTitle from '@/web/components/Global/SubCategoryTitle';

const PetsInstructions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const navigate = useNavigate();
  
  const user = {
    name: 'Francis Nixon',
    email: 'fnixon35@hotmail.com',
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
      {/* Gradient Header */}
      <div className="w-full bg-gradient-to-r from-[#183153] to-[#1ccfc9] py-7 px-0 mb-0">
        <div className="container mx-auto flex items-center justify-between px-6">
          <div>
            <div className="text-3xl font-bold text-white mb-1">Home Instructions</div>
            <div>
              <Link to="/dashboard" className="text-white text-base opacity-90 hover:underline flex items-center">
                <span className="mr-1">←</span> Back Home
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-semibold text-white">{user.name}</div>
              <div className="text-sm text-white opacity-80">{user.email}</div>
            </div>
            <Avatar className="rounded-full w-16 h-16 bg-white overflow-hidden border-4 border-white shadow-md">
              <img src={avatar} alt={user.name} className="w-full h-full object-cover" />
            </Avatar>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <SubCategoryTabs />
      {/* Title & Description */}
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