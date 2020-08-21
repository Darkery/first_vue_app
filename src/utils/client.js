import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://10.47.221.106:8888/api',
    headers: ''
});

export default instance;