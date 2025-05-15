import { useField } from 'formik';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export interface BaseQuestion {
  id: string;
  text: string;
  type: string;
  required: boolean;
  sectionId: string;
  order: number;
  isAnswered?: boolean;
  answer?: any;
  dependsOn?: {
    questionId: string;
    value: string;
  };
}

export interface TextQuestion extends BaseQuestion {
  type: 'text';
  validationRules?: {
    minLength?: number;
    maxLength?: number;
  };
  placeholder?: string;
}

export interface NumberQuestion extends BaseQuestion {
  type: 'number';
  placeholder?: string;
}

export interface BooleanQuestion extends BaseQuestion {
  type: 'boolean';
}

export interface ChoiceQuestion extends BaseQuestion {
  type: 'choice';
  options: string[];
}

export interface TextareaQuestion extends BaseQuestion {
  type: 'textarea';
  placeholder?: string;
}

export type Question = TextQuestion | NumberQuestion | BooleanQuestion | ChoiceQuestion | TextareaQuestion;

// Custom form field components for Formik
export const TextareaField = ({ question }: { question: TextQuestion | TextareaQuestion }) => {
  const [field, meta, helpers] = useField(question.id);

  // Add a custom onChange handler to ensure the value is properly set
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    helpers.setValue(value);
    // Mark as touched to trigger validation
    helpers.setTouched(true);
  };

  return (
    <div className="mb-6">
      <Label className="block mb-2 font-medium" htmlFor={question.id}>
        {question.text} {question.required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id={question.id}
        placeholder={question.placeholder}
        {...field}
        onChange={handleChange}
        className={`w-full ${meta.touched && meta.error ? 'border-red-500' : ''}`}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const NumberField = ({ question }: { question: NumberQuestion }) => {
  const [field, meta] = useField(question.id);

  return (
    <div className="mb-6">
      <Label className="block mb-2 font-medium" htmlFor={question.id}>
        {question.text} {question.required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={question.id}
        type="tel"
        placeholder={question.placeholder}
        {...field}
        className={`w-full ${meta.touched && meta.error ? 'border-red-500' : ''}`}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const BooleanField = ({ question }: { question: BooleanQuestion }) => {
  const [field, meta, helpers] = useField(question.id);

  return (
    <div className="mb-6">
      <div className="flex flex-col">
        <Label className="font-medium mb-2" htmlFor={question.id}>
          {question.text} {question.required && <span className="text-red-500">*</span>}
        </Label>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => helpers.setValue('yes')}
            className={field.value === 'yes'
              ? 'bg-[#1ccfc9] hover:bg-[#19bbb5]'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => helpers.setValue('no')}
            className={field.value === 'no'
              ? 'bg-[#1ccfc9] hover:bg-[#19bbb5]'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
          >
            No
          </Button>
        </div>
        {meta.touched && meta.error ? (
          <div className="text-red-500 text-sm mt-1">{meta.error}</div>
        ) : null}
      </div>
    </div>
  );
};

export const ChoiceField = ({ question }: { question: ChoiceQuestion }) => {
  const [field, meta, helpers] = useField(question.id);

  return (
    <div className="mb-6">
      <Label className="block mb-2 font-medium">
        {question.text} {question.required && <span className="text-red-500">*</span>}
      </Label>
      <RadioGroup
        value={field.value || ''}
        onValueChange={(value) => helpers.setValue(value)}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
      >
        {question.options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`${question.id}-${option}`} />
            <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const ButtonChoiceField = ({ question }: { question: ChoiceQuestion }) => {
  const [field, meta, helpers] = useField(question.id);

  return (
    <div className="mb-6">
      <Label className="block mb-2 font-medium">
        {question.text} {question.required && <span className="text-red-500">*</span>}
      </Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {question.options.map((option) => (
          <Button
            key={option}
            type="button"
            onClick={() => helpers.setValue(option)}
            className={field.value === option
              ? 'bg-[#1ccfc9] hover:bg-[#19bbb5]'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
          >
            {option}
          </Button>
        ))}
      </div>
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

// Main component for rendering questions based on condition
export const QuestionItem = ({
  question,
  values
}: {
  question: Question;
  values: Record<string, any>;
}) => {
  // Check if this question should be shown based on dependencies
  const shouldShow = !question.dependsOn ||
    (values[question.dependsOn.questionId]?.toString().toLowerCase() === question.dependsOn.value.toLowerCase());

  // If question depends on something and condition is not met, render ghosted version
  const isGhosted = question.dependsOn &&
    values[question.dependsOn.questionId]?.toString().toLowerCase() !== question.dependsOn.value.toLowerCase();

  if (!shouldShow && isGhosted) {
    return (
      <div className="mb-6 opacity-50 pointer-events-none">
        {renderQuestion(question)}
      </div>
    );
  } else if (!shouldShow) {
    return null;
  }

  return renderQuestion(question);
};

const renderQuestion = (question: Question) => {
  switch (question.type) {
    case 'text':
      return <TextareaField question={question} />;
    case 'textarea':
      return <TextareaField question={question} />;
    case 'number':
      return <NumberField question={question as NumberQuestion} />;
    case 'boolean':
      return <BooleanField question={question as BooleanQuestion} />;
    case 'choice':
      return <ButtonChoiceField question={question as ChoiceQuestion} />;
    default:
      return null;
  }
};

// Utility functions for handling forms
export const buildValidationSchema = (questions: Question[], Yup: any) => {
  const schemaShape: Record<string, any> = {};

  questions.forEach(question => {
    if (question.required) {
      let fieldSchema;

      switch (question.type) {
        case 'text':
          fieldSchema = Yup.string().required('This field is required');
          if ((question as TextQuestion).validationRules?.minLength) {
            fieldSchema = fieldSchema.min(
              (question as TextQuestion).validationRules!.minLength!,
              `Must be at least ${(question as TextQuestion).validationRules!.minLength!} characters`
            );
          }
          if ((question as TextQuestion).validationRules?.maxLength) {
            fieldSchema = fieldSchema.max(
              (question as TextQuestion).validationRules!.maxLength!,
              `Must be at most ${(question as TextQuestion).validationRules!.maxLength!} characters`
            );
          }
          break;

        case 'number':
          fieldSchema = Yup.string().required('This field is required');
          break;

        case 'boolean':
          fieldSchema = Yup.string().required('This field is required');
          break;

        case 'choice':
          fieldSchema = Yup.string().required('Please select an option');
          break;

        default:
          fieldSchema = Yup.string();
      }

      // Only add validation if there's no dependency or if it depends on another question
      if (!question.dependsOn) {
        schemaShape[question.id] = fieldSchema;
      } else {
        // For conditional validation
        schemaShape[question.id] = Yup.string().when(question.dependsOn.questionId, {
          is: question.dependsOn.value,
          then: () => fieldSchema,
          otherwise: () => Yup.string().optional()
        });
      }
    }
  });

  return Yup.object().shape(schemaShape);
};

export const generateInitialValues = (questions: Question[]) => {
  const initialValues: Record<string, any> = {};

  questions.forEach(question => {
    initialValues[question.id] = '';

    // Set default values based on type
    if (question.type === 'boolean') {
      initialValues[question.id] = '';
    }
  });

  return initialValues;
};

// This function handles cleaning up answers when a parent question's value changes
export const handleDependentAnswers = (
  values: Record<string, any>,
  questions: Question[],
  setValues: (values: Record<string, any>) => void
) => {
  let needsUpdate = false;
  const newValues = { ...values };

  // Find questions that depend on the changed answer
  questions.forEach(question => {
    if (question.dependsOn) {
      const parentValue = values[question.dependsOn.questionId];
      const shouldClear = parentValue !== question.dependsOn.value && values[question.id] !== '';

      if (shouldClear) {
        // If the parent value doesn't match the required condition, clear the dependent answer
        newValues[question.id] = '';
        needsUpdate = true;
      }
    }
  });

  // Only call setValues if we actually made changes
  if (needsUpdate) {
    setValues(newValues);
  }
};

export const calculateProgress = (questions: Question[], values: Record<string, any>) => {
  const totalQuestions = questions.length;
  const answeredQuestions = Object.entries(values).filter(([id, value]) => {
    const question = questions.find(q => q.id === id);
    return question && value !== '' &&
      (!question.dependsOn || values[question.dependsOn.questionId] === question.dependsOn.value);
  }).length;

  const completionPercentage = totalQuestions > 0
    ? Math.round((answeredQuestions / totalQuestions) * 100)
    : 0;

  return {
    totalQuestions,
    answeredQuestions,
    completionPercentage
  };
};