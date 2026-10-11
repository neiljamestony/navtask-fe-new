import {
  EditTaskDesktopBoxTextStyle1,
  EditTaskDesktopBoxSizeStyle2,
  EditTaskDesktopTypographyTextStyle3,
  EditTaskDesktopPaperSurfaceStyle4,
  EditTaskDesktopBoxLayoutStyle5,
  EditTaskDesktopBoxLayoutStyle6,
  EditTaskDesktopTypographyTextStyle7,
  EditTaskDesktopTypographySpacingStyle8,
  EditTaskDesktopTextFieldInputStyle9,
  EditTaskDesktopTypographyTextStyle10,
  EditTaskDesktopTypographySpacingStyle11,
  EditTaskDesktopTypographyTextStyle12,
  EditTaskDesktopTypographySpacingStyle13,
  EditTaskDesktopTypographyTextStyle14,
  EditTaskDesktopTypographySpacingStyle15,
  EditTaskDesktopBoxSurfaceStyle16,
  EditTaskDesktopBoxSurfaceStyle17,
  EditTaskDesktopBoxLayoutStyle18,
  EditTaskDesktopBoxSurfaceStyle19,
  EditTaskDesktopBoxSizeStyle20,
  EditTaskDesktopTypographyTextStyle21,
  EditTaskDesktopTypographyTextStyle22,
  EditTaskDesktopTypographyTextStyle23,
  EditTaskDesktopBoxSurfaceStyle24,
  EditTaskDesktopBoxSurfaceStyle25,
  EditTaskDesktopBoxLayoutStyle26,
  EditTaskDesktopBoxTextStyle27,
  EditTaskDesktopBoxLayoutStyle28,
  EditTaskDesktopTypographyLayoutStyle29,
  EditTaskDesktopBoxLayoutStyle30,
  EditTaskDesktopTypographyTextStyle31,
  EditTaskDesktopButtonSurfaceStyle32,
  EditTaskDesktopBoxSurfaceStyle33,
  EditTaskDesktopBoxLayoutStyle34,
  EditTaskDesktopBoxGridStyle35,
  EditTaskDesktopBoxSurfaceStyle36,
  EditTaskDesktopTextFieldInputStyle37,
  EditTaskDesktopTextFieldGridStyle38,
  EditTaskDesktopTypographyTextStyle39,
  EditTaskDesktopIconButtonGridStyle40,
  EditTaskDesktopBoxSurfaceStyle41,
  EditTaskDesktopButtonSurfaceStyle42,
  EditTaskDesktopButtonSurfaceStyle43,
  EditTaskDesktopButtonSurfaceStyle44
} from "../Styles/Task/EditTaskDesktop/EditTaskDesktop.styles";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Button, TextField, MenuItem, Grid, Divider, CircularProgress, IconButton } from '@mui/material'
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
import { ChevronLeft, Plus, Trash, UploadCloud, UploadIcon } from 'lucide-react';
import TaskNotFound from '../NotFound/TaskNotFound';
import FetchingTask from '../NotFound/FetchingTask';

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
    const [taskNotFound, setTaskNotFound] = useState(false)
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
        setTaskNotFound(false)
        try{
            const result = await getTask(id as string);
            console.log(result)
            if(result.status === 401){
                toast.error("Session expired, please login again.");
                navigate("/login")
            }
            if(result.length < 1){
                setTask(task)
                setFetchingTask(false)
            }
            if(result.status === 500){
                setFetchingTask(false)
                setTaskNotFound(true)
            }
            setTask(result)
            setFetchingTask(false)
        }catch(error: unknown){
            setFetchingTask(false)
            setTaskNotFound(true)
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
            sx={EditTaskDesktopBoxTextStyle1}
        >
            {fetchingTask ? (
                <FetchingTask/>
            ) : taskNotFound ? (
                <TaskNotFound/>
            ) : (
            <>
                <DeleteSubTaskDesktop
                    open={openDeleteSubtask}
                    proceed={handleRemoveSubTask}
                    close={handleCancelSubTaskDeletionModal}
                    subtaskTitle={subTaskToDelete.name}
                    itemToDelete={subTaskToDelete.key}
                />
                <Box
                sx={EditTaskDesktopBoxSizeStyle2}
                >
                <IconButton
                    size='small'
                    aria-label="Back to tasks"
                    onClick={() => navigate("/")}
                >
                    <ChevronLeft size={20} />
                </IconButton>

                <Box>
                    <Typography variant="h5" sx={EditTaskDesktopTypographyTextStyle3}>Edit task</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Update task details, schedule, attachments, and subtasks.
                    </Typography>
                </Box>
                </Box>
                <Paper
                elevation={0}
                sx={EditTaskDesktopPaperSurfaceStyle4}
                >
                <Box
                    sx={EditTaskDesktopBoxLayoutStyle5}
                >
                    <Box sx={EditTaskDesktopBoxLayoutStyle6}>
                    {/* Task details */}
                    <Box>
                        <Typography variant="subtitle1" sx={EditTaskDesktopTypographyTextStyle7}>Task details</Typography>
                        <Typography variant="body2" color="text.secondary" sx={EditTaskDesktopTypographySpacingStyle8}>
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
                                    value={task.status ?? ""}
                                    fullWidth
                                    onChange={handleStatusChange}
                                >
                                    {status.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={task.status === option.value ? task.status : option.value}
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
                                sx={EditTaskDesktopTextFieldInputStyle9}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    {/* Schedule */}
                    <Box>
                        <Typography variant="subtitle1" sx={EditTaskDesktopTypographyTextStyle10}>Schedule</Typography>
                        <Typography variant="body2" color="text.secondary" sx={EditTaskDesktopTypographySpacingStyle11}>
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
                        <Typography variant="subtitle1" sx={EditTaskDesktopTypographyTextStyle12}>Description</Typography>
                        <Typography variant="body2" color="text.secondary" sx={EditTaskDesktopTypographySpacingStyle13}>
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
                        <Typography variant="subtitle1" sx={EditTaskDesktopTypographyTextStyle14}>Attachments</Typography>
                        <Typography variant="body2" color="text.secondary" sx={EditTaskDesktopTypographySpacingStyle15}>
                            Add up to 5 files, with a maximum size of 10 MB per file.
                        </Typography>
                        <Box
                            {...getRootProps()}
                            sx={EditTaskDesktopBoxSurfaceStyle16({ fileError: fileError, uploading: uploading })}
                            >
                        <input {...getInputProps()} />

                        {uploading ? (
                            <Box
                                sx={EditTaskDesktopBoxSurfaceStyle17}
                            >
                                <Box sx={EditTaskDesktopBoxLayoutStyle18}>
                                <Box
                                    sx={EditTaskDesktopBoxSurfaceStyle19}
                                >
                                    <UploadCloud size={22} />
                                </Box>

                                <Box sx={EditTaskDesktopBoxSizeStyle20}>
                                    <Typography variant="body2" sx={EditTaskDesktopTypographyTextStyle21}>
                                    Uploading files
                                    </Typography>
                                    <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={EditTaskDesktopTypographyTextStyle22}
                                    title={uploadedFileNames.join(", ")}
                                    >
                                    {uploadedFileNames.join(", ")}
                                    </Typography>
                                </Box>

                                <Typography
                                    variant="body2"
                                    color="primary.main"
                                    sx={EditTaskDesktopTypographyTextStyle23}
                                >
                                    {Math.round(progress)}%
                                </Typography>
                                </Box>

                                <Box
                                role="progressbar"
                                aria-label="File upload progress"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={Math.round(progress)}
                                sx={EditTaskDesktopBoxSurfaceStyle24}
                                >
                                <Box
                                    sx={EditTaskDesktopBoxSurfaceStyle25({ progress: progress })}
                                />
                                </Box>
                            </Box>
                        ) : (
                            <Box
                            sx={EditTaskDesktopBoxLayoutStyle26}
                            >
                            <UploadIcon size={20} color="#9e9e9e"/>
                            <Typography variant="body2">
                                <Box component="span" sx={EditTaskDesktopBoxTextStyle27}>
                                Browse files
                                </Box>{" "}
                                or drag and drop them here
                            </Typography>
                            </Box>
                        )}

                        {!uploading && task.attachments.length > 0 && (
                            <Box
                            sx={EditTaskDesktopBoxLayoutStyle28}
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
                        <Typography variant="caption" color="error" sx={EditTaskDesktopTypographyLayoutStyle29}>
                            {fileError.msg}
                        </Typography>
                        )}
                    </Box>
                    <Divider />
                    {/* Subtasks */}
                    <Box>
                        <Box
                            sx={EditTaskDesktopBoxLayoutStyle30}>
                            <Box>
                                <Typography variant="subtitle1" sx={EditTaskDesktopTypographyTextStyle31}>
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
                                sx={EditTaskDesktopButtonSurfaceStyle32}
                            >
                                Add subtask
                            </Button>
                        </Box>
                        {task.subtask.length === 0 ? (
                        <Box
                            sx={EditTaskDesktopBoxSurfaceStyle33}>
                            <Typography variant="body2" color="text.secondary">No subtasks added yet.</Typography>
                        </Box>
                        ) : (
                            <Box sx={EditTaskDesktopBoxLayoutStyle34}>
                                {task.subtask.map((subTask, key) => {
                                    const isDone = subTask.status === "done";
                                    return (
                                    <Box
                                        key={key}
                                        sx={EditTaskDesktopBoxGridStyle35({ isDone: isDone })}>
                                        <Box
                                            sx={EditTaskDesktopBoxSurfaceStyle36({ isDone: isDone })}>{key + 1}
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
                                            sx={EditTaskDesktopTextFieldInputStyle37}
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
                                            sx={EditTaskDesktopTextFieldGridStyle38}
                                        >
                                        {subTasksDropdown.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                <Typography variant="body2" sx={EditTaskDesktopTypographyTextStyle39}>{option.label}</Typography>
                                            </MenuItem>
                                        ))}
                                        </TextField>

                                        <IconButton
                                            size="small"
                                            aria-label={`Delete ${subTask.title}`}
                                            onClick={() =>
                                                handleOpenSubTaskDeletionModal(subTask.title, key)
                                            }
                                            sx={EditTaskDesktopIconButtonGridStyle40}>
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
                        sx={EditTaskDesktopBoxSurfaceStyle41}>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => navigate("/")}
                            disabled={loading}
                            sx={EditTaskDesktopButtonSurfaceStyle42}
                        >Cancel</Button>

                        {task.subtask.length > 0 && subtasksCompleted && task.status !== "completed" ? (
                            <Button
                                type="button"
                                variant="contained"
                                onClick={handleMarkAsComplete}
                                disabled={loading || fetchingTask}
                                sx={EditTaskDesktopButtonSurfaceStyle43}
                            >
                                Mark as complete
                            </Button>
                            ) : (
                            <Button
                                type="button"
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading || fetchingTask}
                                sx={EditTaskDesktopButtonSurfaceStyle44}
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
