import React, { useState, useRef, Fragment, useEffect } from 'react';
import { Box, Typography, Button, TextField, MenuItem, InputAdornment, LinearProgress, Container, Divider, CircularProgress, IconButton, AppBar, Toolbar, Stack } from '@mui/material'
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
import { MobileAppBar } from '../MobileAppBar';

import DeleteIcon from '../../assets/Icons/Delete_active.svg'
import Suppress from '../../assets/Icons/Accordion_supress.svg'
import DropdownDialog from '../Dialog/Mobile/Dropdown';

dayjs.extend(customParseFormat);
export default function NewTaskMobile() {
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [fileError, setFileError] = useState<{error: boolean, msg: string} | null>(null)
    const navigate = useNavigate();
    const [errors, setErrors] = useState<{key: string, error: string}[] | []>([]);
    const [openDropdownDialog, setOpenDropdownDialog] = useState(false)
    const [dropdownDialogTitle, setDropdownDialogTitle] = useState<string>("")
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
            active: false
        },
        {
            value: "cancelled",
            label: "Cancelled",
            active: false
        },
    ]

    const { getRootProps, getInputProps } = useDropzone({
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
        setErrors([])
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

    const handleProceedPriority = (value: string) => setTask((prev) => ({...prev, priority: value }))

    const handleProceedStatus = (value: string) => setTask((prev) => ({...prev, status: value }))

    const handleOpenDropdownDialog = (title: string) => {
        setOpenDropdownDialog((prev) => !prev);
        setDropdownDialogTitle(title)
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
            <AppBar position="fixed" color="inherit" sx={{ top: 0, bottom: "auto" }}>
                <Toolbar sx={{ display: "flex", alignItems: 'center', gap: 1 }}>
                    <Button type="button" onClick={() => navigate("/")} startIcon={<ArrowBackIosNewRounded/>}>
                        <Typography sx={{ fontFamily: "Roboto", fontWeight: 'bold', textTransform: 'none', color: '#027CEC', fontSize: 14 }}>Back</Typography>
                    </Button>
                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                        <Divider orientation="vertical" flexItem sx={{ height: 25 }}/>
                    </Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 'bold', color: '#272D32' }}>New Task</Typography>
                </Toolbar>
            </AppBar>
            <DropdownDialog 
                open={openDropdownDialog} 
                close={() => setOpenDropdownDialog(false)} 
                proceed={dropdownDialogTitle === "priority" ? handleProceedPriority : handleProceedStatus}
                title={dropdownDialogTitle === "priority" ? "Select Priority" : "Select Status"}
                defaultValue={dropdownDialogTitle === "priority" ? task.priority : task.status}
                options={dropdownDialogTitle === "priority" ? priorities : status}/>
            <Box sx={{ display: "flex", justifyContent: "start", alignItems: 'center', gap: 2 }}>
                <Button type="button" onClick={() => navigate("/")} startIcon={<ArrowBackIosNewRounded/>}>
                    <Typography sx={{ fontFamily: "Roboto", fontWeight: 'bold', textTransform: 'none' }}>Back</Typography>
                </Button>
                <Typography sx={{ fontFamily: "Roboto", fontWeight: 'bold' }}>New Task Mobile</Typography>
            </Box>
            <Box sx={{ 
                overflowY: task?.subTask.length > 0 || task.attachments !== null ? 'scroll' : 'none', 
                paddingBottom: task?.subTask.length > 0 ? 5 : 0
            }}>
                <Container maxWidth="md" sx={{ paddingTop: 5, paddingBottom: 10 }}>
                    <Stack spacing={2}>
                        <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ flexGrow: 1, display: "flex", alignItems: 'center', gap: 1 }}>
                                <TextField
                                    label="Priority"
                                    size="small"
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
                                            readOnly: true,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <img src={Suppress} alt="suppress-icon" height={10} width={10} />
                                                </InputAdornment>
                                            ),
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
                                            readOnly: true,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <img src={Suppress} alt="suppress-icon" height={10} width={10} />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
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
                        <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', gap: 2}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Date Created"
                                    value={dayjs(new Date())}
                                    disabled
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            size: 'small'
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
                                            error: errors.length > 0 && errors.filter((error) => error.key === "due_date").length > 0,
                                            helperText: errors.length > 0 && errors.filter((error) => error.key === "due_date").length > 0 ? errors.filter((error) => error.key === "due_date")[0].error : "",
                                            size: 'small',
                                            style: {
                                                color: errors.length > 0 && errors.filter((error) => error.key === "due_date").length > 0 ? '#CA0061' : '#000000',
                                            },
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
                            sx={{  
                                '& .MuiInputBase-root': {
                                    fontSize: '14px'
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
                            error={errors.length > 0 && errors.filter((error) => error.key === "description").length > 0 } 
                            helperText={errors.length > 0 && errors.filter((error) => error.key === "description").length > 0 ? errors.filter((error) => error.key === "description")[0].error : ""}
                            value={task.description}
                            rows={4}
                            fullWidth
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
                                                <Box sx={{ marginTop: 10, width: "50%", minHeight: "15vh", textAlign: 'center' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                                                        <Typography sx={{ fontSize: 14, marginBottom: 1 }}>{uploadedFileNames.toString()}</Typography>
                                                    </Box>
                                                    <LinearProgress variant="determinate" value={progress} aria-label="Export data"/>
                                                </Box>
                                            ): (
                                                <Box sx={{ display: "flex", justifyContent:"center", alignItems: "center", paddingTop: task.attachments.length > 0 ? 2 : 4, paddingBottom: 3 }}>
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
                                        !uploading && <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start", alignItems: "center", paddingBottom: 2, gap: 2 }}>
                                            {
                                                task.attachments && task.attachments.map((file, key) => (
                                                    <FilePreview file={file} key={key} removeFile={(e: React.MouseEvent<HTMLButtonElement>) => handleRemoveFile(e, key)}/>
                                                ))
                                            }
                                        </Box>
                                    }
                                </Box>
                            </Box>
                            {fileError !== null && <Box sx={{ color: '#CA0061', fontSize: 14, marginTop: 1, fontWeight: 'bold' }}>{fileError.msg}</Box>}
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between"}}>
                            <Typography sx={{ fontFamily: "Roboto", fontSize: 16, fontWeight: 'bold' }}>Subtask</Typography>
                            <Button color="primary" type="button" variant="outlined" sx={{ textTransform: "none", backgroundColor: '#fff', borderRadius: 6 }} startIcon={<Add/>} disabled={task.subTask.length === 10} onClick={handleNewSubTask}>New Subtask</Button>
                        </Box>
                        {
                            task.subTask.length > 0 && (
                                <>
                                    <Box sx={{ display: "flex", justifyContent: 'space-between', alignItem: 'center' }}>
                                        {
                                            ["Title", "Status", ""].map((item, key) => {
                                                return <Typography key={key} variant="body2" sx={{ color: 'grey.600' }}>{item}</Typography>
                                            })
                                        }
                                    </Box>

                                    {task.subTask.map((subTask, key) => (
                                        <Fragment key={key}>
                                            <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                                                <TextField 
                                                    type="text" 
                                                    size="small"
                                                    error={!subTask.title.trim()}
                                                    helperText={!subTask.title.trim() && "Must not be empty"}
                                                    label="Title" 
                                                    value={subTask.title} id="subtask-title" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSubTaskChange(key, "title", e.target.value)}
                                                    sx={{  
                                                        '& .MuiInputBase-root': {
                                                            fontSize: '14px'
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
                                                    <TextField
                                                        select
                                                        label="Status"
                                                        value={subTask.status}
                                                        fullWidth
                                                        size="small"
                                                        defaultValue="Not Done"
                                                        sx={{  
                                                            '& .MuiInputBase-root': {
                                                                fontSize: '14px'
                                                            },
                                                        }}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSubTaskChange(key, "status", e.target.value)}
                                                        >
                                                        {subTasksDropdown.map((option, key) => (
                                                            <MenuItem key={key} value={option.value}>
                                                            {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                <IconButton size="medium" sx={{ top: 0 }} onClick={() => handleRemoveSubTask(key)}><img src={DeleteIcon} alt="delete-icon" height={20} width="100%"/></IconButton>
                                            </Box>
                                        </Fragment>
                                    ))}
                                </>
                            )
                        }
                    </Stack>
                </Container>
            </Box>
            <MobileAppBar>
                <Box sx={{ flexGrow: 1, display: "flex", alignItems: 'center', justifyContent: 'center', marginLeft: 5 }}>
                    <Button type="button" variant="contained" color="primary" sx={{ fontFamily: "Roboto", fontWeight: 'bold', textTransform: 'none', borderRadius: 6 }} onClick={handleSubmit} disabled={loading}>{loading ? <CircularProgress size={30} color="inherit"/> : "Save"}</Button>
                </Box>
            </MobileAppBar>
        </Box>
    )
}