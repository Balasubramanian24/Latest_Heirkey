import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Question } from './FormFields';

interface ScrollToQuestionProps {
  questions: Question[];
  children: (refs: Record<string, HTMLDivElement | null>) => React.ReactNode;
}

/**
 * A utility component that handles scrolling to a specific question based on URL query parameters.
 *
 * Usage:
 * <ScrollToQuestion questions={questions}>
 *   {(refs) => (
 *     <>
 *       {questions.map(question => (
 *         <div key={question.id} ref={el => refs[question.id] = el}>
 *           <QuestionItem question={question} values={values} />
 *         </div>
 *       ))}
 *     </>
 *   )}
 * </ScrollToQuestion>
 */
const ScrollToQuestion = ({ questions = [], children }: ScrollToQuestionProps) => {
  const location = useLocation();
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Get the questionId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const targetQuestionId = queryParams.get('questionId');

  // Scroll to the target question when the component is fully loaded
  useEffect(() => {
    if (targetQuestionId && questionRefs.current[targetQuestionId]) {
      // Add a small delay to ensure the DOM is fully rendered
      setTimeout(() => {
        questionRefs.current[targetQuestionId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        // Add a highlight effect to the target question
        const element = questionRefs.current[targetQuestionId];
        if (element) {
          element.classList.add('bg-yellow-50');
          element.classList.add('transition-colors');
          element.classList.add('duration-1000');

          // Remove the highlight after a few seconds
          setTimeout(() => {
            element.classList.remove('bg-yellow-50');
          }, 3000);
        }
      }, 500);
    }
  }, [targetQuestionId, questions]);

  // Ensure we're passing a valid object even if questions is empty
  return children(questionRefs.current);
};

export default ScrollToQuestion;