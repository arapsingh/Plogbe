import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userApis } from '../../api/index.js';
import Cookies from 'js-cookie';
import { AppDispatch } from '../store.ts';
// import { useDispatch } from 'react-redux';
const initialState = {
    users: [],
    currentUser: {
        email: '',
        first_name: '',
        last_name: '',
        user_id: undefined,
        url_avatar: '',
        description: '',
        is_admin: false,
    },
    user: {
        email: '',
        first_name: '',
        last_name: '',
        user_id: undefined,
        url_avatar: '',
        description: '',
        is_admin: false,
    },
    isLogin: false,
    isLoading: false,
    isGetLoading: false,
    error: '',
    success: '',
};
const login = createAsyncThunk('user/login', async (values, { rejectWithValue }) => {
    try {
        const response = await userApis.login(values);
        console.log("API response:", response);    // Kiểm tra dữ liệu API trả về
        return response.data;  // Trả về dữ liệu nếu thành công
    } catch (error) {
        return rejectWithValue(error.data);  // Xử lý lỗi và trả về reject
    }
});

const signup = createAsyncThunk('user/signup', async (body, ThunkAPI) => {
    try {
        const response = await userApis.registerUser(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const forgotPassword = createAsyncThunk('user/forgot-password', async (body, ThunkAPI) => {
    try {
        const response = await userApis.forgotPassword(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const resetPassword = createAsyncThunk('user/reset-password', async (body, ThunkAPI) => {
    try {
        const response = await userApis.resetPassword(body);
        return response.data;
    } catch (error) {
        console.log("Error response:", error.data); // Log nội dung error.response
        return ThunkAPI.rejectWithValue(error.data);
    }
});
// export const changePassword = createAsyncThunk(
//     "auth/password",
//     async (body, ThunkAPI) => {
//         try {
//             const response = await apis.userApis.changePassword(body);
//             return response.data;
//         } catch (error) {
//             return ThunkAPI.rejectWithValue(error.data);
//         }
//     },
// );
const verifyEmail = createAsyncThunk('user/verify', async (body, ThunkAPI) => {
    try {
        const response = await userApis.verifyEmail(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const resendVerifyEmail = createAsyncThunk('user/mail/verify', async (body, ThunkAPI) => {
    try {
        const response = await userApis.resendVerifyEmail(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const resendForgotPasswordEmail = createAsyncThunk('user/mail/forgot', async (body, ThunkAPI) => {
    try {
        const response = await userApis.resendForgotPasswordEmail(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const getProfile = createAsyncThunk('user/profile', async (body, ThunkAPI) => {
    try {
        const response = await userApis.getProfile();
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const changeAvatar = createAsyncThunk('user/avatar', async (formData, ThunkAPI) => {
    try {
        // Không cần tạo FormData ở đây, vì đã được thực hiện trong hàm changeAvatar
        const response = await userApis.changeAvatar(formData);

        // Kiểm tra xem response có tồn tại không
        if (response) {
            return response.data;
        } else {
            // Nếu response là undefined, reject với giá trị lỗi tương ứng
            return ThunkAPI.rejectWithValue({
                status_code: 500,
                data: null,
                success: false,
                message: 'Undefined',
            });
        }
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const updateProfile = createAsyncThunk('user/update-profile', async (body, ThunkAPI) => {
    try {
        const response = await userApis.updateProfile(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const getAllUsersWithPagination = createAsyncThunk(
    "user/all",
    async (body, ThunkAPI) => {
        try {
            const response = await userApis.getAllUsersWithPagination(body);
            return response.data;
        } catch (error) {
            return ThunkAPI.rejectWithValue(error.data);
        }
    },
);
const createNewUser = createAsyncThunk(
    "user/create",
    async (body, ThunkAPI) => {
        try {
            const response = await userApis.createNewUser(body);
            return response.data ;
        } catch (error) {
            return ThunkAPI.rejectWithValue(error.data);
        }
    },
);
const editUser = createAsyncThunk(
    "user/edit",
    async (body, ThunkAPI) => {
        try {
            const response = await userApis.editUser(body);
            return response.data;
        } catch (error) {
            return ThunkAPI.rejectWithValue(error.data);
        }
    },
);
const getUserById = createAsyncThunk(
    "user/getUser",
    async (body, ThunkAPI) => {
        try {
            const response = await userApis.getUserById(body);
            return response.data;
        } catch (error) {
            return ThunkAPI.rejectWithValue(error.data);
        }
    },
);
const deleteUser = createAsyncThunk(
    "user/delete",
    async (body, ThunkAPI) => {
        try {
            const response = await userApis.deleteUser(body);
            return response.data;
        } catch (error) {
            return ThunkAPI.rejectWithValue(error.data);
        }
    },
);
const activeUser = createAsyncThunk(
    "user/active",
    async (body, ThunkAPI) => {
        try {
            const response = await userApis.activeUser(body);
            return response.data ;
        } catch (error) {
            return ThunkAPI.rejectWithValue(error.data);
        }
    },
);
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.currentUser.description = action.payload.description;
            state.currentUser.email = action.payload.email;
            state.currentUser.first_name = action.payload.first_name;
            state.currentUser.last_name = action.payload.last_name;
            state.currentUser.user_id = action.payload.user_id;
            state.currentUser.url_avatar = action.payload.url_avatar;
            state.currentUser.is_admin = action.payload.is_admin;
            state.isLogin = true;
        },
        setLogout: (state) => {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            state.isLogin = false;
        },
        setEmail: (state, action) => {
            state.currentUser.email = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(signup.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(signup.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(signup.rejected, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(forgotPassword.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(forgotPassword.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(forgotPassword.rejected, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(resetPassword.pending, (state) => {
            state.error = '';
            state.success = '';
            state.isLoading = true;
        });
        builder.addCase(resetPassword.fulfilled, (state, action) => {
            state.success = action.payload?.message;
            state.isLoading = false;
        });
        builder.addCase(resetPassword.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.message ;
        });
        builder.addCase(login.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            Cookies.set('accessToken', action.payload.data?.accessToken);
            Cookies.set('refreshToken', action.payload.data?.refreshToken);
            state.isLoading = false;
        });
        builder.addCase(login.rejected, (state) => {
            state.isLoading = false;
        });

        builder.addCase(verifyEmail.pending, (state) => {
            state.error = '';
            state.success = '';
            state.isLoading = true;
        });
        builder.addCase(verifyEmail.fulfilled, (state, action) => {
            state.success = action.payload.message;
            state.isLoading = false;
        });
        builder.addCase(verifyEmail.rejected, (state, action) => {
            state.error = action.payload?.message || 'Failed';
            state.isLoading = false;
        });
        builder.addCase(resendForgotPasswordEmail.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(resendForgotPasswordEmail.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(resendForgotPasswordEmail.rejected, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(resendVerifyEmail.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(resendVerifyEmail.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(resendVerifyEmail.rejected, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(getProfile.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getProfile.fulfilled, (state, action) => {
            state.isGetLoading = false;
            state.user = action.payload.data;
        });
        builder.addCase(getProfile.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(changeAvatar.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(changeAvatar.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(changeAvatar.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(updateProfile.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateProfile.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(updateProfile.rejected, (state) => {
            state.isLoading = false;
        });

        builder.addCase(getAllUsersWithPagination.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getAllUsersWithPagination.fulfilled, (state, action) => {
            state.users = action.payload.data?.data ;
            state.totalPage = action.payload.data.total_page;
            state.totalRecord = action.payload.data.total_record;
            state.isGetLoading = false;
        });
        builder.addCase(getAllUsersWithPagination.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(createNewUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createNewUser.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(createNewUser.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(deleteUser.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(activeUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(activeUser.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(activeUser.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(editUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(editUser.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(editUser.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getUserById.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getUserById.fulfilled, (state, action) => {
            state.isGetLoading = false;
            state.user = action.payload.data;
        });
        builder.addCase(getUserById.rejected, (state) => {
            state.isGetLoading = false;
        });
    },
});

const { setUser, setLogout, setEmail } = userSlice.actions;

// userSlice.reducer;

const getMe = () => async (dispatch: AppDispatch) => {
    try {
        const response = await userApis.getMe();
        if (response.data.status_code >= 200 && response.data.status_code <= 299) {
            dispatch(setUser(response.data.data));
            console.log(response.data.data);
            return response.data.data;
        } else {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            window.location.href = '/login';
        }
    } catch (error) {
        /* empty */
    }
};
const logout = () => async (dispatch: AppDispatch) => {
    try {
        // Dispatch actions trực tiếp từ store.dispatch
        dispatch(
            setUser({
                url_avatar: '',
                first_name: '',
                last_name: '',
                email: '',
                user_id: undefined,
                description: '',
                is_admin: false,
            })
        );
        dispatch(setLogout());
    } catch (error) {
        console.log(error);
    }
};
const refreshToken = async () => {
    try {
        const response = await userApis.refreshAccessToken();

        if (response) {
            if (response.status >= 200 && response.status <= 299) {
                Cookies.set('accessToken', response.data.data.accessToken);
            } else {
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                window.location.href = '/login';
            }
        }
    } catch (error) {
        /* empty */
    }
};
export {
    login,
    signup,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerifyEmail,
    resendForgotPasswordEmail,
    getProfile,
    changeAvatar,
    updateProfile,
    getMe,
    logout,
    refreshToken,
    setUser,
    setLogout,
    setEmail,
    createNewUser,
    editUser,
    deleteUser,
    activeUser,
    getAllUsersWithPagination,
    getUserById,
};
userSlice.reducer;
export default userSlice.reducer;
