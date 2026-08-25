import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as taskService from '../services/taskService';

// The API sometimes returns the task wrapped in { task }, sometimes bare.
const unwrapTask = (payload) => payload?.task || payload;

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      return await taskService.getTasks();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      return await taskService.createTask(taskData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, ...taskData }, { rejectWithValue }) => {
    try {
      return await taskService.updateTask(id, taskData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleTaskStatus = createAsyncThunk(
  'tasks/toggleTaskStatus',
  async (id, { rejectWithValue }) => {
    try {
      return await taskService.toggleTaskStatus(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Keep the newest tasks on top regardless of what order the API returns.
const sortByNewest = (tasks) =>
  [...tasks].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );

const upsert = (state, updated) => {
  const index = state.tasks.findIndex((t) => t.id === updated.id);
  if (index !== -1) {
    state.tasks[index] = updated;
  }
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTasksError: (state) => {
      state.error = null;
    },
    clearTasks: (state) => {
      state.tasks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        const list = Array.isArray(action.payload)
          ? action.payload
          : action.payload.tasks || [];
        state.tasks = sortByNewest(list);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(unwrapTask(action.payload));
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        upsert(state, unwrapTask(action.payload));
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle + delete update optimistically-ish (no global spinner) so the
      // list feels responsive.
      .addCase(deleteTask.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(toggleTaskStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleTaskStatus.fulfilled, (state, action) => {
        upsert(state, unwrapTask(action.payload));
      })
      .addCase(toggleTaskStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearTasksError, clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
