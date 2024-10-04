import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user.slices.js';
import categoryReducer from './slices/category.slices.js';
import blogReducer from './slices/blog.slices.js';
const store = configureStore({
    reducer: {
        userSlice: userReducer,
        categorySlice: categoryReducer,
        blogSlice: blogReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
