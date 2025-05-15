import { Question } from '@/mobile/components/HomeInstructions/FormFields';

/**
 * Helper function to cast questions from JSON to the correct Question type
 * This is needed because TypeScript doesn't know that the JSON data conforms to our Question interface
 */
export function castToQuestionType(questions: any[]): Question[] {
  return questions.map(q => ({
    ...q,
    type: q.type as 'boolean' | 'text' | 'choice'
  }));
}
