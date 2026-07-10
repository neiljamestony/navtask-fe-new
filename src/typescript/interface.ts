import type { Dayjs } from 'dayjs';

export type IAuth = {
    username: string,
    password: string
}

export type IGetTask = {
    userId: string;
    token: string;
}

export type ITask = {
    id?: number,
    completed_date?: null | string;
    created_at?: string;
    description?: string;
    userId?: number;
    token?: string;
    priority: string;
    status: string;
    title?: string;
    due_date?: Dayjs | string;
    attachments: File[] | [];
    subTasks: SubTask[] | []
}

export type SubTask = {
    title: string;
    status: string;
}
export type OriginalFileItem = File[] | [] | null;
export type AttachmentItem = IFile | null;

export interface IFile extends File {
    id?: number;
    url?: string;
    name: string;
    size: number;
    type: string;
    file_name?: string;
}

export type UTask = {
    completed_date: null | string;
    created_at: string;
    description: string;
    due_date: Dayjs | string;
    id: number;
    priority: string;
    status: string;
    title: string;
    attachmentId: number[] | [];
    user_id: number;
    attachments: IFile[] | [];
    subtasks: SubTask[] | []
}