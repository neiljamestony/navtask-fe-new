import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Button, TextField, MenuItem, Grid, LinearProgress, Container, Divider, CircularProgress, IconButton, Stack } from '@mui/material'
import { ArrowBackIosNewRounded, Add } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';
import UploadIcon from '../../assets/Icons/Upload.svg';
import { updateTask } from '../../api/task/task';
import toast from 'react-hot-toast';
import { getTask } from '../../api/task/task';
import type { UTask } from '../../typescript/interface';
import { useDropzone } from 'react-dropzone'
import EditFilePreview from './EditFilePreview';
import DeleteIcon from '../../assets/Icons/Delete_active.svg'
import DeleteSubTaskDesktop from '../Todo/DeleteSubTaskDesktop';
import { validFileTypes } from '../../utils/utils';

dayjs.extend(customParseFormat);

export default function EditTaskDesktop() {
    const { id } = useParams();
    const [task, setTask] = useState<UTask>({
        completed_date: null,
        created_at: "",
        description: "",
        due_date: "",
        id: 0,
        priority: "",
        status: "",
        title: "",
        attachmentId: [],
        user_id: 0,
        attachments: [],
        subtask: []
    })
    const [loading, setLoading] = useState(false);
    const [fetchingTask, setFetchingTask] = useState(false);
    const [fileError, setFileError] = useState<{error: boolean, msg: string} | null>(null);
    const [subtasksCompleted, setSubTasksCompleted] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [uploading, setUploadingStatus] = useState(false)
    const [progress, setProgress] = React.useState(0);
    const [errors, setErrors] = useState<{key: string, error: string}[] | []>([]);
    const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([])
    const [openDeleteSubtask, setOpenDeleteSubtask] = useState(false);
    const [subTaskToDelete, setSubtaskToDelete] = useState({
        name: "",
        key: 0
    })
    const navigate = useNavigate();

    const priorities = [
        {
            value: "high",
            label: "High",
            active: true
        },
        {
            value: "critical",
            label: "Critical",
            active: true
        },
        {
            value: "low",
            label: "Low",
            active: true
        }
    ]
    
    const status = [
        {
            value: "not-started",
            label: "Not Started",
            active: true
        },
        {
            value: "in-progress",
            label: "In Progress",
            active: true
        },
        {
            value: "completed",
            label: "Completed",
            active: task.status === "completed" && !subtasksCompleted
        },
        {
            value: "cancelled",
            label: "Cancelled",
            active: true
        },
    ]

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
            const fileNames = acceptedFiles.map(file => file.name);
            setUploadedFileNames(fileNames)

            if(!uploading){
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
                        const trimmedAttachments = updatedAttachments.slice(0, 5);
                        setFileError({
                            msg: "Upload failed: Maximum of 5 attachments only.",
                            error: true
                        });
                        setUploadingStatus(false)
                        return {
                            ...prevAtt,
                            attachments: trimmedAttachments
                        };
                    }else{
                        setFileError(null);
                    
                        return {
                            ...prevAtt,
                            attachments: updatedAttachments
                        };
                    }
                })
            }
        }
    })

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

    const handleSubmit = async () => {
        setLoading(true);
        const hasEmptySubtask = task.subtask.some((item) => item.title.trim() === "");
        if(hasEmptySubtask){
            setLoading(false);
        }else{
            const result = await updateTask(task)
            if(result?.status === 200){
                setLoading(false);
                navigate("/");
            }else if(result.status === 401){
                toast.error("Session expired, please login again.");
                navigate("/login")
            }else if(result?.status === 422){
                if(result?.errors){
                    setErrors(result?.errors);
                }else{
                    toast.error(result?.msg);
                }
                setLoading(false);
            }else if(result?.status === 500){
                toast.error("Something went wrong, please try again later.");
                setLoading(false);
            }else{
                toast.error(result?.msg);
                setLoading(false);
            }
        }
    }

    const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>, key: Number) => {
        e.stopPropagation();
        setTask((prev) => ({ ...prev, attachments: [...prev.attachments.filter((_,currentKey) => currentKey !== key)] }))
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTask((prev) => ({...prev, [name]: value}))
        
    }

    const handleNewSubTask = () => {
        const subTaskNumber = task.subtask.length + 1;
        setTask((prev) => ({
            ...prev,
            subtask: [...prev.subtask, { title: "Subtask" + " " + subTaskNumber , status: "not-done" }]
        }))
    }

    const fetch = async () => {
        setFetchingTask(true)
        try{
            const result = await getTask(id as string);
            if(result.status === 401){
                toast.error("Session expired, please login again.");
                navigate("/login")
            }
            if(result.length < 1){
                setTask(task)
                setFetchingTask(false)
            }
            setTask(result)
            setFetchingTask(false)
        }catch(error: unknown){
            toast.error("Error fetching tasks, please reload the page.");
            setFetchingTask(false)
        }
        
    }

    const handleSubTaskChange = (index: number, field: string, value: string) => {
        setTask((prev) => ({
            ...prev,
            subtask: prev.subtask?.map((item, i) => i === index ? {...item, [field]: value} : item)
        }))
    }

    const handleRemoveSubTask = (key: number) => {
        const newSubTasks = task.subtask?.filter((_, index) => index !== key);
        setTask((prev) => ({
            ...prev,
            subtask: newSubTasks
        }))
    }

    useEffect(() => {
        let done = true;
        done && fetch();
        return () => {
            done = false;
        }
    }, [])

    const handleMarkAsComplete = () => {
        setTask((prev) => ({
            ...prev,
            status: "completed",
            completed_date: subtasksCompleted ? dayjs().format("YYYY-MM-DD") : null
        }))
    }

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const status = e.target.value;
        setTask((prev) => ({...prev, status: e.target.value, completed_date: status === "completed" ? dayjs().format("YYYY-MM-DD") : null }))
    }

    const handleOpenSubTaskDeletionModal = (name: string, key: number) => {
        setOpenDeleteSubtask(true)
        setSubtaskToDelete({ name, key })
    }

    const handleCancelSubTaskDeletionModal = () => {
        setOpenDeleteSubtask(false)
        setSubtaskToDelete({ name: "", key: 0 })
    }

    useEffect(() => {
        if (!task) return;

        const hasSubtasks = task.subtask && task.subtask.length > 0;
        const completed = hasSubtasks 
            ? task.subtask.every(subtask => subtask.status === "done") 
            : false;

        setSubTasksCompleted(completed);
        if(hasSubtasks){
            if(task.status === "completed"){
                if(!completed){
                    setTask((prev) => ({ 
                        ...prev, 
                        status: "in-progress",
                        completed_date: null
                    }));
                }else{
                    setTask((prev) => ({...prev}));
                }
            }else{
                if(!completed){
                    setTask((prev) => ({ 
                        ...prev, 
                        status: "in-progress",
                        completed_date: null
                    }));
                }
            }
        }else{
            if(task.status === "completed"){
                setTask((prev) => ({...prev}));
            }
        }
    },[task.subtask])

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
            {
                fetchingTask ? (
                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', height: 750, width: "100%", gap: 2 }}>
                        <CircularProgress size={30} color="inherit"/>
                        <Typography variant="body1" sx={{ fontSize: 20, fontWeight: 'bold' }}>Fetching Task ...</Typography>
                    </Box>
                ): (
                    <>
                        {
                            !task || !task.title ? (
                               <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                                    <Typography sx={{ fontSize: 20 , fontWeight: 'bold' }}>No data found</Typography>
                                </Box>
                            ) : (
                                <>
                                    <DeleteSubTaskDesktop open={openDeleteSubtask} proceed={handleRemoveSubTask} close={handleCancelSubTaskDeletionModal} subtaskTitle={subTaskToDelete.name} itemToDelete={subTaskToDelete.key}/>
                                    <Box sx={{ display: "flex", justifyContent: "start", alignItems: 'center', gap: 2 }}>
                                        <Button type="button" onClick={() => navigate("/")} startIcon={<ArrowBackIosNewRounded/>}>
                                            <Typography sx={{ fontFamily: "Roboto", fontWeight: 'bold', textTransform: 'none' }}>Back</Typography>
                                        </Button>
                                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1}}>
                                            <Typography sx={{ fontFamily: "Roboto", fontWeight: 'bold', color: "grey.600" }}>View Task /</Typography>
                                            <Typography sx={{ fontFamily: "Roboto", fontWeight: 'bold' }}>Edit</Typography>
                                        </Box>
                                    </Box>
                                    <Paper variant="outlined" 
                                        sx={{ height: 750,
                                            border: 'none', 
                                            borderRadius: 4, 
                                            overflowY: task.title !== "" && task?.subtask.length > 0 || task.attachments !== null ? 'scroll' : 'none', 
                                            paddingBottom: task?.subtask.length > 0 ? 5 : 0
                                        }}>
                                        <Container maxWidth="md" sx={{ paddingTop: 5 }}>
                                            <Stack spacing={2}>
                                                <Grid container spacing={2}>
                                                    <Grid size={3}>
                                                        <TextField
                                                            select
                                                            label="Priority"
                                                            defaultValue={task.priority}
                                                            fullWidth
                                                            disabled
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTask((prev) => ({...prev, priority: e.target.value}))}
                                                            value={task.priority}
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
                                                            defaultValue={task.status}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleStatusChange(e)}
                                                            value={task.status}
                                                            >
                                                            {status.map((option) => (
                                                                <MenuItem key={option.value} value={option.value} disabled={option.value === "completed" && task.subtask.length > 0 && !subtasksCompleted}>
                                                                    {option.label}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </Grid>
                                                    {task.status === "completed" && (
                                                        <Grid size={3}>
                                                            <TextField
                                                                label="Completion Date"
                                                                value={task.completed_date ? dayjs(task.completed_date).format("MM/DD/YYYY") : dayjs().format("MM/DD/YYYY")}
                                                                disabled
                                                                fullWidth
                                                                sx={{
                                                                    '& .MuiInputBase-root': {
                                                                        fontSize: 16,
                                                                    },
                                                                }}
                                                            />
                                                        </Grid>
                                                        )}
                                                </Grid>
                                                <Grid container>
                                                    <Grid size={12}>
                                                        <TextField
                                                            id="outlined-multiline-flexible"
                                                            label="Title"
                                                            multiline
                                                            disabled
                                                            rows={4}
                                                            fullWidth
                                                            value={task.title}
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
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid size={6}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DemoContainer components={['DatePicker', 'DatePicker']}>
                                                                <DatePicker
                                                                    label="Date Created"
                                                                    value={task.due_date ? dayjs(task.created_at) : null}
                                                                    disabled
                                                                    slotProps={{
                                                                        textField: {
                                                                            fullWidth: true,
                                                                        },
                                                                    }}
                                                                />
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                    </Grid>
                                                    <Grid size={6}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DemoContainer components={['DatePicker', 'DatePicker']}>
                                                                <DatePicker
                                                                    label="Due Date"
                                                                    value={task.due_date ? dayjs(task.due_date) : null}
                                                                    onChange={(newValue) => setTask((prev) => ({
                                                                        ...prev,
                                                                        due_date: dayjs(newValue).format("YYYY-MM-DD")
                                                                    }))}
                                                                    slotProps={{
                                                                        textField: {
                                                                            fullWidth: true,
                                                                            error: errors.length > 0 && errors.filter((error) => error.key === "due_date").length > 0,
                                                                            helperText: errors.length > 0 && errors.filter((error) => error.key === "due_date").length > 0 ? errors.filter((error) => error.key === "due_date")[0].error : "",
                                                                            sx: {
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
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                    </Grid>
                                                </Grid>
                                                <Grid container>
                                                    <Grid size={12}>
                                                        <TextField
                                                            id="outlined-multiline-flexible"
                                                            label="Details(Optional)"
                                                            name="description"
                                                            multiline
                                                            rows={4}
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
                                                            fullWidth
                                                            onChange={handleTextChange}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid container>
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
                                                                <Box sx={{   display: "flex", justifyContent: "center"}}>
                                                                    <Box sx={{
                                                                        position: "absolute",
                                                                        top: -9,
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
                                                                        ): (
                                                                            <Box sx={{ display: "flex", justifyContent:"center", alignItems: "center", paddingTop: 4 }}>
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
                                                                    !uploading && 
                                                                    <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", paddingLeft: 3, paddingBottom: 2, gap: 2 }}>
                                                                        {
                                                                            task.attachments && task.attachments.map((file, key) => (
                                                                                <EditFilePreview key={key} attachment={file} removeFile={(e: React.MouseEvent<HTMLButtonElement>) => handleRemoveFile(e, key)}/>
                                                                            ))
                                                                        }
                                                                    </Box>
                                                                }
                                                            </Box>
                                                        </Box>
                                                        {fileError !== null && <Box sx={{ color: '#CA0061', fontSize: 14, marginTop: 1, fontWeight: 'bold' }}>{fileError.msg}</Box>}
                                                    </Grid>
                                                </Grid>
                                                <Grid container>
                                                    <Grid size={12}>
                                                        <Divider/>
                                                    </Grid>
                                                </Grid>
                                                <Grid container>
                                                    <Grid size={12}>
                                                        <Box sx={{ display: "flex", justifyContent: "space-between"}}>
                                                            <Typography sx={{ fontFamily: "Roboto", fontSize: 16, fontWeight: 'bold' }}>Subtask</Typography>
                                                            <Button color="primary" type="button" variant="outlined" sx={{ textTransform: "none", backgroundColor: '#fff', borderRadius: 6 }} startIcon={<Add/>} disabled={task.subtask.length === 10 || task.status === 'completed'} onClick={handleNewSubTask}>New Subtask</Button>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                                    {
                                                        task.subtask?.length > 0 && (
                                                            <Grid container spacing={2}>
                                                                <Grid size={8}>
                                                                    <Typography variant="body2" sx={{ color: 'grey.600' }}>Title</Typography>
                                                                </Grid>
                                                                <Grid size={4}>
                                                                    <Typography variant="body2" sx={{ color: 'grey.600' }}>Status</Typography>
                                                                </Grid>
                                                            </Grid>
                                                        )
                                                    }
                                                    {
                                                        task.subtask?.length > 0 && (
                                                            <>
                                                                {task.subtask.map((subTask, key) => (
                                                                    <Grid container key={key} spacing={2}>
                                                                        <Grid size={8}>
                                                                            <TextField 
                                                                            type="text" 
                                                                            label="Title" 
                                                                            value={subTask.title}
                                                                            error={!subTask.title.trim()}
                                                                            helperText={!subTask.title.trim() && "Must not be empty"}
                                                                            id="subtask-title" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSubTaskChange(key, "title", e.target.value)} fullWidth/>
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
                                                                            <IconButton size="medium" sx={{ top: 10 }} onClick={() => handleOpenSubTaskDeletionModal(subTask.title, key)}><img src={DeleteIcon} alt="delete-icon" height={20} width="100%"/></IconButton>
                                                                        </Grid>
                                                                    </Grid>
                                                                ))}
                                                            </>
                                                        )
                                                    }
                                            </Stack>
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
                                        
                                        {(task?.subtask?.length > 0 && subtasksCompleted && task.status !== "completed") ? (
                                            <Button 
                                                type="button" 
                                                variant="contained" 
                                                color="primary" 
                                                sx={{ 
                                                    fontFamily: "Roboto", 
                                                    fontWeight: 'bold', 
                                                    textTransform: 'none', 
                                                    borderRadius: 6 
                                                }} 
                                                onClick={handleMarkAsComplete} 
                                                disabled={loading || fetchingTask}
                                            >
                                                {loading ? (
                                                    <CircularProgress size={30} color="inherit"/> 
                                                ) : (
                                                    "Mark as Complete"
                                                )}
                                            </Button>
                                        ):(
                                            <Button 
                                                type="button" 
                                                variant="contained" 
                                                color="primary" 
                                                sx={{ 
                                                    fontFamily: "Roboto", 
                                                    fontWeight: 'bold', 
                                                    textTransform: 'none', 
                                                    borderRadius: 6 
                                                }} 
                                                onClick={handleSubmit} disabled={loading || fetchingTask}>
                                                {loading ? 
                                                    <CircularProgress size={30} color="inherit"/> 
                                                :"Save"}</Button>
                                            )
                                        }
                                    </Box>
                                </>
                            )
                        }
                    </>
                )
            }
        </Box>
    )
}