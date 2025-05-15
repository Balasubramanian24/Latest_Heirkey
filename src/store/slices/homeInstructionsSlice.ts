import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import userInputService from '../../services/userInputService';
import homeInstructionsData from '../../data/homeIntsructions.json';

// Define types for our state
export interface SubCategory {
  id: string;
  title: string;
  questionsCount: number;
}

export interface Question {
  id: string;
  text: string;
  type: string;
  required: boolean;
  sectionId: string;
  order: number;
  options?: string[];
  dependsOn?: {
    questionId: string;
    value: string;
  };
  placeholder?: string;
  validationRules?: {
    minLength?: number;
    maxLength?: number;
  };
}

export interface Answer {
  index: number;
  questionId?: string;
  originalQuestionId: string;
  question: string;
  type: string;
  answer: string;
}

export interface SectionAnswers {
  originalSectionId: string;
  isCompleted: boolean;
  answers: Answer[];
}

export interface UserInput {
  userId: string;
  categoryId?: string;
  originalCategoryId: string;
  subCategoryId?: string;
  originalSubCategoryId: string;
  answersBySection: SectionAnswers[];
  _id?: string;
}

interface HomeInstructionsState {
  subcategories: SubCategory[];
  questions: Record<string, Question[]>;
  userInputs: UserInput[];
  loading: boolean;
  error: string | null;
  progressStats: {
    totalQuestions: number;
    answeredQuestions: number;
    completionPercentage: number;
  };
}

// Define initial state
const initialState: HomeInstructionsState = {
  subcategories: [
    { id: '101', title: 'Pets', questionsCount: (homeInstructionsData['101'] || []).length },
    { id: '102', title: 'Trash', questionsCount: (homeInstructionsData['102'] || []).length },
    { id: '103', title: 'Other', questionsCount: (homeInstructionsData['103'] || []).length },
    { id: '104', title: 'Security', questionsCount: (homeInstructionsData['104'] || []).length },
  ],
  questions: homeInstructionsData,
  userInputs: [],
  loading: false,
  error: null,
  progressStats: {
    totalQuestions: Object.values(homeInstructionsData).reduce(
      (sum, questions) => sum + questions.length, 0
    ),
    answeredQuestions: 0,
    completionPercentage: 0
  }
};

// Create async thunks
export const fetchUserInputs = createAsyncThunk<UserInput[], string>(
  'homeInstructions/fetchUserInputs',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await userInputService.getUserInputsByCategory(userId, '1'); // '1' is the category ID for Home Instructions
      return response as UserInput[];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user inputs';
      return rejectWithValue(errorMessage);
    }
  }
);

