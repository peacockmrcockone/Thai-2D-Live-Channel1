import axios from 'axios';

const apiClient = axios.create({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VUE_APP_API_KEY}` // Use env variable
    },
    withCredentials: false
});

export default apiClient;