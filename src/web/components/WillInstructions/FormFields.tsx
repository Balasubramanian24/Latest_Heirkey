import { useField } from 'formik';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Define question interfaces
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

export interface TextareaQuestion extends BaseQuestion {
  type: 'textarea';
  validationRules?: {
    minLength?: number;
    maxLength?: number;
  };
  placeholder?: string;
}

export interface NumberQuestion extends BaseQuestion {
  type: 'number';
  validationRules?: {
    min?: number;
    max?: number;
  };
  placeholder?: string;
}

export interface BooleanQuestion extends BaseQuestion {
  type: 'boolean';
  options?: string[];
}

export interface ChoiceQuestion extends BaseQuestion {
  type: 'choice';
  options?: string[];
}

export type Question = TextQuestion | NumberQuestion | BooleanQuestion | ChoiceQuestion | TextareaQuestion;

// Custom form field components for Formik
export const TextareaField = ({ question }: { question: TextQuestion | TextareaQuestion }) => {
  const [field, meta] = useField(question.id);

  return (
    <div className="mb-6">
      <Label className="block mb-2 font-medium" htmlFor={question.id}>
        {question.text} {question.required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id={question.id}
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

  // Default options for boolean questions if not provided
  const options = question.options || ['yes', 'no'];

  // Use a simpler approach with direct buttons instead of RadioGroup
  return (
    <div className="mb-6">
      <Label className="block mb-2 font-medium">
        {question.text} {question.required && <span className="text-red-500">*</span>}
      </Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {options.map((option) => (
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

export const ButtonChoiceField = ({ question }: { question: ChoiceQuestion }) => {
  const [field, meta, helpers] = useField(question.id);

  // Default options for choice questions if not provided
  const options = question.options || ['yes', 'no'];

  return (
    <div className="mb-6">
      <Label className="block mb-2 font-medium">
        {question.text} {question.required && <span className="text-red-500">*</span>}
      </Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {options.map((option) => (
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

// Conditional question rendering
export const QuestionItem = ({
  question,
  formValues,
  isGhosted = false,
  onChange
}: {
  question: Question;
  formValues: Record<string, any>;
  isGhosted?: boolean;
  onChange?: (value: string) => void;
}) => {
  // Check if this question depends on another question's answer
  const shouldShow = !question.dependsOn ||
    (formValues[question.dependsOn.questionId] === question.dependsOn.value);

  if (!shouldShow && isGhosted) {
    return (
      <div className="mb-6 opacity-50 pointer-events-none">
        {renderQuestion(question, onChange)}
      </div>
    );
  } else if (!shouldShow) {
    return null;
  }

  return renderQuestion(question, onChange);
};

const renderQuestion = (question: Question, onChange?: (value: string) => void) => {
  // If onChange is provided, we need to wrap the field components to handle the change
  if (onChange) {
    switch (question.type) {
      case 'text':
      case 'textarea':
        return <TextFieldWithOnChange question={question} onChange={onChange} />;
      case 'number':
        return <NumberFieldWithOnChange question={question as NumberQuestion} onChange={onChange} />;
      case 'boolean':
        return <BooleanFieldWithOnChange question={question as BooleanQuestion} onChange={onChange} />;
      case 'choice':
        return <ChoiceFieldWithOnChange question={question as ChoiceQuestion} onChange={onChange} />;
      default:
        return null;
    }
  } else {
    // Original behavior without onChange
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
  }
};

// Wrapper components that include onChange handling
const TextFieldWithOnChange = ({ question, onChange }: { question: TextQuestion | TextareaQuestion, onChange: (value: string) => void }) => {
  const [field, meta, helpers] = useField(question.id);

  return (
    <div className="mb-6">
      <Label className="block mb-2 font-medium" htmlFor={question.id}>
        {question.text} {question.required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id={question.id}
        placeholder={question.placeholder}
        {...field}
        onChange={(e) => {
          field.onChange(e);
          onChange(e.target.value);
        }}
        className={`w-full ${meta.touched && meta.error ? 'border-red-500' : ''}`}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

const NumberFieldWithOnChange = ({ question, onChange }: { question: NumberQuestion, onChange: (value: string) => void }) => {
  const [field, meta, helpers] = useField(question.id);

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
        onChange={(e) => {
          field.onChange(e);
          onChange(e.target.value);
        }}
        className={`w-full ${meta.touched && meta.error ? 'border-red-500' : ''}`}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

const BooleanFieldWithOnChange = ({ question, onChange }: { question: BooleanQuestion, onChange: (value: string) => void }) => {
  const [field, meta, helpers] = useField(question.id);

  // Default options for boolean questions if not provided
  const options = question.options || ['yes', 'no'];

  return (
    <div className="mb-6">
      <Label className="block mb-2 font-medium">
        {question.text} {question.required && <span className="text-red-500">*</span>}
      </Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            onClick={() => {
              helpers.setValue(option);
              onChange(option);
            }}
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

const ChoiceFieldWithOnChange = ({ question, onChange }: { question: ChoiceQuestion, onChange: (value: string) => void }) => {
  const [field, meta, helpers] = useField(question.id);

  // Default options for choice questions if not provided
  const options = question.options || ['yes', 'no'];

  return (
    <div className="mb-6">
      <Label className="block mb-2 font-medium">
        {question.text} {question.required && <span className="text-red-500">*</span>}
      </Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            onClick={() => {
              helpers.setValue(option);
              onChange(option);
            }}
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

// Fixed validation schema builder for WillInstructions
export const buildValidationSchema = (questions: Question[], Yup: any) => {
  const schemaShape: Record<string, any> = {};

  questions.forEach(question => {
    if (question.required) {
      let fieldSchema;

      switch (question.type) {
        case 'text':
        case 'textarea':
          fieldSchema = Yup.string().required('This field is required');
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
        // For conditional validation, use a different approach that doesn't use .when()
        // This avoids the "field.resolve is not a function" error
        schemaShape[question.id] = Yup.string().test({
          name: 'conditionalRequired',
          test: function(value: any) {
            const dependsOnValue = this.parent[question.dependsOn!.questionId];
            if (dependsOnValue === question.dependsOn!.value) {
              return value !== undefined && value !== '' || this.createError({
                message: 'This field is required'
              });
            }
            return true;
          }
        });
      }
    }
  });

  return schemaShape;
};

// Helper function to generate initial form values
export const generateInitialValues = (questions: Question[]): Record<string, any> => {
  const initialValues: Record<string, any> = {};

  questions.forEach(question => {
    // Set appropriate default values based on question type
    if (question.type === 'boolean') {
      initialValues[question.id] = ''; // Empty string allows validation to work properly
    } else {
      initialValues[question.id] = '';
    }
  });

  return initialValues;
};

// Helper function to handle dependent answers
export const handleDependentAnswers = (
  values: Record<string, any>,
  questions: any[]
): Record<string, any> => {
  const result = { ...values };

  questions.forEach(question => {
    if (question.dependsOn) {
      const dependsOnQuestion = questions.find(q => q.id === question.dependsOn?.questionId);

      if (dependsOnQuestion && values[dependsOnQuestion.id] !== question.dependsOn.value) {
        // Clear the value if the dependency condition is not met
        result[question.id] = '';
      }
    }
  });

  return result;
};
