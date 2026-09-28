import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, TextField, LinearProgress, CircularProgress, IconButton, AppBar, Toolbar, Switch, FormControlLabel } from '@mui/material'
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
import { prioritiesIcons, statusIcons } from '../Todo/DesktopTodo';
import { CalendarDays, Save } from 'lucide-react';

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

    const currentStatus = statusIcons[task.status as keyof typeof statusIcons];
    const currentPriority = prioritiesIcons[task.priority as keyof typeof prioritiesIcons];
    
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
        <Box sx={{ minHeight: "100dvh", bgcolor: "#f6f8fb", pb: 11 }}>
            <AppBar
            position="fixed"
            color="inherit"
            elevation={0}
            sx={{
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: "rgba(255,255,255,0.96)",
                backdropFilter: "blur(12px)",
            }}
            >
            <Toolbar sx={{ minHeight: 58, gap: 1 }}>
                <IconButton aria-label="Back to tasks" onClick={() => navigate("/")}>
                <ArrowBackIosNewRounded fontSize="small" />
                </IconButton>
                <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    Edit task
                </Typography>
                {task.title && (
                    <Typography variant="caption" color="text.secondary">
                    {task.title}
                    </Typography>
                )}
                </Box>
            </Toolbar>
            </AppBar>

            {fetchingTask ? (
            <Box
                role="status"
                aria-live="polite"
                sx={{
                minHeight: "100dvh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1.5,
                color: "text.secondary",
                }}
            >
                <CircularProgress size={28} />
                <Typography variant="body2">Loading task…</Typography>
            </Box>
            ) : !task || !task.title ? (
            <Box
                sx={{
                minHeight: "100dvh",
                display: "grid",
                placeItems: "center",
                px: 3,
                pt: 8,
                textAlign: "center",
                }}
            >
                <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Task not found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, mb: 2 }}>
                    The task may have been deleted or the link may be invalid.
                </Typography>
                <Button variant="contained" onClick={() => navigate("/")} sx={{ textTransform: "none" }}>
                    Back to tasks
                </Button>
                </Box>
            </Box>
            ) : (
            <>
                <DeleteSubTask
                open={openDeleteSubtask}
                proceed={handleRemoveSubTask}
                close={handleCancelSubTaskDeletionModal}
                subtaskTitle={subTaskToDelete.name}
                itemToDelete={subTaskToDelete.key}
                />

                <DropdownDialog
                    open={openDropdownDialog}
                    close={() => setOpenDropdownDialog(false)}
                    proceed={
                        dropdownDialogTitle === "priority"
                        ? handleProceedPriority
                        : handleProceedStatus
                    }
                    title={dropdownDialogTitle === "priority" ? "Select priority" : "Select status"}
                    defaultValue={
                        dropdownDialogTitle === "priority" ? task.priority : task.status
                    }
                    options={dropdownDialogTitle === "priority" ? priorities : status}
                />

                <Box
                    component="main"
                    sx={{
                        maxWidth: 640,
                        mx: "auto",
                        px: 2,
                        pt: 10,
                        pb: 3,
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25 }}>
                            {[
                                {
                                    label: "Priority",
                                    onClick: () => handleOpenDropdownDialog("priority"),
                                    item: currentPriority,
                                    },
                                    {
                                    label: "Status",
                                    onClick: () => handleOpenDropdownDialog("status"),
                                    item: currentStatus,
                                },
                            ].map(({ label, onClick, item }) => (
                                <Box
                                key={label}
                                component="button"
                                type="button"
                                onClick={onClick}
                                sx={{
                                    p: 1.5,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 2.5,
                                    bgcolor: "background.paper",
                                    textAlign: "left",
                                    cursor: "pointer",
                                }}
                                >
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: "block", mb: 0.75 }}
                                >
                                    {label}
                                </Typography>

                                {item ? (
                                    <Box
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 0.75,
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 10,
                                        bgcolor: item.bgColor,
                                        color: item.color,
                                    }}
                                    >
                                    {item.icon}
                                    <Typography variant="caption" sx={{ fontWeight: 700, lineHeight: 1 }}>
                                        {item.label}
                                    </Typography>
                                    </Box>
                                ) : (
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                    —
                                    </Typography>
                                )}
                                </Box>
                            ))}
                        </Box>

                        {task.status === "completed" && (
                            <TextField
                                label="Completion date"
                                value={
                                task.completed_date
                                    ? dayjs(task.completed_date).format("MM/DD/YYYY")
                                    : dayjs().format("MM/DD/YYYY")
                                }
                                disabled
                                fullWidth
                                size="small"
                            />
                        )}

                        <Box
                            sx={{
                                p: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2.5,
                                bgcolor: "background.paper",
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.25 }}>
                                Task title
                            </Typography>
                            <TextField
                                label="Title"
                                value={task.title}
                                error={errors.some((error) => error.key === "title")}
                                helperText={
                                errors.find((error) => error.key === "title")?.error ??
                                `${task.title?.length ?? 0}/300`
                                }
                                multiline
                                minRows={2}
                                fullWidth
                                size="small"
                            />
                        </Box>
                        <Box
                            sx={{
                                p: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2.5,
                                bgcolor: "background.paper",
                            }}
                            >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                <CalendarDays size={18} color="#64748b" />
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                Schedule
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", sm: "1fr 1.4fr" },
                                alignItems: "stretch",
                                gap: 1.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.25,
                                        p: 1.5,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 2,
                                        bgcolor: "grey.50",
                                    }}
                                    >
                                    <CalendarDays size={17} color="#64748b" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                            Created
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {task.created_at ? dayjs(task.created_at).format("D MMM YYYY") : "—"}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Due date"
                                        value={task.due_date ? dayjs(task.due_date) : null}
                                        onChange={handleDueDateChange}
                                        slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            size: "small",
                                            error: errors.some((error) => error.key === "due_date"),
                                            helperText:
                                            errors.find((error) => error.key === "due_date")?.error ?? " ",
                                        },
                                        }}
                                    />
                                    </LocalizationProvider>
                                </Box>
                            </Box>
                        <Box
                            sx={{
                                p: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2.5,
                                bgcolor: "background.paper",
                            }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.25 }}>
                                Description
                            </Typography>
                            <TextField
                                label="Details (optional)"
                                name="description"
                                value={task.description}
                                onChange={handleTextChange}
                                multiline
                                rows={4}
                                fullWidth
                                size="small"
                                slotProps={{ htmlInput: { maxLength: 300 } }}
                                error={errors.some((error) => error.key === "description")}
                                helperText={
                                errors.find((error) => error.key === "description")?.error ??
                                `${task.description?.length ?? 0}/300`
                                }
                            />
                        </Box>
                        <Box
                            sx={{
                                p: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2.5,
                                bgcolor: "background.paper",
                            }}
                            >
                            <Box
                                sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                gap: 1,
                                mb: 1.5,
                                }}
                            >
                                <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                    Attachments
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Up to 5 files · 10 MB max per file
                                </Typography>
                                </Box>

                                <Box
                                sx={{
                                    px: 1,
                                    py: 0.4,
                                    borderRadius: 10,
                                    bgcolor: "grey.100",
                                    color: "text.secondary",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    whiteSpace: "nowrap",
                                }}
                                >
                                {task.attachments.length}/5
                                </Box>
                            </Box>

                            <Box
                                {...getRootProps()}
                                sx={{
                                    p: 2.5,
                                    border: "1px dashed",
                                    borderColor: fileError ? "error.main" : "primary.light",
                                    borderRadius: 2,
                                    bgcolor: fileError ? "error.50" : "primary.50",
                                    textAlign: "center",
                                    cursor: uploading ? "default" : "pointer",
                                    transition: "background-color 150ms ease, border-color 150ms ease",
                                    "&:active": {
                                        bgcolor: fileError ? "error.100" : "primary.100",
                                    },
                                }}
                            >
                                <input {...getInputProps()} />
                                {uploading ? (
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{ mb: 1.25, fontWeight: 600, overflowWrap: "anywhere" }}
                                    >
                                    Uploading {uploadedFileNames.join(", ")}
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progress}
                                        aria-label="Upload progress"
                                        sx={{ borderRadius: 5, height: 6 }}
                                        />
                                </Box>
                                ) : (
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                                    <Box
                                    sx={{
                                        width: 42,
                                        height: 42,
                                        display: "grid",
                                        placeItems: "center",
                                        borderRadius: 2,
                                        bgcolor: "background.paper",
                                    }}
                                    >
                                    <Box
                                        component="img"
                                        src={UploadIcon}
                                        alt=""
                                        sx={{ width: 23, height: 23, objectFit: "contain" }}
                                    />
                                    </Box>

                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Tap to add files</Typography>
                                    <Typography variant="caption" color="text.secondary">or drag and drop them here</Typography>
                                </Box>
                                )}
                            </Box>

                            {fileError && (
                                <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
                                {fileError.msg}
                                </Typography>
                            )}

                            {!uploading && task.attachments.length > 0 && (
                                <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
                                {task.attachments.map((file, key) => (
                                    <EditFilePreview
                                    key={`${file.name}-${key}`}
                                    attachment={file}
                                    removeFile={(e: React.MouseEvent<HTMLButtonElement>) =>
                                        handleRemoveFile(e, key)
                                    }
                                    />
                                ))}
                                </Box>
                            )}
                            </Box>
                        {/* Subtasks */}
                        <Box
                            sx={{
                                p: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2.5,
                                bgcolor: "background.paper",
                            }}>
                            <Box
                                sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                                mb: 1.5,
                                }}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Subtasks</Typography>
                                <Typography variant="caption" color="text.secondary">{task.subtask.length} of 10 </Typography>
                            </Box>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Add />}
                                disabled={task.subtask.length >= 10 || task.status === "completed"}
                                onClick={handleNewSubTask}
                                sx={{ textTransform: "none", borderRadius: 2 }}
                                >Add
                            </Button>
                        </Box>

                        {task.subtask.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                No subtasks added.
                            </Typography>
                        ) : (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                                {task.subtask.map((subTask, key) => {
                                    const isDone = subTask.status === "done";

                                    return (
                                    <Box
                                        key={key}
                                        sx={{
                                        p: 1.5,
                                        border: "1px solid",
                                        borderColor: isDone ? "success.200" : "divider",
                                        borderRadius: 2.5,
                                        bgcolor: isDone ? "success.50" : "background.paper",
                                        transition: "background-color 150ms ease, border-color 150ms ease",
                                        }}
                                    >
                                        <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 1,
                                            mb: 1.25,
                                        }}
                                        >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Box
                                            sx={{
                                                width: 26,
                                                height: 26,
                                                display: "grid",
                                                placeItems: "center",
                                                borderRadius: "50%",
                                                bgcolor: isDone ? "success.main" : "grey.200",
                                                color: isDone ? "common.white" : "text.secondary",
                                                fontSize: 12,
                                                fontWeight: 700,
                                            }}
                                            >
                                            {key + 1}
                                            </Box>

                                            <Typography
                                            variant="caption"
                                            sx={{
                                                fontWeight: 700,
                                                color: isDone ? "success.dark" : "text.secondary",
                                            }}
                                            >
                                            {isDone ? "Completed" : "In progress"}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <FormControlLabel
                                            sx={{ m: 0 }}
                                            control={
                                                <Switch
                                                size="small"
                                                checked={isDone}
                                                onChange={(e) =>
                                                    handleSubTaskChange(
                                                    key,
                                                    "status",
                                                    e.target.checked ? "done" : "not-done"
                                                    )
                                                }
                                                />
                                            }
                                            label=""
                                            />

                                            <IconButton
                                            size="small"
                                            aria-label={`Delete subtask ${key + 1}`}
                                            onClick={() =>
                                                handleOpenSubTaskDeletionModal(subTask.title, key)
                                            }
                                            sx={{
                                                color: "text.secondary",
                                                "&:hover": {
                                                color: "error.main",
                                                bgcolor: "error.50",
                                                },
                                            }}
                                            >
                                            <img src={DeleteIcon} alt="" height={17} width={17} />
                                            </IconButton>
                                        </Box>
                                        </Box>

                                        <TextField
                                            label={`Subtask ${key + 1}`}
                                            value={subTask.title}
                                            error={!subTask.title.trim()}
                                            helperText={!subTask.title.trim() ? "Title is required" : " "}
                                            onChange={(e) =>
                                                handleSubTaskChange(key, "title", e.target.value)
                                            }
                                            fullWidth
                                            size="small"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                bgcolor: "background.paper",
                                                },
                                            }}
                                        />
                                    </Box>
                                    );
                                })}
                                </Box>
                        )}
                        </Box>

                        {task.subtask.length > 0 && subtasksCompleted && task.status !== "completed" && (
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2.5,
                                    bgcolor: "success.50",
                                    border: "1px solid",
                                    borderColor: "success.100",
                                }}
                                >
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                    All subtasks are complete.
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleMarkAsComplete}
                                    disabled={fetchingTask}
                                    sx={{ textTransform: "none" }}
                                >
                                    Mark task complete
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Box>
                <MobileAppBar>
                    <Box
                        sx={{
                        display: "flex",
                        width: "100%",
                        gap: 1.25,
                        p: 1,
                        bgcolor: "background.paper",
                        borderTop: "1px solid",
                        borderColor: "divider",
                        }}
                    >
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => navigate("/")}
                            disabled={loading}
                            sx={{
                                minHeight: 46,
                                px: 2,
                                borderRadius: 2,
                                borderColor: "divider",
                                color: "text.secondary",
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >Cancel</Button>

                        <Button
                        type="button"
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading || fetchingTask}
                        startIcon={
                            loading ? (
                            <CircularProgress size={18} color="inherit" />
                            ) : (
                            <Save size={18} />
                            )
                        }
                        sx={{
                            minHeight: 46,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 700,
                            boxShadow: "none",
                        }}
                        >
                        {loading ? "Saving…" : "Save changes"}
                        </Button>
                    </Box>
                </MobileAppBar>
            </>
            )}
        </Box>
        );
}