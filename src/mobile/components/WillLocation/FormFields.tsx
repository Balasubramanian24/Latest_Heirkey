import React from 'react';
import { Field } from 'formik';

export interface Question {
  id: string;
  text: string;
  type: string;
  required: boolean;
  sectionId: string;
  order: number;
  dependsOn?: {
    questionId: string;
    value: string;
  };
  placeholder?: string;
  [key: string]: any;
}

export const buildInitialValues = (questions: Question[]) =>
  questions.reduce((acc, q) => ({ ...acc, [q.id]: "" }), {});

export const validate = (questions: Question[]) => (values: Record<string, string>) => {
  const errors: Record<string, string> = {};
  questions.forEach(q => {
    // Only validate if the question is visible
    if (isQuestionVisible(q, values) && q.required && !values[q.id]) {
      errors[q.id] = "Required";
    }
  });
  return errors;
};

export function isQuestionVisible(q: Question, values: Record<string, string>) {
  if (!q.dependsOn) return true;

  // For Legal section questions that depend on Location section questions
  // If the dependency is from another section and not in the current values,
  // we'll assume it's visible for now (we'll handle this better in the component)
  if (q.sectionId === "105C" && q.dependsOn.questionId === "w1" && values[q.dependsOn.questionId] === undefined) {
    return true;
  }

  return values[q.dependsOn.questionId] === q.dependsOn.value;
}

interface QuestionItemProps {
  question: Question;
  values: Record<string, any>;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({ question, values }) => {
  // Check if this question depends on another question's answer
  if (question.dependsOn) {
    // Special case for Legal section questions that depend on Location section questions
    if (question.sectionId === "105C" && question.dependsOn.questionId === "w1" && values[question.dependsOn.questionId] === undefined) {
      // For Legal section, if we don't have the w1 value, we'll show the question
      // This allows the Legal page to work independently
    } else {
      const dependentValue = values[question.dependsOn.questionId];
      if (dependentValue !== question.dependsOn.value) {
        return null;
      }
    }
  }

  return (
    <div className="mb-6">
      <label className="block font-medium text-gray-700 mb-2">
        {question.text}{question.required && " *"}
      </label>

      {question.type === "boolean" ? (
        <div className="flex space-x-4">
          <label className={`flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer bg-gray-50 hover:bg-[#25b6bb] hover:text-white ${values[question.id] === 'yes' ? 'bg-[#2BCFD5] text-white' : ''}`}>
            <Field type="radio" name={question.id} value="yes" className="hidden" />
            Yes
          </label>
          <label className={`flex-1 py-2 px-4 border rounded-xl text-center cursor-pointer bg-gray-50 hover:bg-[#25b6bb] hover:text-white ${values[question.id] === 'no' ? 'bg-[#2BCFD5] text-white' : ''}`}>
            <Field type="radio" name={question.id} value="no" className="hidden" />
            No
          </label>
        </div>
      ) : (
        <Field
          name={question.id}
          as={question.type === "text" ? "textarea" : "input"}
          type={question.type === "number" ? "number" : "text"}
          className="w-full border rounded-lg px-3 py-2"
          rows={question.type === "text" ? 3 : undefined}
          placeholder={question.placeholder || ""}
        />
      )}
    </div>
  );
};
