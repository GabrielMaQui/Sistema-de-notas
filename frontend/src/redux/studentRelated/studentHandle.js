import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    stuffDone
} from './studentSlice';

// Función para obtener el token desde localStorage
const getToken = () => localStorage.getItem('token');

export const getAllStudents = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const token = getToken();
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Students/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Agregando el token al encabezado
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

export const updateStudentFields = (id, fields, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const token = getToken();
        const result = await axios.put(
            `${process.env.REACT_APP_BASE_URL}/${address}/${id}`,
            fields,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Agregando el token al encabezado
                },
            }
        );
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(stuffDone());
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const removeStuff = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const token = getToken();
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`, null, {
            headers: {
                Authorization: `Bearer ${token}`, // Agregando el token al encabezado
            },
        });
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(stuffDone());
        }
    } catch (error) {
        dispatch(getError(error));
    }
};
