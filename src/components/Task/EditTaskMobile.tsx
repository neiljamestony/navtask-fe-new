import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, TextField, Container, InputAdornment, LinearProgress, Divider, CircularProgress, IconButton, Stack, AppBar, Toolbar, Switch, FormControlLabel } from '@mui/material'
import { ArrowBackIosNewRounded, Add } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
import { limitText, validFileTypes } from '../../utils/utils';
import DeleteSubTask from '../Todo/DeleteSubTask';
import DropdownDialog from '../Dialog/Mobile/Dropdown';
import { MobileAppBar } from '../MobileAppBar';
import FetchingTaskLoader from '../../assets/loader.svg';

import Suppress from '../../assets/Icons/Accordion_supress.svg'

dayjs.extend(customParseFormat);

export default function EditTaskMobile() {
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
    const [openDeleteSubtask, setOpenDeleteSubtask] = useState(false);
    const [openDropdownDialog, setOpenDropdownDialog] = useState(false)
    const [dropdownDialogTitle, setDropdownDialogTitle] = useState<string>("")
    const [uploading, setUploadingStatus] = useState(false)
    const [progress, setProgress] = React.useState(0);
    const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([])
    const [errors, setErrors] = useState<{key: string, error: string}[] | []>([]);
    const [subTaskToDelete, setSubtaskToDelete] = useState({
        name: "",
        key: 0
    })
    const inputRef = useRef<HTMLInputElement | null>(null);
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
            active: task && task.subtask ? task.subtask.length > 0 && !subtasksCompleted ? false : true : false
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
            const fileNames = acceptedFiles.map(file => limitText(file.name));
            setUploadedFileNames(fileNames)

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
    })
    
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
                setSubtaskToDelete({ name: "", key: 0 })
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
                toast.error("Session expired, please login again");
                navigate("/")
            }
            if(result.length < 1){
                setTask(task)
                setFetchingTask(false)
            }
            if(result?.status === 422){
                if(result?.errors){
                    setErrors(result?.errors);
                }else{
                    toast.error(result?.msg);
                }
                setFetchingTask(false)
                setLoading(false);
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

    const handleOpenSubTaskDeletionModal = (name: string, key: number) => {
        setOpenDeleteSubtask(true)
        setSubtaskToDelete({ name, key })
    }

    const handleCancelSubTaskDeletionModal = () => {
        setOpenDeleteSubtask(false)
        setSubtaskToDelete({ name: "", key: 0 })
    }

    const handleRemoveSubTask = () => {
        const newSubTasks = task.subtask?.filter((_, index) => index !== subTaskToDelete.key);
        setTask((prev) => ({
            ...prev,
            subtask: newSubTasks
        }))
    }

    const handleMarkAsComplete = () => {
        setTask((prev) => ({
            ...prev,
            status: subtasksCompleted ? "completed" : prev.status,
            completed_date: subtasksCompleted ? dayjs().format("YYYY-MM-DD") : null
        }))
    }

    const handleDueDateChange = (newValue: dayjs.Dayjs | null) => {
        setTask((prev) => ({
            ...prev,
            due_date: dayjs(newValue).format("MM/DD/YYYY")
        }))
    }

    const handleOpenDropdownDialog = (title: string) => {
        setOpenDropdownDialog((prev) => !prev);
        setDropdownDialogTitle(title)
    }

    const handleProceedPriority = (value: string) => {
        setTask((prev) => ({...prev, priority: value }))
    }

    const handleProceedStatus = (value: string) => {
        setTask((prev) => ({...prev, status: value, completed_date: value === "completed" ? dayjs().format("YYYY-MM-DD") : prev.completed_date }))
    }

    useEffect(() => {
        let done = true;
        done && fetch();
        return () => {
            done = false;
        }
    }, [])

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
            <AppBar position="fixed" color="inherit" sx={{ top: 0, bottom: "auto" }}>
                <Toolbar sx={{ display: "flex", alignItems: 'center', gap: 1 }}>
                    <Button type="button" onClick={() => navigate("/")} startIcon={<ArrowBackIosNewRounded/>}>
                        <Typography sx={{ fontFamily: "Roboto", fontWeight: 'bold', textTransform: 'none', color: '#027CEC', fontSize: 14 }}>Back</Typography>
                    </Button>
                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                        <Divider orientation="vertical" flexItem sx={{ height: 25 }}/>
                    </Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 'bold', color: 'grey.600' }}>View Task</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 'bold' }}>/ Edit</Typography>
                </Toolbar>
            </AppBar>
            {
                fetchingTask ? (
                   <Box sx={{ height: 500, width: "100%", display: "block", alignItems: 'center', textAlign: 'center'}}>
                        <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <img src={FetchingTaskLoader} height={500} width={400} alt="fetching-task-loader"/>
                        </Box>
                        <Typography sx={{ fontSize: 25 }}>Fetching Task ...</Typography>
                    </Box>
                ): (
                    <>
                        {
                            !task || !task.title ? (
                                <>
                                     <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                                        <Typography sx={{ fontSize: 20 , fontWeight: 'bold' }}>No data found</Typography>
                                    </Box>
                                </>
                            ): (
                                <>
                                    <DeleteSubTask open={openDeleteSubtask} proceed={handleRemoveSubTask} close={handleCancelSubTaskDeletionModal} subtaskTitle={subTaskToDelete.name} itemToDelete={subTaskToDelete.key}/>
                                    <DropdownDialog 
                                        open={openDropdownDialog} 
                                        close={() => setOpenDropdownDialog(false)} 
                                        proceed={dropdownDialogTitle === "priority" ? handleProceedPriority : handleProceedStatus}
                                        title={dropdownDialogTitle === "priority" ? "Select Priority" : "Select Status"}
                                        defaultValue={task.status}
                                        options={dropdownDialogTitle === "priority" ? priorities : status}/>
                                    <Box sx={{ paddingBottom: task?.subtask.length > 0 ? 5 : 0 }}>
                                        <Container maxWidth="md" sx={{ paddingTop: 10, paddingBottom: 5 }}>
                                            <Stack spacing={2}>
                                                <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                                                    <Box sx={{ flexGrow: 1, display: "flex", alignItems: 'center', gap: 1 }}>
                                                        <TextField
                                                            label="Priority"
                                                            size="small"
                                                            disabled
                                                            value={priorities.find((item) => item.value === task.priority)?.label}
                                                            fullWidth
                                                            onClick={() => handleOpenDropdownDialog("priority")}
                                                            sx={{
                                                                '& .MuiInputBase-root': {
                                                                    fontSize: '14px',
                                                                },
                                                            }}
                                                            slotProps={{
                                                                input: {
                                                                    endAdornment: (
                                                                        <InputAdornment position="end">
                                                                            <img src={Suppress} alt="suppress-icon" height={10} width={10} />
                                                                        </InputAdornment>
                                                                    ),
                                                                    readOnly: true,
                                                                },
                                                            }}
                                                        />
                                                        <TextField
                                                            label="Status"
                                                            size="small"
                                                            value={status.find((item) => item.value === task.status)?.label}
                                                            fullWidth
                                                            onClick={() => handleOpenDropdownDialog("status")}
                                                            sx={{  
                                                                '& .MuiInputBase-root': {
                                                                    fontSize: '14px',
                                                                },
                                                            }}
                                                            slotProps={{
                                                                input: {
                                                                    endAdornment: (
                                                                        <InputAdornment position="end">
                                                                            <img src={Suppress} alt="suppress-icon" height={10} width={10} />
                                                                        </InputAdornment>
                                                                    ),
                                                                    readOnly: true,
                                                                },
                                                            }}
                                                        />
                                                    </Box>
                                                    {task.status === "completed" && (
                                                        <TextField
                                                            label="Completion Date"
                                                            value={task.completed_date ? dayjs(task.completed_date).format("MM/DD/YYYY") : dayjs().format("MM/DD/YYYY")}
                                                            disabled
                                                            fullWidth
                                                            size="small"
                                                            sx={{
                                                                '& .MuiInputBase-root': {
                                                                    fontSize: 14,
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                </Box>
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
                                                    }}
                                                />
                                                <Box sx={{ display: "flex", alignItems: 'center', gap: 2 }}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            label="Date Created"
                                                            value={task.created_at ? dayjs(task.created_at) : null}
                                                            disabled
                                                            slotProps={{
                                                                textField: {
                                                                    size: "small"
                                                                },
                                                            }}
                                                        />
                                                    </LocalizationProvider>

                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            label="Due Date"
                                                            value={dayjs(task.due_date)}
                                                            onChange={handleDueDateChange}
                                                            slotProps={{
                                                                toolbar: {
                                                                    hidden: true,
                                                                },
                                                                textField: {
                                                                    fullWidth: true,
                                                                    size: 'small',
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
                                                                mobilePaper: {
                                                                    sx: {
                                                                        borderRadius: 5
                                                                    }
                                                                },
                                                                dialog: {
                                                                    sx: {
                                                                        '& .MuiDialog-container': {
                                                                            alignItems: 'flex-end',
                                                                        },
                                                                        '& .MuiDialog-paper': {
                                                                            margin: 0,
                                                                            maxWidth: '80%',
                                                                            width: '100%',
                                                                            marginBottom: 10
                                                                        },
                                                                    },
                                                                    slotProps: {
                                                                        backdrop: {
                                                                            sx: {
                                                                                height: '93.5vh'
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                
                                                            }}
                                                        />
                                                    </LocalizationProvider>         
                                                </Box>
                                                <TextField
                                                    id="outlined-multiline-flexible"
                                                    label="Details(Optional)"
                                                    name="description"
                                                    multiline
                                                    rows={4}
                                                    fullWidth
                                                     sx={{
                                                        '& .MuiInputBase-root': {
                                                            fontSize: '14px',
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
                                                    slotProps={{
                                                        htmlInput: { maxLength: 300 }
                                                    }}
                                                    value={task.description}
                                                    error={errors.length > 0 && errors.filter((error) => error.key === "description").length > 0 } 
                                                    helperText={errors.length > 0 && errors.filter((error) => error.key === "description").length > 0 ? errors.filter((error) => error.key === "description")[0].error : ""}
                                                    onChange={handleTextChange}
                                                />
                                                
                                                <Box>
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
                                                            <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                                                                    <Box sx={{ marginTop: 3, width: "50%", minHeight: "15vh" }}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                                                                            <Typography sx={{ fontSize: 14, marginBottom: 1 }}>{uploadedFileNames.toString()}</Typography>
                                                                        </Box>
                                                                        <LinearProgress variant="determinate" value={progress} aria-label="Export data"/>
                                                                    </Box>
                                                                    ):(<Box sx={{ display: "flex", justifyContent:"center", alignItems: "center", paddingTop: 4, paddingBottom: 3 }}>
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
                                                                !uploading && <Box sx={{ display: "flex", flexWrap: 'wrap', alignItems: "center", paddingBottom: 2, gap: 2 }}>
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
                                                </Box>
                                                <Divider/>
                                                <Box sx={{ display: "flex", justifyContent: "space-between"}}>
                                                    <Typography sx={{ fontFamily: "Roboto", fontSize: 16, fontWeight: 'bold' }}>Subtask</Typography>
                                                    <Button color="primary" type="button" variant="outlined" sx={{ textTransform: "none", backgroundColor: '#fff', borderRadius: 6 }} startIcon={<Add/>} disabled={task.subtask.length === 10 || task.status === 'completed'} onClick={handleNewSubTask}>New Subtask</Button>
                                                </Box>
                                                {
                                                    task.subtask?.length > 0 && (
                                                        <Box sx={{ display: "flex", justifyContent: 'space-evenly', alignItems: 'center' }}>
                                                            <Typography variant="body2" sx={{ color: 'grey.600' }}>Title</Typography>
                                                            <Typography variant="body2" sx={{ color: 'grey.600' }}>Status</Typography>
                                                        </Box>
                                                    )
                                                }
                                                {
                                                    task.subtask?.length > 0 && (
                                                        <>
                                                            {task.subtask.map((subTask, key) => (
                                                                <Box key={key} sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                                                                    <IconButton size="medium" sx={{ top: 10 }} onClick={() => handleOpenSubTaskDeletionModal(subTask.title, key)}><img src={DeleteIcon} alt="delete-icon" height={20} width="100%"/></IconButton>
                                                                    <TextField 
                                                                    type="text" 
                                                                    label="Title"
                                                                    value={subTask.title}
                                                                    error={!subTask.title.trim()}
                                                                    helperText={!subTask.title.trim() && "Must not be empty"}
                                                                    id="subtask-title"
                                                                    size="medium"
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSubTaskChange(key, "title", e.target.value)}
                                                                    sx={{  
                                                                        '& .MuiInputBase-root': {
                                                                            fontSize: '14px',
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
                                                                    fullWidth/>
                                                                    <FormControlLabel 
                                                                        control={<Switch checked={subTask.status === "done"} 
                                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSubTaskChange(key, "status", e.target.checked ? "done" : "not-done")}/>} 
                                                                        label={subTask.status === "done" ? "Done" : "Not Done"}
                                                                        slotProps={{
                                                                            typography: {
                                                                                sx: { fontSize: '14px' } 
                                                                            }
                                                                        }}
                                                                        />
                                                                </Box>
                                                            ))}
                                                        </>
                                                    )
                                                }
                                            
                                                { (task?.subtask?.length > 0 && subtasksCompleted && task.status !== "completed") && ( 
                                                    <>
                                                        <Divider/>
                                                        <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                                                            <Box sx={{ display: "block", alignItems: 'center', width: '100%', textAlign: 'center' }}>
                                                                    <Typography sx={{ fontSize: 14, mb: 2 }}>All subtasks are <span style={{ fontWeight: 'bold' }}>done</span></Typography>
                                                                    <Button 
                                                                        type="button" 
                                                                        variant="contained" 
                                                                        color="primary"
                                                                        fullWidth
                                                                        sx={{ 
                                                                            fontFamily: "Roboto", 
                                                                            fontWeight: 'bold', 
                                                                            textTransform: 'none', 
                                                                            borderRadius: 6
                                                                        }} 
                                                                        onClick={handleMarkAsComplete} disabled={fetchingTask}>Mark as Complete</Button>
                                                            </Box>
                                                        </Box>
                                                    </>
                                                )}
                                            </Stack>
                                        </Container>
                                    </Box>
                                    <MobileAppBar>
                                        <Box sx={{ flexGrow: 1, display: "flex", alignItems: 'center', justifyContent: 'center', marginLeft: 5 }}>
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
                                            : "Save"}</Button>
                                        </Box>
                                    </MobileAppBar>
                                </>
                            )
                        }
                    </>
                )
            }
        </Box>
    )
}