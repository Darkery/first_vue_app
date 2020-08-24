import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://10.236.96.27:8888/api',
    headers: ''
});

export default instance;