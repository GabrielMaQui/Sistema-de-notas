import axios from 'axios';
import {
    authRequest,
    stuffAdded,
    authSuccess,
    authFailed,
    authError,
    authLogout,
    doneSuccess,
    getDeleteSuccess,
    getRequest,
    getFailed,
    getError,
} from './userSlice';

// Helper to get the token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Login User
export const loginUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {

        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/${role}Login`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });


        if (result.data.user.role) {
            localStorage.setItem('token', result.data.response.token);
            dispatch(authSuccess(result.data.user));
        } else {
            dispatch(authFailed(result.data.message));
        }
    } catch (error) {
        dispatch(authError(error));
    }
};

// Register User
export const registerUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/${role}Reg`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.schoolName) {
            dispatch(authSuccess(result.data));
        } else if (result.data.school) {
            dispatch(stuffAdded());
        } else {
            dispatch(authFailed(result.data.message));
        }
    } catch (error) {
        dispatch(authError(error));
    }
};

// Logout User
export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('token'); // Remove token on logout
    localStorage.removeItem('profile');
    dispatch(authLogout());
};

// Get User Details
export const getUserDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const token = getAuthToken();
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (result.data) {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

// Delete User
export const deleteUser = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    dispatch(getFailed("Sorry, the delete function has been disabled for now."));
};

// Update User
export const updateUser = (fields, id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const token = getAuthToken();
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`, fields, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (result.data.schoolName) {
            dispatch(authSuccess(result.data));
        } else {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

// Add Stuff
export const addStuff = (fields, address) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const token = getAuthToken();
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/${address}Create`, fields, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (result.data.message) {
            dispatch(authFailed(result.data.message));
        } else {
            dispatch(stuffAdded(result.data));
        }
    } catch (error) {
        dispatch(authError(error));
    }
};
