import api from './api';

// Helper function to check if a string is a valid MongoDB ObjectId
// const isValidObjectId = (id: string): boolean => {
//   return /^[0-9a-fA-F]{24}$/.test(id);
// };

interface Answer {
  index: number;
  questionId: string; // MongoDB ObjectId
  originalQuestionId: string; // Our manual ID (q1, q2, etc.)
  question: string;
  type: string;
  answer: string;
}

interface SectionAnswers {
  sectionId: string; // MongoDB ObjectId
  originalSectionId: string; // Our manual section ID (101A, 101B, etc.)
  isCompleted: boolean;
  answers: Answer[];
}

interface UserInputData {
  userId: string; // MongoDB ObjectId
  categoryId: string; // MongoDB ObjectId
  subCategoryId: string; // MongoDB ObjectId
  originalSubCategoryId: string; // Our manual subcategory ID (101, 102, etc.)
  answersBySection: SectionAnswers[];
}

const userInputService = {
  // Create a new user input
  createUserInput: async (data: UserInputData) => {
    const response = await api.post('/user-inputs', data);
    return response.data;
  },

  // Get user input by ID
  getUserInput: async (id: string) => {
    const response = await api.get(`/user-inputs/${id}`);
    return response.data;
  },

  // Get user inputs by user ID and category ID
  getUserInputsByUserAndCategory: async (userId: string, categoryId: string) => {
    const response = await api.get('/user-inputs', {
      params: { userId, categoryId }
    });
    return response.data;
  },

  // Update user input
  updateUserInput: async (id: string, data: Partial<UserInputData>) => {
    const response = await api.patch(`/user-inputs/${id}`, data);
    return response.data;
  }
};

export default userInputService;
