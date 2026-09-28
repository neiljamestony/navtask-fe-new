import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Button, TextField, MenuItem, Grid, LinearProgress, Divider, CircularProgress, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { updateTask } from '../../api/task/task';
import toast from 'react-hot-toast';
import { getTask } from '../../api/task/task';
import type { UTask } from '../../typescript/interface';
import { useDropzone } from 'react-dropzone'
import EditFilePreview from './EditFilePreview';
import DeleteSubTaskDesktop from '../Todo/DeleteSubTaskDesktop';
import { validFileTypes } from '../../utils/utils';
import FetchingTaskLoader from '../../assets/loader.svg'
import { ChevronLeft, Plus, Trash, UploadIcon } from 'lucide-react';

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
        <Box
            sx={{
                minHeight: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "#f6f8fb",
                p: { xs: 1.5, md: 3 },
            }}
        >
            {fetchingTask ? (
            <Box
                sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                }}
            >
                <Box
                component="img"
                src={FetchingTaskLoader}
                alt=""
                sx={{ width: { xs: 220, sm: 320 }, maxWidth: "100%" }}
                />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                Loading task…
                </Typography>
            </Box>
            ) : !task ? (
            <Box
                sx={{
                flex: 1,
                display: "grid",
                placeItems: "center",
                }}
            >
                <Typography variant="h6" color="text.secondary">
                No task found
                </Typography>
            </Box>
            ) : (
            <>
                <DeleteSubTaskDesktop
                open={openDeleteSubtask}
                proceed={handleRemoveSubTask}
                close={handleCancelSubTaskDeletionModal}
                subtaskTitle={subTaskToDelete.name}
                itemToDelete={subTaskToDelete.key}
                />

                {/* Header stays outside the scrolling form */}
                <Box
                sx={{
                    width: "100%",
                    maxWidth: 1000,
                    mx: "auto",
                    mb: 2,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                }}
                >
                <IconButton
                    size='small'
                    aria-label="Back to tasks"
                    onClick={() => navigate("/")}
                >
                    <ChevronLeft size={20} />
                </IconButton>

                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    Edit task
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    Update task details, schedule, attachments, and subtasks.
                    </Typography>
                </Box>
                </Box>

                {/* Card fills available height. Only its content area scrolls. */}
                <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 1000,
                    mx: "auto",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid",
                    borderColor: "#e3e8ef",
                    borderRadius: 3,
                    overflow: "hidden",
                }}
                >
                <Box
                    sx={{
                    flex: 1,
                    p: { xs: 2, sm: 3, md: 4 },
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {/* Task details */}
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Task details</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Priority is fixed after creation. You can update the status and task information.
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                select
                                label="Priority"
                                value={task.priority}
                                fullWidth
                                disabled
                                >
                                {priorities.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                    </MenuItem>
                                ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                select
                                label="Status"
                                value={task.status}
                                fullWidth
                                onChange={handleStatusChange}
                                >
                                {status.map((option) => (
                                    <MenuItem
                                    key={option.value}
                                    value={option.value}
                                    disabled={
                                        option.value === "completed" &&
                                        task.subtask.length > 0 &&
                                        !subtasksCompleted
                                    }
                                    >
                                    {option.label}
                                    </MenuItem>
                                ))}
                                </TextField>
                            </Grid>

                            {task.status === "completed" && (
                                <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Completion date"
                                    value={
                                    task.completed_date
                                        ? dayjs(task.completed_date).format("MM/DD/YYYY")
                                        : dayjs().format("MM/DD/YYYY")
                                    }
                                    disabled
                                    fullWidth
                                />
                                </Grid>
                            )}
                            <Grid size={12}>
                                <TextField
                                label="Title"
                                name="title"
                                value={task.title}
                                onChange={handleTextChange}
                                multiline
                                minRows={2}
                                maxRows={4}
                                fullWidth
                                error={errors.some((error) => error.key === "title")}
                                helperText={
                                    errors.find((error) => error.key === "title")?.error ?? ""
                                }
                                sx={{
                                    "& .MuiInputBase-input": {
                                    fontSize: 18,
                                    fontWeight: 600,
                                    },
                                }}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider />

                    {/* Schedule */}
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Schedule</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Review the dates associated with this task.
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Date created"
                                    value={task.created_at ? dayjs(task.created_at) : null}
                                    disabled
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                                </LocalizationProvider>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Due date"
                                    value={task.due_date ? dayjs(task.due_date) : null}
                                    onChange={(newValue) =>
                                    setTask((prev) => ({
                                        ...prev,
                                        due_date: newValue
                                        ? dayjs(newValue).format("YYYY-MM-DD")
                                        : "",
                                    }))
                                    }
                                    slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: errors.some((error) => error.key === "due_date"),
                                        helperText:
                                        errors.find((error) => error.key === "due_date")
                                            ?.error ?? "",
                                    },
                                    }}
                                />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    {/* Description */}
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Description</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Add context or instructions for this task.
                        </Typography>
                        <TextField
                        label="Description (optional)"
                        name="description"
                        value={task.description}
                        onChange={handleTextChange}
                        multiline
                        rows={4}
                        fullWidth
                        slotProps={{ htmlInput: { maxLength: 300 } }}
                        error={errors.some((error) => error.key === "description")}
                        helperText={
                            errors.find((error) => error.key === "description")?.error ??
                            `${task.description?.length ?? 0}/300`
                        }
                        />
                    </Box>
                    <Divider />
                    {/* Attachments */}
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Attachments
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Add up to 5 files, with a maximum size of 10 MB per file.
                        </Typography>
                        <Box
                            {...getRootProps()}
                            sx={{
                                p: 2,
                                border: "1.5px dashed",
                                borderColor: fileError ? "error.main" : "#cbd5e1",
                                borderRadius: 2,
                                bgcolor: "#fafcff",
                                cursor: uploading ? "default" : "pointer",
                                transition: "background-color 150ms ease, border-color 150ms ease",
                                "&:hover": {
                                borderColor: fileError ? "error.main" : "primary.main",
                                bgcolor: "#f3f8ff",
                                },
                            }}
                            >
                        <input {...getInputProps()} />

                        {uploading ? (
                            <Box sx={{ maxWidth: 440, mx: "auto", py: 1, textAlign: "center" }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Uploading {uploadedFileNames.join(", ")}
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                aria-label="Upload progress"
                            />
                            </Box>
                        ) : (
                            <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1.5,
                                py: 1,
                            }}
                            >
                            <UploadIcon size={20} color="#9e9e9e"/>
                            <Typography variant="body2">
                                <Box component="span" sx={{ color: "primary.main", fontWeight: 700 }}>
                                Browse files
                                </Box>{" "}
                                or drag and drop them here
                            </Typography>
                            </Box>
                        )}

                        {!uploading && task.attachments.length > 0 && (
                            <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1.5,
                                mt: 2,
                            }}
                            >
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

                        {fileError && (
                        <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
                            {fileError.msg}
                        </Typography>
                        )}
                    </Box>
                    <Divider />
                    {/* Subtasks */}
                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                                mb: 2,
                            }}>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                Subtasks
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                {task.subtask.length} of 10 steps
                                </Typography>
                            </Box>

                            <Button
                                type="button"
                                variant="outlined"
                                startIcon={<Plus size={20} />}
                                disabled={task.subtask.length >= 10 || task.status === "completed"}
                                onClick={handleNewSubTask}
                                sx={{ textTransform: "none", borderRadius: 2, flexShrink: 0 }}
                            >
                                Add subtask
                            </Button>
                        </Box>
                        {task.subtask.length === 0 ? (
                        <Box
                            sx={{
                                p: 2.5,
                                border: "1px dashed",
                                borderColor: "divider",
                                borderRadius: 2,
                                bgcolor: "#fafcff",
                                textAlign: "center",
                            }}>
                            <Typography variant="body2" color="text.secondary">No subtasks added yet.</Typography>
                        </Box>
                        ) : (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {task.subtask.map((subTask, key) => {
                                    const isDone = subTask.status === "done";
                                    return (
                                    <Box
                                        key={key}
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: {
                                                xs: "32px minmax(0, 1fr) 36px",
                                                sm: "36px minmax(0, 1fr) 150px 36px",
                                            },
                                            gap: 1.25,
                                            alignItems: "center",
                                            p: 1.25,
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: 2,
                                            bgcolor: isDone ? "rgba(46, 125, 50, 0.035)" : "background.paper",
                                            transition: "border-color 150ms ease, background-color 150ms ease",
                                            "&:hover": { borderColor: "primary.light" },
                                        }}>
                                        <Box
                                            sx={{
                                                width: 30,
                                                height: 30,
                                                display: "grid",
                                                placeItems: "center",
                                                borderRadius: "50%",
                                                bgcolor: isDone ? "success.light" : "grey.100",
                                                color: isDone ? "success.dark" : "text.secondary",
                                                fontSize: 13,
                                                fontWeight: 700,
                                            }}>{key + 1}
                                        </Box>

                                        <TextField
                                            label="Subtask"
                                            value={subTask.title}
                                            onChange={(e) =>
                                                handleSubTaskChange(key, "title", e.target.value)
                                            }
                                            error={!subTask.title.trim()}
                                            helperText={!subTask.title.trim() ? "Title is required" : ""}
                                            fullWidth
                                            size="small"
                                            variant="standard"
                                            slotProps={{ input: { disableUnderline: true } }}
                                            sx={{
                                                "& .MuiInputBase-root": {
                                                px: 1.25,
                                                py: 0.75,
                                                borderRadius: 1.5,
                                                bgcolor: "grey.50",
                                                },
                                                "& .MuiInputLabel-root": { display: "none" },
                                            }}
                                        />

                                        <TextField
                                            select
                                            label="Status"
                                            value={subTask.status}
                                            onChange={(e) =>
                                                handleSubTaskChange(key, "status", e.target.value)
                                            }
                                            fullWidth
                                            size="small"
                                            sx={{
                                                gridColumn: { xs: "2", sm: "auto" },
                                                gridRow: { xs: "2", sm: "auto" },
                                            }}
                                        >
                                        {subTasksDropdown.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                <Typography variant="body2" sx={{ fontSize: 13 }}>{option.label}</Typography>
                                            </MenuItem>
                                        ))}
                                        </TextField>

                                        <IconButton
                                            size="small"
                                            aria-label={`Delete ${subTask.title}`}
                                            onClick={() =>
                                                handleOpenSubTaskDeletionModal(subTask.title, key)
                                            }
                                            sx={{
                                                gridColumn: { xs: "3", sm: "4" },
                                                gridRow: { xs: "1", sm: "auto" },
                                                color: "text.secondary",
                                                "&:hover": {
                                                color: "error.main",
                                                bgcolor: "error.lighter",
                                                },
                                            }}>
                                            <Trash size={17} />
                                        </IconButton>
                                    </Box>
                                    );
                                })}
                                </Box>
                                )}
                            </Box>
                        </Box>
                    </Box>

                    {/* Actions stay visible; only the form above scrolls */}
                    <Box
                        sx={{
                        flexShrink: 0,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1.5,
                        px: { xs: 2, sm: 3, md: 4 },
                        py: 2,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        bgcolor: "#fff",
                        }}>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => navigate("/")}
                            disabled={loading}
                            sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
                        >Cancel</Button>

                        {task.subtask.length > 0 && subtasksCompleted && task.status !== "completed" ? (
                            <Button
                                type="button"
                                variant="contained"
                                onClick={handleMarkAsComplete}
                                disabled={loading || fetchingTask}
                                sx={{ textTransform: "none", borderRadius: 2, px: 3, fontWeight: 700 }}
                            >
                                Mark as complete
                            </Button>
                            ) : (
                            <Button
                                type="button"
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading || fetchingTask}
                                sx={{ textTransform: "none", borderRadius: 2, px: 3, fontWeight: 700 }}
                            >
                                {loading ? (
                                <CircularProgress size={22} color="inherit" />
                                ) : (
                                "Save changes"
                                )}
                            </Button>
                        )}
                    </Box>
                </Paper>
            </>
            )}
        </Box>
    );
}