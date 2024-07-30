// src/api/axiosInstance.js
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const useAxiosInstance = () => {
    const navigate = useNavigate();
    const [cookies] = useCookies(['jwt']);

    const instance = axios.create({
        baseURL: '/api', // API 기본 URL 설정
        headers: {
            Authorization: `Bearer ${cookies.jwt}`,
        },
    });

    // 요청 인터셉터 설정
    instance.interceptors.request.use(
        config => {
            const token = cookies.jwt;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        error => Promise.reject(error)
    );

    // 응답 인터셉터 설정
    instance.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 403) {
                navigate('/login');
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export default useAxiosInstance;
