import React from 'react';

interface GoodToKnowBoxProps {
  title: string;
  description: string;
  className?: string;
}

const GoodToKnowBox: React.FC<GoodToKnowBoxProps> = ({ title, description, className }) => (
  <div className={`mb-6 bg-gray-100 p-4 rounded-lg shadow-md pt-4 mt-8 ${className || ''}`}>
    <h2 className="text-xl font-semibold text-[#183153] mb-2">
      Good to Know: <span className="text-purple-600">Editing my Answers</span>
    </h2>
    <p className="text-gray-600 mb-6">Each topic below is a part of your home documents, with questions to help you provide important information for you and your loved ones. Click any topic to answer the questions at your own pace—we’ll save everything for you.</p>
  </div>
);

export default GoodToKnowBox; 