import React from 'react';
import { Field } from 'formik';


export interface Question {
  id: string;
  text: string;
  type: 'text' | 'choice' | 'boolean';
  required: boolean;
  sectionId: string;
  options?: string[];
  validationRules?: {
    maxLength?: number;
  };
  order: number;
  dependsOn?: {
    questionId: string;
    value: string;
  };
}

export const buildValidationSchema = (questions: Question[], Yup: any) => {
  const schema: Record<string, any> = {};
  
  questions.forEach(question => {
    let fieldSchema;
    
    switch (question.type) {
      case 'text':
        fieldSchema = Yup.string();
        break;
      case 'choice':
        fieldSchema = Yup.string();
        break;
      case 'boolean':
        fieldSchema = Yup.boolean();
        break;
      default:
        fieldSchema = Yup.string();
    }
    
    if (question.required) {
      fieldSchema = fieldSchema.required('This field is required');
    }
    
    if (question.type === 'text' && question.validationRules?.maxLength) {
      fieldSchema = fieldSchema.max(
        question.validationRules.maxLength,
        `Maximum ${question.validationRules.maxLength} characters allowed`
      );
    }
    
    schema[question.id] = fieldSchema;
  });
  
  return Yup.object().shape(schema);
};

export const generateInitialValues = (questions: Question[]) => {
  const values: Record<string, any> = {};
  questions.forEach(question => {
    values[question.id] = '';
  });
  return values;
};

export const calculateProgress = (questions: Question[], values: Record<string, any>) => {
  const totalQuestions = questions.length;
  const answeredQuestions = Object.values(values).filter(value => value !== '').length;
  const completionPercentage = Math.round((answeredQuestions / totalQuestions) * 100);
  
  return {
    totalQuestions,
    answeredQuestions,
    completionPercentage
  };
};

interface QuestionItemProps {
  question: Question;
  values: Record<string, any>;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({ question, values }) => {
  if (question.dependsOn) {
    const dependentValue = values[question.dependsOn.questionId];
    if (dependentValue !== question.dependsOn.value) {
      return null;
    }
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {question.text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {question.type === 'text' && (
        <Field
          as="textarea"
          name={question.id}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2BCFD5] focus:border-transparent"
          rows={3}
        />
      )}
      
      {question.type === 'choice' && question.options && (
        <div className="space-y-2">
          {question.options.map(option => (
            <label key={option} className="flex items-center space-x-2">
              <Field
                type="radio"
                name={question.id}
                value={option}
                className="h-4 w-4 text-[#2BCFD5]"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      )}
      
      {question.type === 'boolean' && (
        <div className="flex gap-2">
          {['Yes', 'No'].map(option => (
            <label
              key={option}
              className="flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer bg-gray-100 hover:bg-[#25b6bb] hover:text-white transition-colors duration-150"
            >
              <Field
                type="radio"
                name={question.id}
                value={option.toLowerCase()}
                className="hidden"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}; 