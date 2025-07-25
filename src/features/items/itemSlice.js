import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axiosConfig';

const initialState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
  uploadingImage: false,
  imageUploadError: null,
};

// Async Thunks
export const fetchItems = createAsyncThunk(
  'item/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/items');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch items');
    }
  }
);

export const fetchItemById = createAsyncThunk(
  'item/fetchItemById',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/items/${itemId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch item details');
    }
  }
);

export const reportItem = createAsyncThunk(
  'item/reportItem',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await API.post('/items', itemData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to report item');
    }
  }
);

export const updateItem = createAsyncThunk(
  'item/updateItem',
  async ({ id, itemData }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/items/${id}`, itemData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update item');
    }
  }
);

export const deleteItem = createAsyncThunk(
  'item/deleteItem',
  async (itemId, { rejectWithValue }) => {
    try {
      await API.delete(`/items/${itemId}`);
      return itemId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete item');
    }
  }
);

export const uploadItemImage = createAsyncThunk(
  'item/uploadItemImage',
  async ({ itemId, imageUrl }, { rejectWithValue }) => {
    try {
      // Backend expects 'image_url' in the body
      const response = await API.post('/images', { item_id: itemId, image_url: imageUrl });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to upload image');
    }
  }
);

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    clearItemError: (state) => {
      state.error = null;
    },
    clearImageUploadError: (state) => {
      state.imageUploadError = null;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Items
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Item By ID
      .addCase(fetchItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedItem = null;
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedItem = null;
      })
      // Report Item
      .addCase(reportItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reportItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload); // Add new item to list
      })
      .addCase(reportItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Item
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        );
        if (state.selectedItem && state.selectedItem.id === action.payload.id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Item
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload Item Image
      .addCase(uploadItemImage.pending, (state) => {
        state.uploadingImage = true;
        state.imageUploadError = null;
      })
      .addCase(uploadItemImage.fulfilled, (state, action) => {
        state.uploadingImage = false;
        // Optionally update the item in the list or selected item with the new image
        state.items = state.items.map(item =>
          item.id === action.payload.item_id
            ? { ...item, images: [...(item.images || []), action.payload] }
            : item
        );
        if (state.selectedItem && state.selectedItem.id === action.payload.item_id) {
          state.selectedItem.images = [...(state.selectedItem.images || []), action.payload];
        }
      })
      .addCase(uploadItemImage.rejected, (state, action) => {
        state.uploadingImage = false;
        state.imageUploadError = action.payload;
      });
  },
});

export const { clearItemError, clearImageUploadError, setSelectedItem } = itemSlice.actions;

export const selectItem = (state) => state.item;

export default itemSlice.reducer;