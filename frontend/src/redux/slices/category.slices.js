import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { categoryApis } from '../../api';

// Thunk actions
const get8BlogCategories = createAsyncThunk('category/top8blog', async (body, ThunkAPI) => {
    try {
        const response = await categoryApis.get8BlogCategories;
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});

const createCategory = createAsyncThunk('category/create', async (body, ThunkAPI) => {
    try {
        const response = await categoryApis.createCategory(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});

const editCategory = createAsyncThunk('category/edit', async (body, ThunkAPI) => {
    try {
        const response = await categoryApis.editCategory(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});

const deleteCategory = createAsyncThunk('category/delete', async (body, ThunkAPI) => {
    try {
        const response = await categoryApis.deleteCategory(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});

const getCategory = createAsyncThunk('category/get', async (body, ThunkAPI) => {
    try {
        const response = await categoryApis.getCategory(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});

const getCategoriesWithPagination = createAsyncThunk('category/all', async (body, ThunkAPI) => {
    try {
        const response = await categoryApis.getCategoriesWithPagination(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const getCategories = createAsyncThunk('category/full', async (body, ThunkAPI) => {
    try {
        const response = await categoryApis.getCategories();
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
// Initial state
const initialState = {
    categories: [],
    category: {
        category_id: 0,
        title: '',
        url_image: '',
        description: '',
    },
    totalPage: 0,
    totalRecord: 0,
    isLoading: false,
    isGetLoading: false,
};

// Slice
const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategory: (state, action) => {
            state.category = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(get8BlogCategories.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(get8BlogCategories.fulfilled, (state, action) => {
            state.categories = action.payload.data;
            state.isGetLoading = false;
        });
        builder.addCase(get8BlogCategories.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(createCategory.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createCategory.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(createCategory.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getCategoriesWithPagination.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getCategoriesWithPagination.fulfilled, (state, action) => {
            state.categories = action.payload.data?.data;
            state.totalPage = action.payload.data.total_page;
            state.totalRecord = action.payload.data.total_record;
            state.isGetLoading = false;
        });
        builder.addCase(getCategoriesWithPagination.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(deleteCategory.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteCategory.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteCategory.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getCategory.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getCategory.fulfilled, (state, action) => {
            state.category = action.payload.data;
            state.isGetLoading = false;
        });
        builder.addCase(getCategory.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(editCategory.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(editCategory.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(editCategory.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getCategories.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.categories = action.payload.data;
            state.isGetLoading = false;
        });
        builder.addCase(getCategories.rejected, (state) => {
            state.isGetLoading = false;
        });
    },
});

const { setCategory } = categorySlice.actions;
categorySlice.reducer;
export {
    get8BlogCategories,
    createCategory,
    editCategory,
    deleteCategory,
    getCategory,
    getCategoriesWithPagination,
    setCategory,
    getCategories,
};
export default categorySlice.reducer;
