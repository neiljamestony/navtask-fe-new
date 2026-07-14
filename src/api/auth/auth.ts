import axios from "axios"
import type { IAuth } from "../../typescript/interface";

const env = import.meta.env.VITE_NODE_ENV;
console.log(env, 'env')
const apiUrl = env === "local" ? import.meta.env.VITE_API_URL : import.meta.env.VITE_PROD_API_URL;


export const registration = async (formData: IAuth) => {
    try {
        const result = await axios.post(`${apiUrl}/auth/register`, formData);
        return result.data;
    } catch (error: any) {
        const message = error instanceof Error ? error.message : error;
        return { msg: message };
    }
}

export const login = async (formData: IAuth) => {
    try {
        const result = await axios.post(`${apiUrl}/auth/login`, formData, {
            withCredentials: true
        });
        return result.data;
    } catch (error: any) {
        const message = error instanceof Error ? error.message : error;
        return { msg: message };
    }
}

export const isAuthenticated = async () => {
    try{
        const result = await axios.get(`${apiUrl}/auth/hasAccess`,
            { withCredentials: true }
        );
        return result.data;
    }catch(error: any){
        const message = error instanceof Error ? error.message : error;
        return { msg: message };
    }
}

export const getUserData = async () => {
    try{
        const result = await axios.get(`${apiUrl}/auth/getUserData`,
            { withCredentials: true }
        );
        return result.data;
    }catch(error: any){
        const message = error instanceof Error ? error.message : error;
        return { msg: message };
    }
}

export const logout = async () => {
    try{
        const result = await axios.post(`${apiUrl}/auth/logout`, {}, {
            withCredentials: true
        });
        return result.data;
    }catch(error: any){
        const message = error instanceof Error ? error.message : error;
        return { msg: message };
    }
}