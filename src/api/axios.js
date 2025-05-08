import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api-decameron-hotel.onrender.com/api',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

export default api;
