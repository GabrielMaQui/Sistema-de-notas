import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    postDone,
    doneSuccess
} from './teacherSlice';

// Función para obtener el token desde localStorage
const getToken = () => localStorage.getItem('token');

export const getAllTeachers = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Teachers/${id}`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`, // Incluye el token
            },
        });
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const getTeacherDetails = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Teacher/${id}`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`, // Incluye el token
            },
        });
        if (result.data) {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const updateTeachSubject = (teacherId, teachSubject) => async (dispatch) => {
    dispatch(getRequest());

    try {
        await axios.put(`${process.env.REACT_APP_BASE_URL}/TeacherSubject`, { teacherId, teachSubject }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`, // Incluye el token
            },
        });
        dispatch(postDone());
    } catch (error) {
        dispatch(getError(error));
    }
};
