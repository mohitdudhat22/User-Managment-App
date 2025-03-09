import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userService } from '../../services/userService';

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  contact?: string;
  gender?: string;
  postcode?: string;
  hobbies?: string[];
}

interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  totalItems: number;
  filters: {
    search: string;
    role: string;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  
  selectedUserIds: number[];
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  totalItems: 0,
  filters: {
    search: '',
    role: '',
    page: 1,
    limit: 10,
    sortBy: 'firstname',
    sortOrder: 'asc',
  },
  selectedUserIds: [],
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { users } = getState() as { users: UserState };
      const { filters } = users;
      const response = await userService.getUsers(filters);
      console.log(response);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await userService.getUserById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await userService.createUser(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: number; userData: any }, { rejectWithValue }) => {
    try {
      const response = await userService.updateUser(id, userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const deleteMultipleUsers = createAsyncThunk(
  'users/deleteMultipleUsers',
  async (ids: number[], { rejectWithValue }) => {
    try {
      await userService.deleteMultipleUsers(ids);
      return ids;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete users');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<UserState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    toggleUserSelection: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.selectedUserIds.includes(id)) {
        state.selectedUserIds = state.selectedUserIds.filter(userId => userId !== id);
      } else {
        state.selectedUserIds.push(id);
      }
    },
    clearSelectedUsers: (state) => {
      state.selectedUserIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        // Check if the response has a nested data structure
        if (action.payload.users) {
          state.users = action.payload.users;
          state.totalItems = action.payload.pagination?.total || 0;
        } else {
          // Fallback to the previous structure
          state.users = action.payload.data || [];
          state.totalItems = action.payload.total || 0;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch user by id
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create user
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false;
      })
      // Update user
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      // Delete multiple users
      .addCase(deleteMultipleUsers.fulfilled, (state, action) => {
        state.loading = false;
        const deletedIds = action.payload;
        state.users = state.users.filter(user => !deletedIds.includes(user.id));
        state.selectedUserIds = [];
      });
  },
});

export const { setSelectedUser, setFilters, toggleUserSelection, clearSelectedUsers } = userSlice.actions;
export default userSlice.reducer; 