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
import SubCategoryHeader from '@/web/components/Global/SubCategoryHeader';
import avatar from '@/assets/global/defaultAvatar/defaultImage.jpg';
import SubCategoryTitle from '@/web/components/Global/SubCategoryTitle';

const LegalInstructions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const tabs = [
    { label: 'Location', path: '/category/willinstructions/location' },
    { label: 'Legal Representation', path: '/category/willinstructions/legal' }
  ];


  useEffect(() => {
    // Filter questions for Legal Representation (sectionId 105C)
    const allQuestions = willInstructionsData['105'] as Question[];
    setQuestions(allQuestions.filter(q => q.sectionId === '105C'));
  }, []);

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
          category="Legal Representation"
          description="These files contain questions to help you record your details so they're easy to find later."
        />
      </div>
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Formik
                initialValues={generateInitialValues(questions)}
                validationSchema={Yup.object(buildValidationSchema(questions, Yup))}
                onSubmit={(values) => {
                  // For now, just go back to dashboard
                  navigate('/dashboard');
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
                      leftLabel="Location"
                      leftTo="/category/willinstructions/location"
                      rightLabel="Review"
                      rightTo="/category/willinstructions/review"
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

export default LegalInstructions; 