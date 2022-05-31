import axios from 'axios'

const client = axios;


client.defaults.baseURL = "http://localhost:8081/api/v1";
// client.defaults.withCredentials = true;

export default client;