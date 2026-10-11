import {
  NewTaskMobileBoxTextStyle1,
  NewTaskMobileAppBarSurfaceStyle2,
  NewTaskMobileToolbarSizeStyle3,
  NewTaskMobileIconButtonSurfaceStyle4,
  NewTaskMobileTypographyTextStyle5,
  NewTaskMobileBoxSizeStyle6,
  NewTaskMobileBoxLayoutStyle7,
  NewTaskMobileBoxGridStyle8,
  NewTaskMobileBoxSurfaceStyle9,
  NewTaskMobileTypographyLayoutStyle10,
  NewTaskMobileBoxSurfaceStyle11,
  NewTaskMobileTypographyTextStyle12,
  NewTaskMobileTypographyTextStyle13,
  NewTaskMobileBoxSurfaceStyle14,
  NewTaskMobileTypographyTextStyle15,
  NewTaskMobileBoxGridStyle16,
  NewTaskMobileBoxSurfaceStyle17,
  NewTaskMobileBoxSurfaceStyle18,
  NewTaskMobileTypographyTextStyle19,
  NewTaskMobileBoxSurfaceStyle20,
  NewTaskMobileBoxLayoutStyle21,
  NewTaskMobileTypographyTextStyle22,
  NewTaskMobileBoxSurfaceStyle23,
  NewTaskMobileTypographyTextStyle24,
  NewTaskMobileTextFieldInputStyle25,
  NewTaskMobileBoxSurfaceStyle26,
  NewTaskMobileBoxLayoutStyle27,
  NewTaskMobileTypographyTextStyle28,
  NewTaskMobileBoxSurfaceStyle29,
  NewTaskMobileTypographySpacingStyle30,
  NewTaskMobileLinearProgressSurfaceStyle31,
  NewTaskMobileBoxLayoutStyle32,
  NewTaskMobileBoxSizeStyle33,
  NewTaskMobileBoxTextStyle34,
  NewTaskMobileTypographyLayoutStyle35,
  NewTaskMobileBoxLayoutStyle36,
  NewTaskMobileBoxSurfaceStyle37,
  NewTaskMobileBoxLayoutStyle38,
  NewTaskMobileTypographyTextStyle39,
  NewTaskMobileButtonSurfaceStyle40,
  NewTaskMobileBoxLayoutStyle41,
  NewTaskMobileBoxSurfaceStyle42,
  NewTaskMobileBoxLayoutStyle43,
  NewTaskMobileBoxSurfaceStyle44,
  NewTaskMobileChipIconStyle45,
  NewTaskMobileBoxLayoutStyle46,
  NewTaskMobileIconButtonTextStyle47,
  NewTaskMobileTextFieldInputStyle48,
  NewTaskMobileButtonSurfaceStyle49
} from "../Styles/Task/NewTaskMobile/NewTaskMobile.styles";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, LinearProgress, CircularProgress, IconButton, AppBar, Toolbar, Chip } from '@mui/material'
import { ArrowBackIosNewRounded, Add } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { ITask } from '../../typescript/interface';
import { createTask } from '../../api/task/task';
import { limitText, validFileTypes } from '../../utils/utils';
import toast from 'react-hot-toast';
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { useDropzone } from 'react-dropzone'
import { MobileAppBar } from '../MobileAppBar';

// ICONS
import UploadIcon from '../../assets/Icons/Upload.svg';

// COMPONENTS
import FilePreview from './FilePreview';
import DropdownDialog from '../Dialog/Mobile/Dropdown';
import { prioritiesIcons, statusIcons } from "../Todo/DesktopTodo";

// STYLES
import { CalendarClock, CalendarDays, Check, Circle, Trash } from 'lucide-react';

dayjs.extend(customParseFormat);