export const saveUserInput = createAsyncThunk<UserInput, Omit<UserInput, '_id'>>(
  'homeInstructions/saveUserInput',
  async (userData: Omit<UserInput, '_id'>, { rejectWithValue }) => {
    try {
      const response = await userInputService.saveUserInput(userData);
      return response as UserInput;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save user input';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUserInput = createAsyncThunk<
  UserInput,
  { id: string, userData: Omit<UserInput, '_id'> }
>(
  'homeInstructions/updateUserInput',
  async ({ id, userData }: { id: string, userData: Omit<UserInput, '_id'> }, { rejectWithValue }) => {
    try {
      const response = await userInputService.updateUserInput(id, userData);
      return response as UserInput;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user input';
      return rejectWithValue(errorMessage);
    }
  }
);

// Create slice
const homeInstructionsSlice = createSlice({
  name: 'homeInstructions',
  initialState,
  reducers: {
    updateProgressStats: (state) => {
      // Calculate total questions
      const totalQuestions = Object.values(state.questions).reduce(
        (sum, questions) => sum + questions.length, 0
      );

      // Calculate answered questions
      let answeredQuestions = 0;
      state.userInputs.forEach(userInput => {
        userInput.answersBySection.forEach(section => {
          answeredQuestions += section.answers.length;
        });
      });

      // Calculate completion percentage
      const completionPercentage = totalQuestions > 0
        ? Math.round((answeredQuestions / totalQuestions) * 100)
        : 0;

      state.progressStats = {
        totalQuestions,
        answeredQuestions,
        completionPercentage
      };
    },
  },
  extraReducers: (builder) => {
    // Handle fetchUserInputs
    builder.addCase(fetchUserInputs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserInputs.fulfilled, (state, action: PayloadAction<UserInput[]>) => {
      state.loading = false;
      state.userInputs = action.payload;
      // Update progress stats after fetching user inputs
      const totalQuestions = state.progressStats.totalQuestions;
      let answeredQuestions = 0;

      action.payload.forEach(userInput => {
        userInput.answersBySection.forEach(section => {
          answeredQuestions += section.answers.length;
        });
      });

      const completionPercentage = totalQuestions > 0
        ? Math.round((answeredQuestions / totalQuestions) * 100)
        : 0;

      state.progressStats = {
        totalQuestions,
        answeredQuestions,
        completionPercentage
      };
    });
    builder.addCase(fetchUserInputs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle saveUserInput
    builder.addCase(saveUserInput.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(saveUserInput.fulfilled, (state, action: PayloadAction<UserInput>) => {
      state.loading = false;
      state.userInputs.push(action.payload);
      // Update progress stats after saving
      state.progressStats.answeredQuestions += action.payload.answersBySection.reduce(
        (sum, section) => sum + section.answers.length, 0
      );
      state.progressStats.completionPercentage = state.progressStats.totalQuestions > 0
        ? Math.round((state.progressStats.answeredQuestions / state.progressStats.totalQuestions) * 100)
        : 0;
    });
    builder.addCase(saveUserInput.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle updateUserInput
    builder.addCase(updateUserInput.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUserInput.fulfilled, (state, action: PayloadAction<UserInput>) => {
      state.loading = false;
      const index = state.userInputs.findIndex(input => input._id === action.payload._id);
      if (index !== -1) {
        // Update existing user input
        state.userInputs[index] = action.payload;
      }
      // Recalculate progress stats
      state.progressStats.answeredQuestions = state.userInputs.reduce(
        (sum, input) => sum + input.answersBySection.reduce(
          (sectionSum, section) => sectionSum + section.answers.length, 0
        ), 0
      );
      state.progressStats.completionPercentage = state.progressStats.totalQuestions > 0
        ? Math.round((state.progressStats.answeredQuestions / state.progressStats.totalQuestions) * 100)
        : 0;
    });
    builder.addCase(updateUserInput.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { updateProgressStats } = homeInstructionsSlice.actions;

// Basic selectors
export const selectHomeInstructionsState = (state: { homeInstructions: HomeInstructionsState }) =>
  state.homeInstructions;

export const selectSubcategories = createSelector(
  [selectHomeInstructionsState],
  (homeInstructions) => homeInstructions.subcategories
);

export const selectQuestions = createSelector(
  [selectHomeInstructionsState],
  (homeInstructions) => homeInstructions.questions
);

export const selectUserInputs = createSelector(
  [selectHomeInstructionsState],
  (homeInstructions) => homeInstructions.userInputs
);

export const selectProgressStats = createSelector(
  [selectHomeInstructionsState],
  (homeInstructions) => homeInstructions.progressStats
);

export const selectLoading = createSelector(
  [selectHomeInstructionsState],
  (homeInstructions) => homeInstructions.loading
);

export const selectError = createSelector(
  [selectHomeInstructionsState],
  (homeInstructions) => homeInstructions.error
);

// Memoized selectors with parameters
export const selectSubcategoryById = (subcategoryId: string) =>
  createSelector(
    [selectSubcategories],
    (subcategories) => subcategories.find(subcategory => subcategory.id === subcategoryId)
  );

export const selectQuestionsBySubcategoryId = (subcategoryId: string) =>
  createSelector(
    [selectQuestions],
    (questions) => questions[subcategoryId] || []
  );

export const selectUserInputsBySubcategoryId = (subcategoryId: string) =>
  createSelector(
    [selectUserInputs],
    (userInputs) => userInputs.filter(input => input.originalSubCategoryId === subcategoryId)
  );

export default homeInstructionsSlice.reducer;
