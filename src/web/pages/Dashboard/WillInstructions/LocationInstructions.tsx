import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/web/components/Layout/AppHeader';
import Footer from '@/web/components/Layout/Footer';
import SearchPanel from '@/web/pages/Global/SearchPanel';
import GoodToKnowBox from '@/web/components/Global/GoodToKnowBox';
import SubCategoryTabs from '@/web/components/Global/SubCategoryTabs';
import SubCategoryFooterNav from '@/web/components/Global/SubCategoryFooterNav';
import willInstructionsData from '@/data/willInstructions.json';
import {
  Question,
  QuestionItem,
  buildValidationSchema,
  generateInitialValues
} from '@/web/components/HomeInstructions/FormFields';

const LocationInstructions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const tabs = [
    { label: 'Location', path: '/category/willinstructions/location' },
    { label: 'Legal Representation', path: '/category/willinstructions/legal' }
  ];

  useEffect(() => {
    // Filter questions for Location (sectionId 105A and 105B)
    const allQuestions = willInstructionsData['105'] as Question[];
    setQuestions(allQuestions.filter(q => q.sectionId === '105A' || q.sectionId === '105B'));
  }, []);

  if (questions.length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col pt-20 min-h-screen">
      <AppHeader />
      <div className="bg-gradient-to-r from-[#183153] to-[#1ccfc9] text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">Will and Testament</h1>
            <span className="flex items-center text-sm">← Back Home</span>
          </div>
          <div className="text-right">
            <div className="font-semibold">{user?.firstName || user?.username || 'Guest'}</div>
            <div className="text-sm opacity-80">{user?.email || 'guest@example.com'}</div>
          </div>
        </div>
      </div>
      <SubCategoryTabs tabs={tabs} />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-[#183153] mb-2">Will & Testament: <span className="text-[#1ccfc9]">Location</span></h2>
              <p className="text-gray-600 mb-6">These fields contain questions to help you record your details so they're easy to find later.</p>
              <Formik
                initialValues={generateInitialValues(questions)}
                validationSchema={Yup.object(buildValidationSchema(questions, Yup))}
                onSubmit={(values) => {
                  // For now, just go to next page
                  navigate('/category/willinstructions/legal');
                }}
              >
                {({ values }) => (
                  <Form>
                    {questions.map((question) => (
                      <QuestionItem key={question.id} question={question} values={values} />
                    ))}
                    <GoodToKnowBox
                      title="Editing my Answers"
                      description="Each topic below is a part of your home documents, with questions to help you provide important information for you and your loved ones. Click any topic to answer the questions at your own pace—we'll save everything for you."
                    />
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