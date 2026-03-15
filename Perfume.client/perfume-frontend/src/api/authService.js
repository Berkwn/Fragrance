import api from './axios.config';


export const login = async (Email,Password) => 
    {

        const response = await api.post('Auth/Login', {Email,Password});
        console.log(response.data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;


    }

    export const register = async (Username,Email,Password) => 
    { 
        const response = await api.post('Auth/register', {Username,Email,Password});
        return response.data;
        console.log(response.data);
    }