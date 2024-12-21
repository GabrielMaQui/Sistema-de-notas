import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError
} from './noticeSlice';

// Función para obtener el token desde localStorage
const getToken = () => localStorage.getItem('token');

export const getAllNotices = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const token = getToken();
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/${address}List/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
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
