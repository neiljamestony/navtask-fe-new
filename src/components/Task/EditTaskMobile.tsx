import {
  EditTaskMobileBoxTextStyle1,
  EditTaskMobileAppBarSurfaceStyle2,
  EditTaskMobileToolbarSizeStyle3,
  EditTaskMobileTypographyTextStyle4,
  EditTaskMobileBoxSizeStyle5,
  EditTaskMobileBoxTextStyle6,
  EditTaskMobileTypographyTextStyle7,
  EditTaskMobileTypographySpacingStyle8,
  EditTaskMobileButtonTextStyle9,
  EditTaskMobileBoxSizeStyle10,
  EditTaskMobileBoxLayoutStyle11,
  EditTaskMobileBoxGridStyle12,
  EditTaskMobileBoxSurfaceStyle13,
  EditTaskMobileTypographyLayoutStyle14,
  EditTaskMobileBoxSurfaceStyle15,
  EditTaskMobileTypographyTextStyle16,
  EditTaskMobileTypographyTextStyle17,
  EditTaskMobileBoxSurfaceStyle18,
  EditTaskMobileTypographyTextStyle19,
  EditTaskMobileBoxSurfaceStyle20,
  EditTaskMobileBoxLayoutStyle21,
  EditTaskMobileTypographyTextStyle22,
  EditTaskMobileBoxGridStyle23,
  EditTaskMobileBoxSurfaceStyle24,
  EditTaskMobileTypographyTextStyle25,
  EditTaskMobileBoxSurfaceStyle26,
  EditTaskMobileTypographyTextStyle27,
  EditTaskMobileBoxSurfaceStyle28,
  EditTaskMobileBoxLayoutStyle29,
  EditTaskMobileTypographyTextStyle30,
  EditTaskMobileBoxSurfaceStyle31,
  EditTaskMobileBoxSurfaceStyle32,
  EditTaskMobileTypographyTextStyle33,
  EditTaskMobileLinearProgressSurfaceStyle34,
  EditTaskMobileBoxLayoutStyle35,
  EditTaskMobileBoxSurfaceStyle36,
  EditTaskMobileBoxSizeStyle37,
  EditTaskMobileTypographyTextStyle38,
  EditTaskMobileTypographyLayoutStyle39,
  EditTaskMobileBoxLayoutStyle40,
  EditTaskMobileBoxSurfaceStyle41,
  EditTaskMobileBoxLayoutStyle42,
  EditTaskMobileTypographyTextStyle43,
  EditTaskMobileButtonSurfaceStyle44,
  EditTaskMobileBoxLayoutStyle45,
  EditTaskMobileBoxSurfaceStyle46,
  EditTaskMobileBoxLayoutStyle47,
  EditTaskMobileBoxLayoutStyle48,
  EditTaskMobileBoxSurfaceStyle49,
  EditTaskMobileChipIconStyle50,
  EditTaskMobileBoxLayoutStyle51,
  EditTaskMobileIconButtonTextStyle52,
  EditTaskMobileTextFieldInputStyle53,
  EditTaskMobileBoxSurfaceStyle54,
  EditTaskMobileTypographyTextStyle55,
  EditTaskMobileButtonTextStyle56,
  EditTaskMobileBoxSurfaceStyle57,
  EditTaskMobileButtonSurfaceStyle58,
  EditTaskMobileButtonSurfaceStyle59
} from "../Styles/Task/EditTaskMobile/EditTaskMobile.styles";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, TextField, LinearProgress, CircularProgress, IconButton, AppBar, Toolbar, Chip } from '@mui/material'
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
import { limitText, validFileTypes } from '../../utils/utils';
import DeleteSubTask from '../Todo/DeleteSubTask';
import DropdownDialog from '../Dialog/Mobile/Dropdown';
import { MobileAppBar } from '../MobileAppBar';
import { prioritiesIcons, statusIcons } from '../Todo/DesktopTodo';
import { CalendarDays, Check, Circle, Save, Trash } from 'lucide-react';
import FetchingTask from '../NotFound/FetchingTask';

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

    console.log(task)

   return (
        <Box sx={EditTaskMobileBoxTextStyle1}>
            <AppBar
            position="fixed"
            color="inherit"
            elevation={0}
            sx={EditTaskMobileAppBarSurfaceStyle2}
            >
            <Toolbar sx={EditTaskMobileToolbarSizeStyle3}>
                <IconButton aria-label="Back to tasks" onClick={() => navigate("/")}>
                <ArrowBackIosNewRounded fontSize="small" />
                </IconButton>
                <Box>
                <Typography variant="subtitle1" sx={EditTaskMobileTypographyTextStyle4}>
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
                    sx={EditTaskMobileBoxSizeStyle5}
                >
                    <FetchingTask />
                </Box>
            ) : !task || !task.title ? (
            <Box
                sx={EditTaskMobileBoxTextStyle6}
            >
                <Box>
                <Typography variant="h6" sx={EditTaskMobileTypographyTextStyle7}>
                    Task not found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={EditTaskMobileTypographySpacingStyle8}>
                    The task may have been deleted or the link may be invalid.
                </Typography>
                <Button variant="contained" onClick={() => navigate("/")} sx={EditTaskMobileButtonTextStyle9}>
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
                    sx={EditTaskMobileBoxSizeStyle10}
                >
                    <Box sx={EditTaskMobileBoxLayoutStyle11}>
                        <Box sx={EditTaskMobileBoxGridStyle12}>
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
                                    sx={EditTaskMobileBoxSurfaceStyle13}
                                >
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={EditTaskMobileTypographyLayoutStyle14}
                                >
                                    {label}
                                </Typography>

                                {item ? (
                                    <Box
                                        sx={EditTaskMobileBoxSurfaceStyle15({ item: item })}
                                    >
                                    {item.icon}
                                    <Typography variant="caption" sx={EditTaskMobileTypographyTextStyle16}>
                                        {item.label}
                                    </Typography>
                                    </Box>
                                ) : (
                                    <Typography variant="body2" sx={EditTaskMobileTypographyTextStyle17}>—</Typography>
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
                            sx={EditTaskMobileBoxSurfaceStyle18}
                        >
                            <Typography variant="subtitle2" sx={EditTaskMobileTypographyTextStyle19}>
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
                            sx={EditTaskMobileBoxSurfaceStyle20}
                            >
                            <Box sx={EditTaskMobileBoxLayoutStyle21}>
                                <CalendarDays size={18} color="#64748b" />
                                <Typography variant="subtitle2" sx={EditTaskMobileTypographyTextStyle22}>
                                Schedule
                                </Typography>
                            </Box>

                            <Box
                                sx={EditTaskMobileBoxGridStyle23}
                            >
                                <Box
                                    sx={EditTaskMobileBoxSurfaceStyle24}
                                    >
                                    <CalendarDays size={17} color="#64748b" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                            Created
                                            </Typography>
                                            <Typography variant="body2" sx={EditTaskMobileTypographyTextStyle25}>
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
                            sx={EditTaskMobileBoxSurfaceStyle26}>
                            <Typography variant="subtitle2" sx={EditTaskMobileTypographyTextStyle27}>
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
                            sx={EditTaskMobileBoxSurfaceStyle28}
                            >
                            <Box
                                sx={EditTaskMobileBoxLayoutStyle29}
                            >
                                <Box>
                                <Typography variant="subtitle2" sx={EditTaskMobileTypographyTextStyle30}>
                                    Attachments
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Up to 5 files · 10 MB max per file
                                </Typography>
                                </Box>

                                <Box
                                sx={EditTaskMobileBoxSurfaceStyle31}
                                >
                                {task.attachments.length}/5
                                </Box>
                            </Box>

                            <Box
                                {...getRootProps()}
                                sx={EditTaskMobileBoxSurfaceStyle32({ fileError: fileError, uploading: uploading })}
                            >
                                <input {...getInputProps()} />
                                {uploading ? (
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={EditTaskMobileTypographyTextStyle33}
                                    >
                                    Uploading {uploadedFileNames.join(", ")}
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progress}
                                        aria-label="Upload progress"
                                        sx={EditTaskMobileLinearProgressSurfaceStyle34}
                                        />
                                </Box>
                                ) : (
                                <Box sx={EditTaskMobileBoxLayoutStyle35}>
                                    <Box
                                    sx={EditTaskMobileBoxSurfaceStyle36}
                                    >
                                    <Box
                                        component="img"
                                        src={UploadIcon}
                                        alt=""
                                        sx={EditTaskMobileBoxSizeStyle37}
                                    />
                                    </Box>

                                    <Typography variant="body2" sx={EditTaskMobileTypographyTextStyle38}>Tap to add files</Typography>
                                    <Typography variant="caption" color="text.secondary">or drag and drop them here</Typography>
                                </Box>
                                )}
                            </Box>

                            {fileError && (
                                <Typography variant="caption" color="error" sx={EditTaskMobileTypographyLayoutStyle39}>
                                {fileError.msg}
                                </Typography>
                            )}

                            {!uploading && task.attachments.length > 0 && (
                                <Box sx={EditTaskMobileBoxLayoutStyle40}>
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
                            sx={EditTaskMobileBoxSurfaceStyle41}>
                            <Box
                                sx={EditTaskMobileBoxLayoutStyle42}>
                            <Box>
                                <Typography variant="subtitle2" sx={EditTaskMobileTypographyTextStyle43}>Subtasks</Typography>
                                <Typography variant="caption" color="text.secondary">{task.subtask.length} of 10 </Typography>
                            </Box>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Add />}
                                disabled={task.subtask.length >= 10 || task.status === "completed"}
                                onClick={handleNewSubTask}
                                sx={EditTaskMobileButtonSurfaceStyle44}
                                >Add
                            </Button>
                        </Box>

                        {task.subtask.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                No subtasks added.
                            </Typography>
                        ) : (
                            <Box sx={EditTaskMobileBoxLayoutStyle45}>
                                {task.subtask.map((subTask, key) => {
                                    const isDone = subTask.status === "done";
                                    return (
                                        <Box
                                            key={key}
                                            sx={EditTaskMobileBoxSurfaceStyle46({ isDone: isDone })}
                                        >
                                            <Box
                                                sx={EditTaskMobileBoxLayoutStyle47}
                                            >
                                            <Box sx={EditTaskMobileBoxLayoutStyle48}>
                                                <Box
                                                    sx={EditTaskMobileBoxSurfaceStyle49({ isDone: isDone })}
                                                >
                                                    {key + 1}
                                                </Box>

                                                <Chip
                                                    size="small"
                                                    icon={isDone ? <Check size={13} /> : <Circle size={12} />}
                                                    label={isDone ? "Done · tap to reopen" : "Not done · tap to complete"}
                                                    aria-label={
                                                    isDone
                                                        ? `Subtask ${key + 1} is done. Tap to mark not done`
                                                        : `Subtask ${key + 1} is not done. Tap to mark done`
                                                    }
                                                    onClick={() =>
                                                    handleSubTaskChange(key, "status", isDone ? "not-done" : "done")
                                                    }
                                                    sx={EditTaskMobileChipIconStyle50({ isDone: isDone })}
                                                />
                                                </Box>

                                                <Box sx={EditTaskMobileBoxLayoutStyle51}>
                                                    <IconButton
                                                        size="small"
                                                        aria-label={`Delete subtask ${key + 1}`}
                                                        onClick={() =>
                                                            handleOpenSubTaskDeletionModal(subTask.title, key)
                                                        }
                                                        sx={EditTaskMobileIconButtonTextStyle52}
                                                    >
                                                        <Trash size={15}/>
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
                                                sx={EditTaskMobileTextFieldInputStyle53}
                                            />
                                        </Box>
                                    );
                                })}
                                </Box>
                            )}
                            </Box>

                        {task.subtask.length > 0 && subtasksCompleted && task.status !== "completed" && (
                            <Box
                                sx={EditTaskMobileBoxSurfaceStyle54}
                                >
                                <Typography variant="body2" sx={EditTaskMobileTypographyTextStyle55}>
                                    All subtasks are complete.
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleMarkAsComplete}
                                    disabled={fetchingTask}
                                    sx={EditTaskMobileButtonTextStyle56}
                                >
                                    Mark task complete
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Box>
                <MobileAppBar>
                    <Box
                        sx={EditTaskMobileBoxSurfaceStyle57}
                    >
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => navigate("/")}
                            disabled={loading}
                            sx={EditTaskMobileButtonSurfaceStyle58}
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
                        sx={EditTaskMobileButtonSurfaceStyle59}
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