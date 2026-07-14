import React, { useState, useRef, Fragment, useEffect } from 'react';
import { Box, Typography, Paper, Button, TextField, LinearProgress, MenuItem, Grid, Container, Divider, CircularProgress, IconButton } from '@mui/material'
import { ArrowBackIosNewRounded, Add } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';
import FilePreview from './FilePreview';
import UploadIcon from '../../assets/Icons/Upload.svg';
import type { ITask } from '../../typescript/interface';
import { createTask } from '../../api/task/task';
import toast from 'react-hot-toast';
import { limitText, validFileTypes } from '../../utils/utils';

import { useDropzone } from 'react-dropzone'

import DeleteIcon from '../../assets/Icons/Delete_active.svg'

dayjs.extend(customParseFormat);
export default function NewTaskDesktop() {
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [fileError, setFileError] = useState<{error: boolean, msg: string} | null>(null)
    const navigate = useNavigate();
    const [errors, setErrors] = useState<{key: string, error: string}[] | []>([]);
    const [uploading, setUploadingStatus] = useState(false)
    const [progress, setProgress] = React.useState(0);
    const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([])
    const [task, setTask] = useState<ITask>({
        priority: "high",
        status: "not-started",
        title: "Task 1",
        due_date: "",
        description: "",
        attachments: [],
        subTask: []
    })

    const {getRootProps, getInputProps} = useDropzone({
        multiple: true,
        maxFiles: 5,
        accept: validFileTypes,
        disabled: uploading,
        onDrop: (acceptedFiles: File[], fileRejections) => {
            setUploadingStatus(true)
            if (fileRejections.length > 0) {
                const rejectedNames = fileRejections.map(rejection => rejection.file.name).join(", ");
                setFileError({
                    msg: `Upload failed: Invalid file type. (${rejectedNames})`,
                    error: true
                });
                setUploadedFileNames([]);
                setUploadingStatus(false);
                return;
            }
            const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
            const oversizedFiles = acceptedFiles.filter(file => file.size > MAX_FILE_SIZE);
            const validFiles = acceptedFiles.filter(file => file.size <= MAX_FILE_SIZE);
            const fileNames = acceptedFiles.map(file => limitText(file.name));
            setUploadedFileNames(fileNames);

            if (oversizedFiles.length > 0) {
                const overSizedFiles = oversizedFiles.map((file) => file.name).join(" ");
                setFileError({
                    msg: `Upload failed: Individual files cannot exceed 10MB. (${overSizedFiles} is too large)`,
                    error: true
                });
                
                setUploadedFileNames([]);
                setUploadingStatus(false)
                return;
            }

            setTask((prevAtt) => {
                const updatedAttachments = [...(prevAtt.attachments ?? []), ...validFiles];

                if (updatedAttachments.length > 5) {
                    setFileError({
                        msg: "Upload failed: Maximum of 5 attachments only.",
                        error: true
                    });
                    setUploadingStatus(false)
                    return prevAtt; 
                }else{
                    setFileError(null);
                
                    return {
                        ...prevAtt,
                        attachments: updatedAttachments
                    };
                }
            })
        }
    })

    const priorities = [
        {
            value: "high",
            label: "High"
        },
        {
            value: "critical",
            label: "Critical"
        },
        {
            value: "low",
            label: "Low"
        }
    ]
    
    const status = [
        {
            value: "not-started",
            label: "Not Started"
        },
        {
            value: "in-progress",
            label: "In Progress"
        },
        {
            value: "completed",
            label: "Completed"
        },
        {
            value: "cancelled",
            label: "Cancelled"
        },
    ]

    const subTasksDropdown = [
        {
            value: "not-done",
            label: "Not Done"
        },
        {
            value: "done",
            label: "Done"
        },
    ]
    
    const handleBrowsFileClick = () => {
        inputRef.current?.click();
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTask((prev) => ({...prev, [name]: value}))
    }

    const handleSubmit = async () => {
        setLoading(true);
        const hasEmptySubtask = task.subTask.some((item) => item.title.trim() === "");
        if(hasEmptySubtask){
            setLoading(false);
        }else{
            const result = await createTask(task);
            if(result?.status === 200){
                setErrors([])
                setLoading(false);
                navigate("/");
            }else if(result?.status === 422){
                if(result?.errors){
                    setErrors(result?.errors);
                }else{
                    toast.error(result?.msg);
                }
                setLoading(false);
            }else if(result.status === 401){
                toast.error("Session expired, please login again.");
                navigate("/login")
            }else if(result?.status === 500){
                toast.error("Something went wrong, please try again later.");
                setLoading(false);
            }
        }
    }

    const handleDueDateChange = (newValue: dayjs.Dayjs | null) => {
        setTask((prev) => ({
            ...prev,
            due_date: dayjs(newValue).format("MM/DD/YYYY")
        }))
    }

    const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>, key: number) => {
        e.stopPropagation(); 
        setTask((prev) => ({ ...prev, attachments: [...prev.attachments.filter((_,currentKey) => currentKey !== key)] }))
    }

    const handleNewSubTask = () => {
        const subTaskNumber = task.subTask.length + 1;
        setTask((prev) => ({
            ...prev,
            subTask: [...prev.subTask, { title: "Subtask" + " " + subTaskNumber, status: "not-done" }]
        }))
    }

    const handleSubTaskChange = (index: number, field: string, value: string) => {
        setTask((prev) => ({
            ...prev,
            subTask: prev.subTask.map((item, i) => i === index ? {...item, [field]: value} : item)
        }))
    }

    const handleRemoveSubTask = (key: number) => {
        const newSubTasks = task.subTask.filter((_, index) => index !== key);
        setTask((prev) => ({
            ...prev,
            subTask: newSubTasks
        }))
    }

    useEffect(() => {
        let timer: any = "";
        if (uploading) {
            timer = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress === 100) {
                        setUploadingStatus(false);
                        return 100;
                    }
                    const diff = Math.random() * 10;
                    return Math.min(oldProgress + diff, 100);
                });
            }, 500);
        } else {
            setProgress(0);
            setUploadingStatus(false);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [uploading]);

    return (
        <Box sx={{ padding: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "start", alignItems: 'center', gap: 2 }}>
                <Button type="button" onClick={() => navigate("/")} startIcon={<ArrowBackIosNewRounded/>}>
                    <Typography sx={{ fontFamily: "Roboto", fontWeight: 'bold', textTransform: 'none' }}>Back</Typography>
                </Button>
                <Typography sx={{ fontFamily: "Roboto", fontWeight: 'bold' }}>New Task</Typography>
            </Box>
            <Paper variant="outlined" sx={{ 
                height: 750, 
                border: 'none', 
                borderRadius: 4,
                overflowY: task?.subTask.length > 0 || task.attachments !== null ? 'scroll' : 'none', 
                paddingBottom: task?.subTask.length > 0 ? 5 : 0
            }}>
                <Container maxWidth="md" sx={{ paddingTop: 5 }}>
                    <Grid container spacing={2}>
                        <Grid size={3}>
                            <TextField
                                select
                                label="Priority"
                                defaultValue={task.priority}
                                fullWidth
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTask((prev) => ({...prev, priority: e.target.value}))}
                                >
                                {priorities.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={3}>
                            <TextField
                                select
                                label="Status"
                                fullWidth
                                error={task.status === "completed" || task.status === "cancelled"}
                                helperText={task.status === "completed" || task.status === "cancelled" ? "Invalid status value" : ""}
                                defaultValue={task.status}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTask((prev) => ({...prev, status: e.target.value}))}
                                >
                                {status.map((option) => (
                                    <MenuItem key={option.value} value={option.value} disabled={option.value === "completed" || option.value === "cancelled"}>
                                    {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Title"
                                name="title"
                                value={task.title}
                                multiline
                                slotProps={{
                                    htmlInput: { 
                                        maxLength: 25 
                                    }
                                }} 
                                sx={{  
                                    '& .MuiInputBase-root': {
                                        fontSize: '20px',
                                        fontWeight: 'bold'
                                    },
                                    '& .MuiInputLabel-root.Mui-error': {
                                        color: '#CA0061', 
                                    },
                                    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#CA0061',
                                    },
                                    '& .MuiFormHelperText-root.Mui-error': {
                                        color: '#CA0061',
                                    },
                                }}
                                rows={4}
                                required
                                fullWidth
                                error={errors.length > 0 && errors.filter((error) => error.key === "title").length > 0 } 
                                helperText={errors.length > 0 && errors.filter((error) => error.key === "title").length > 0 ? errors.filter((error) => error.key === "title")[0].error : ""}
                                onChange={handleTextChange}
                            />
                        </Grid>
                        <Grid size={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Date Created"
                                    value={dayjs(new Date())}
                                    disabled
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid size={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Due Date"
                                    value={dayjs(task.due_date)}
                                    onChange={handleDueDateChange}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: errors.length > 0 && errors.filter((error) => error.key === "due_date").length > 0,
                                            helperText: errors.length > 0 && errors.filter((error) => error.key === "due_date").length > 0 ? errors.filter((error) => error.key === "due_date")[0].error : "",
                                            sx: {
                                                '& .MuiInputBase-input': {
                                                    color: errors.length > 0 && errors.filter((error) => error.key === "due_date").length > 0 ? '#CA0061' : '#000000', 
                                                },
                                                '& .MuiInputLabel-root.Mui-error': {
                                                    color: '#CA0061',
                                                },
                                                '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#CA0061',
                                                },
                                                '& .MuiFormHelperText-root.Mui-error': {
                                                    color: '#CA0061',
                                                },
                                            },
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Details(Optional)"
                                name="description"
                                multiline
                                sx={{
                                    '& .MuiInputLabel-root.Mui-error': {
                                        color: '#CA0061', 
                                    },
                                    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#CA0061',
                                    },
                                    '& .MuiFormHelperText-root.Mui-error': {
                                        color: '#CA0061',
                                    },
                                }}
                                slotProps={{
                                    htmlInput: { maxLength: 300 }
                                }}
                                error={errors.length > 0 && errors.filter((error) => error.key === "description").length > 0 } 
                                helperText={errors.length > 0 && errors.filter((error) => error.key === "description").length > 0 ? errors.filter((error) => error.key === "description")[0].error : ""}
                                value={task.description}
                                rows={4}
                                fullWidth
                                onChange={handleTextChange}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Box {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Box sx={{ 
                                    position: "relative", 
                                    minHeight: 100, 
                                    height: "auto", 
                                    width: "100%", 
                                    border: "2px", 
                                    borderStyle: 'dashed', 
                                    borderRadius: 2, 
                                    borderColor: fileError ? '#CA0061' : 'grey.300', 
                                }}>
                                    <Box sx={{ display: "flex", justifyContent: "center"}}>
                                        <Box sx={{
                                            position: "absolute",
                                            top: -10,
                                            left: 12,
                                            backgroundColor: "#fff",
                                            px: 1,
                                            fontSize: 12,
                                            fontFamily: "Roboto",
                                            fontWeight: "bold",
                                            color: fileError ? "#CA0061" : "text.secondary"
                                        }}>Attachments</Box>
                                        {
                                            uploading ? (
                                            <Box sx={{ marginTop: 3, width: "50%", minHeight: "10vh", textAlign: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                                                    <Typography sx={{ fontSize: 14, marginBottom: 1 }}>{uploadedFileNames.toString()}</Typography>
                                                </Box>
                                                <LinearProgress variant="determinate" value={progress} aria-label="Export data"/>
                                            </Box>
                                            ):(
                                                <Box sx={{ display: "flex", justifyContent:"center", alignItems: "center", paddingTop: task.attachments.length > 0 ? 2 : 4 }}>
                                                <Box><img src={UploadIcon} alt="upload-icon" height={30} width="100%"/></Box>
                                                <Box sx={{ fontFamily: "Roboto", fontSize: 14, color: fileError ? "#CA0061" : "#272D32" }}> 
                                                    Drop files to attach, or 
                                                    <span style={{ color: fileError ? "#CA0061" : "#027CEC", cursor: "pointer" }} onClick={handleBrowsFileClick}> browse</span>.
                                                </Box>
                                            </Box>
                                            )
                                        }
                                    </Box>
                                    {
                                        !uploading && <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start", alignItems: "center", paddingLeft: 3, paddingBottom: 2, gap: 2 }}>
                                            {
                                                task.attachments && task.attachments.map((file, key) => (
                                                    <FilePreview file={file} removeFile={(e: React.MouseEvent<HTMLButtonElement>) => handleRemoveFile(e, key)} key={key}/>
                                                ))
                                            }
                                        </Box>
                                    }
                                    
                                </Box>
                            </Box>
                            {fileError !== null && <Box sx={{ color: '#CA0061', fontSize: 14, marginTop: 1, fontWeight: 'bold' }}>{fileError.msg}</Box>}
                        </Grid>
                        <Grid size={12}>
                            <Divider/>
                        </Grid>
                        <Grid size={12}>
                            <Box sx={{ display: "flex", justifyContent: "space-between"}}>
                                <Typography sx={{ fontFamily: "Roboto", fontSize: 16, fontWeight: 'bold' }}>Subtask</Typography>
                                <Button color="primary" type="button" variant="outlined" sx={{ textTransform: "none", backgroundColor: '#fff', borderRadius: 6 }} startIcon={<Add/>} disabled={task.subTask.length === 10} onClick={handleNewSubTask}>New Subtask</Button>
                            </Box>
                        </Grid>
                        {
                            task.subTask.length > 0 && (
                                <>
                                    <Grid size={8}>
                                        <Typography variant="body2" sx={{ color: 'grey.600' }}>Title</Typography>
                                    </Grid>
                                    <Grid size={4}>
                                        <Typography variant="body2" sx={{ color: 'grey.600' }}>Status</Typography>
                                    </Grid>
                                    {task.subTask.map((subTask, key) => (
                                        <Fragment key={key}>
                                            <Grid size={8}>
                                                <TextField 
                                                type="text" 
                                                label="Title" 
                                                value={subTask.title} 
                                                id="subtask-title"
                                                error={!subTask.title.trim()}
                                                helperText={!subTask.title.trim() && "Must not be empty"}
                                                sx={{
                                                    '& .MuiInputLabel-root.Mui-error': {
                                                        color: '#CA0061',
                                                    },
                                                    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#CA0061',
                                                    },
                                                    '& .MuiFormHelperText-root.Mui-error': {
                                                        color: '#CA0061',
                                                    },
                                                }}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSubTaskChange(key, "title", e.target.value)} fullWidth/>
                                            </Grid>
                                            <Grid size={3}>
                                                <TextField
                                                    select
                                                    label="Status"
                                                    value={subTask.status}
                                                    fullWidth
                                                    defaultValue="Not Done"
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSubTaskChange(key, "status", e.target.value)}
                                                    >
                                                    {subTasksDropdown.map((option, key) => (
                                                        <MenuItem key={key} value={option.value}>
                                                        {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid size={1}>
                                                <IconButton size="medium" sx={{ top: 10 }} onClick={() => handleRemoveSubTask(key)}><img src={DeleteIcon} alt="delete-icon" height={20} width="100%"/></IconButton>
                                            </Grid>
                                        </Fragment>
                                    ))}
                                </>
                            )
                        }
                        
                    </Grid>
                </Container>
            </Paper>
            <Box sx={{ 
                display: "flex",
                justifyContent: "flex-end", 
                bottom: 5,
                right: 0,
                p: 4,
                gap: 2,
                position: "fixed"
            }}>
                <Button type="button" onClick={() => navigate("/")} variant="outlined" sx={{ backgroundColor: '#fff', borderRadius: 6, textTransform: 'none'}} disabled={loading}>Cancel</Button>
                <Button type="button" variant="contained" color="primary" sx={{ fontFamily: "Roboto", fontWeight: 'bold', textTransform: 'none', borderRadius: 6 }} onClick={handleSubmit} disabled={loading}>{loading ? <CircularProgress size={30} color="inherit"/> : "Save"}</Button>
            </Box>
        </Box>
    )
}