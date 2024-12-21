import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    getStudentsSuccess,
    detailsSuccess,
    getFailedTwo,
    getSubjectsSuccess,
    getSubDetailsSuccess,
    getSubDetailsRequest
} from './sclassSlice';

// Función para obtener el token desde localStorage
const getToken = () => localStorage.getItem('token');

export const getAllSclasses = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const token = getToken();
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/${address}List/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Agregando el token al encabezado
            },
        });
        if (result.data.message) {
            dispatch(getFailedTwo(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const getClassStudents = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const token = getToken();
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Sclass/Students/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Agregando el token al encabezado
            },
        });
        if (result.data.message) {
            dispatch(getFailedTwo(result.data.message));
        } else {
            dispatch(getStudentsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const getClassDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const token = getToken();
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Agregando el token al encabezado
            },
        });
        if (result.data) {
            dispatch(detailsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const getSubjectList = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const token = getToken();
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Agregando el token al encabezado
            },
        });
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSubjectsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const getTeacherFreeClassSubjects = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const token = getToken();
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FreeSubjectList/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Agregando el token al encabezado
            },
        });
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSubjectsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const getSubjectDetails = (id, address) => async (dispatch) => {
    dispatch(getSubDetailsRequest());

    try {
        const token = getToken();
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Agregando el token al encabezado
            },
        });
        if (result.data) {
            dispatch(getSubDetailsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};