export default function NewTaskMobile() {
    const [loading, setLoading] = useState(false);
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

    const currentPriority = prioritiesIcons[task.priority as keyof typeof prioritiesIcons];
    const currentStatus = statusIcons[task.status as keyof typeof statusIcons];

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
        <Box sx={NewTaskMobileBoxTextStyle1}>
            <AppBar
            position="fixed"
            color="inherit"
            elevation={0}
            sx={NewTaskMobileAppBarSurfaceStyle2}
            >
            <Toolbar sx={NewTaskMobileToolbarSizeStyle3}>
                <IconButton
                aria-label="Back to tasks"
                onClick={() => navigate("/")}
                size="small"
                sx={NewTaskMobileIconButtonSurfaceStyle4}
                >
                <ArrowBackIosNewRounded fontSize="small" />
                </IconButton>
                <Box>
                <Typography variant="subtitle1" sx={NewTaskMobileTypographyTextStyle5}>
                    Create task
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Add details and organize your work
                </Typography>
                </Box>
            </Toolbar>
            </AppBar>

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
            sx={NewTaskMobileBoxSizeStyle6}
            >
            <Box sx={NewTaskMobileBoxLayoutStyle7}>
                {/* Priority and status */}
                <Box sx={NewTaskMobileBoxGridStyle8}>
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
                        sx={NewTaskMobileBoxSurfaceStyle9}
                        >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={NewTaskMobileTypographyLayoutStyle10}
                        >
                            {label}
                        </Typography>

                        {item ? (
                            <Box
                            sx={NewTaskMobileBoxSurfaceStyle11({ item: item })}
                            >
                            {item.icon}
                            <Typography variant="caption" sx={NewTaskMobileTypographyTextStyle12}>
                                {item.label}
                            </Typography>
                            </Box>
                        ) : (
                            <Typography variant="body2" sx={NewTaskMobileTypographyTextStyle13}>
                            —
                            </Typography>
                        )}
                        </Box>
                    ))}
                </Box>

                {/* Title */}
                <Box
                    sx={NewTaskMobileBoxSurfaceStyle14}
                >
                <Typography variant="subtitle2" sx={NewTaskMobileTypographyTextStyle15}>
                    Task title
                </Typography>
                <TextField
                    label="What needs to be done?"
                    name="title"
                    value={task.title}
                    onChange={handleTextChange}
                    required
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={4}
                    slotProps={{ htmlInput: { maxLength: 25 } }}
                    error={errors.some((error) => error.key === "title")}
                    helperText={errors.find((error) => error.key === "title")?.error ?? ""}
                />
                </Box>

                {/* Schedule */}
                <Box
                    sx={NewTaskMobileBoxGridStyle16}
                    >
                    <Box
                        sx={NewTaskMobileBoxSurfaceStyle17}
                    >
                        <Box
                        sx={NewTaskMobileBoxSurfaceStyle18}
                        >
                        <CalendarDays size={17} />
                        </Box>

                        <Box>
                        <Typography variant="caption" color="text.secondary">
                            Created
                        </Typography>
                        <Typography variant="body2" sx={NewTaskMobileTypographyTextStyle19}>
                            {dayjs().format("D MMM YYYY")}
                        </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={NewTaskMobileBoxSurfaceStyle20({ errors: errors })}
                    >
                        <Box sx={NewTaskMobileBoxLayoutStyle21}>
                            <CalendarClock size={15} color="#2563eb" />
                            <Typography variant="caption" sx={NewTaskMobileTypographyTextStyle22}>
                                Due date
                            </Typography>
                        </Box>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Select a date"
                            value={task.due_date ? dayjs(task.due_date) : null}
                            onChange={handleDueDateChange}
                            slotProps={{
                            textField: {
                                fullWidth: true,
                                size: "small",
                                error: errors.some((error) => error.key === "due_date"),
                                helperText:
                                errors.find((error) => error.key === "due_date")?.error ?? " ",
                                sx: {
                                "& .MuiOutlinedInput-root": { bgcolor: "background.paper" },
                                "& .MuiFormHelperText-root": { mx: 0, fontSize: 11 },
                                },
                            },
                            }}
                        />
                        </LocalizationProvider>
                    </Box>
                    </Box>

                {/* Description */}
                <Box
                sx={NewTaskMobileBoxSurfaceStyle23}
                >
                <Typography variant="subtitle2" sx={NewTaskMobileTypographyTextStyle24}>
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
                    slotProps={{ htmlInput: { maxLength: 300 } }}
                    error={errors.some((error) => error.key === "description")}
                    helperText={
                        errors.find((error) => error.key === "description")?.error ??
                        `${task.description?.length ?? 0}/300`
                    }
                    sx={NewTaskMobileTextFieldInputStyle25}
                    />
                </Box>

                {/* Attachments */}
                <Box
                sx={NewTaskMobileBoxSurfaceStyle26}
                >
                <Box sx={NewTaskMobileBoxLayoutStyle27}>
                    <Box>
                    <Typography variant="subtitle2" sx={NewTaskMobileTypographyTextStyle28}>
                        Attachments
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Up to 5 files · 10 MB max each
                    </Typography>
                    </Box>
                    <Chip size="small" label={`${task.attachments.length}/5`} />
                </Box>

                <Box
                    {...getRootProps()}
                    sx={NewTaskMobileBoxSurfaceStyle29({ fileError: fileError, uploading: uploading })}
                >
                    <input {...getInputProps()} />

                    {uploading ? (
                    <>
                        <Typography variant="body2" sx={NewTaskMobileTypographySpacingStyle30}>
                        Uploading {uploadedFileNames.join(", ")}
                        </Typography>
                        <LinearProgress
                        variant="determinate"
                        value={progress}
                        aria-label="Upload progress"
                        sx={NewTaskMobileLinearProgressSurfaceStyle31}
                        />
                    </>
                    ) : (
                    <Box sx={NewTaskMobileBoxLayoutStyle32}>
                        <Box
                        component="img"
                        src={UploadIcon}
                        alt=""
                        sx={NewTaskMobileBoxSizeStyle33}
                        />
                        <Typography variant="body2">
                        <Box component="span" sx={NewTaskMobileBoxTextStyle34}>
                            Tap to choose files
                        </Box>{" "}
                        or drop them here
                        </Typography>
                    </Box>
                    )}
                </Box>

                {fileError && (
                    <Typography variant="caption" color="error" sx={NewTaskMobileTypographyLayoutStyle35}>
                    {fileError.msg}
                    </Typography>
                )}

                {!uploading && task.attachments.length > 0 && (
                    <Box sx={NewTaskMobileBoxLayoutStyle36}>
                    {task.attachments.map((file, key) => (
                        <FilePreview
                        key={key}
                        file={file}
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
                    sx={NewTaskMobileBoxSurfaceStyle37}
                >
                <Box
                    sx={NewTaskMobileBoxLayoutStyle38}
                >
                    <Box>
                    <Typography variant="subtitle2" sx={NewTaskMobileTypographyTextStyle39}>
                        Subtasks
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {task.subTask.length} of 10
                    </Typography>
                    </Box>

                    <Button
                        type="button"
                        variant="outlined"
                        size="small"
                        startIcon={<Add />}
                        disabled={task.subTask.length >= 10}
                        onClick={handleNewSubTask}
                        sx={NewTaskMobileButtonSurfaceStyle40}
                    >Add</Button>
                </Box>

                {task.subTask.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                    No subtasks added.
                    </Typography>
                ) : (
                    <Box sx={NewTaskMobileBoxLayoutStyle41}>
                        {task.subTask.map((subTask, key) => {
                            const isDone = subTask.status === "done";

                            return (
                            <Box
                                key={key}
                                sx={NewTaskMobileBoxSurfaceStyle42({ isDone: isDone })}
                            >
                                <Box
                                    sx={NewTaskMobileBoxLayoutStyle43}>
                                    <Box
                                        sx={NewTaskMobileBoxSurfaceStyle44({ isDone: isDone })}
                                    >
                                        {key + 1}
                                    </Box>

                                    <Chip
                                        size="small"
                                        icon={isDone ? <Check size={13} /> : <Circle size={12} />}
                                        label={isDone ? "Done · tap to reopen" : "Not done · tap to complete"}
                                        aria-label={isDone ? "Done. Tap to mark as not done" : "Not done. Tap to mark as done"}
                                        onClick={() =>
                                            handleSubTaskChange(key, "status", isDone ? "not-done" : "done")
                                        }
                                        sx={NewTaskMobileChipIconStyle45({ isDone: isDone })}
                                    />

                                    <Box sx={NewTaskMobileBoxLayoutStyle46} />

                                    <IconButton
                                        size="small"
                                        aria-label={`Remove subtask ${key + 1}`}
                                        onClick={() => handleRemoveSubTask(key)}
                                        sx={NewTaskMobileIconButtonTextStyle47}
                                    >
                                        <Trash size={15}/>
                                    </IconButton>
                                </Box>

                                <TextField
                                    label={`Subtask ${key + 1}`}
                                    value={subTask.title}
                                    onChange={(e) => handleSubTaskChange(key, "title", e.target.value)}
                                    error={!subTask.title.trim()}
                                    helperText={!subTask.title.trim() ? "Title is required" : " "}
                                    fullWidth
                                    size="small"
                                    sx={NewTaskMobileTextFieldInputStyle48}
                                    />
                            </Box>
                            );
                        })}
                        </Box>
                    )}
                </Box>
            </Box>
            </Box>

            <MobileAppBar>
                <Button
                    type="button"
                    variant="contained"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={NewTaskMobileButtonSurfaceStyle49}
                >
                    {loading ? <CircularProgress size={22} color="inherit" /> : "Create task"}
                </Button>
            </MobileAppBar>
        </Box>
    );
}