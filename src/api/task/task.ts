import axios from 'axios'
import type { ITask, UTask } from '../../typescript/interface';
import dayjs from 'dayjs';

const env = import.meta.env.VITE_NODE_ENV;
const apiUrl = env === "local" ? import.meta.env.VITE_API_URL : import.meta.env.VITE_PROD_API_URL;

export const getTasks = async () => {
    const body = {}
    try{
        const result = await axios.post(`${apiUrl}/task/getAll`,
            body,
            {
                withCredentials: true
            }
        );
        return result.data;
    }catch (error: any) {
        const message = error instanceof Error ? error.message : error;
        return { msg: message, status: 500 };
    }
}

export const getTask = async (id: string) => {
    try{
        const result = await axios.post(`${apiUrl}/task/getOne`, 
            { id },
            {
                withCredentials: true
            }
        );
        return result.data;
    }catch (error: any) {
        const message = error instanceof Error ? error.message : error;
        return { msg: message, status: 500 };
    }
}

export const createTask = async (request: ITask) => {
    try{
        const formData = new FormData();
        formData.append("description", request.description || "")
        formData.append("title", request.title || "")
        formData.append("status", request.status || "not-started")
        formData.append("priority", request.priority || "low")
        if (request.due_date) {
            const formattedDate = typeof request.due_date === 'function' 
                ? dayjs(request.due_date).format("MM/DD/YYYY") 
                : String(request.due_date);
            formData.append("due_date", formattedDate);
            } else {
                formData.append("due_date", "");
            }
        formData.append("subTask", JSON.stringify(request.subTask || []))
        for (const customFile of request.attachments) {
            formData.append("attachments", customFile, customFile.name);
        }
        
        const result = await axios.post(`${apiUrl}/task/create`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            withCredentials: true
        });
        return result.data;
    }catch(error: any){
        const message = error instanceof Error ? error.message : error;
        return { msg: message, status: 500 };
    }
}

export const updateTask = async (request: UTask) => {
    try{
        const formData = new FormData();
        const existingFiles: {
            file_name: string,
            id: number,
            name: string,
            size: number,
            type: string,
            url: string,
        }[] = [];
        const newFiles = [];
        formData.append("attachmentId", JSON.stringify(request.attachmentId || []))
        formData.append("id", String(request.id || 0))
        formData.append("user_id", String(request.id || 0))
        formData.append("description", request.description || "")
        formData.append("title", request.title || "")
        formData.append("status", request.status || "not-started")
        formData.append("priority", request.priority || "low")
        formData.append("completed_date", request.completed_date || "")
        if (request.due_date) {
            const formattedDate = typeof request.due_date === 'function' 
                ? dayjs(request.due_date).format("MM/DD/YYYY") 
                : String(request.due_date);
            formData.append("due_date", formattedDate);
        } else {
            formData.append("due_date", "");
        }
        if (request.created_at) {
            const formattedDate = typeof request.created_at === 'function' 
                ? dayjs(request.created_at).format("MM/DD/YYYY") 
                : String(request.created_at);
            formData.append("created_at", formattedDate);
        } else {
            formData.append("created_at", "");
        }
        formData.append("subtask", JSON.stringify(request.subtask || []))
        for (const customFile of request.attachments) {
            if(customFile instanceof Blob){
                newFiles.push(customFile)
            }else{
                existingFiles.push(customFile)
            }
        }
        newFiles.forEach((file) => {
            formData.append("attachments", file, file.name);
        })
        formData.append("existingAttachments", JSON.stringify(existingFiles));
        const result = await axios.post(`${apiUrl}/task/update`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            withCredentials: true
        });
        return result.data;
    }catch(error: any){
        const message = error instanceof Error ? error.message : error;
        return { msg: message, status: 500 };
    }
}

export const removeTask = async (ids: string[] | []) => {
    try{
        const result = await axios.post(`${apiUrl}/task/remove`, {ids}, {
            withCredentials: true
        });
        return result.data;
    }catch(error: any){
        const message = error instanceof Error ? error.message : error;
        return { msg: message, status: 500 };
    }
}