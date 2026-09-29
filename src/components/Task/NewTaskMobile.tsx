import React, { useState, useRef, useEffect } from 'react';
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
        <Box sx={{ minHeight: "100dvh", bgcolor: "#f6f8fb", pb: 10 }}>
            <AppBar
            position="fixed"
            color="inherit"
            elevation={0}
            sx={{
                bgcolor: "rgba(255,255,255,0.96)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid",
                borderColor: "divider",
            }}
            >
            <Toolbar sx={{ minHeight: 58, gap: 1 }}>
                <IconButton
                aria-label="Back to tasks"
                onClick={() => navigate("/")}
                size="small"
                sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
                >
                <ArrowBackIosNewRounded fontSize="small" />
                </IconButton>
                <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
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
            sx={{
                width: "100%",
                maxWidth: 640,
                boxSizing: "border-box",
                mx: "auto",
                px: 2,
                pt: 9,
                pb: 3,
            }}
            >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
                {/* Priority and status */}
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

                {/* Title */}
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
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1.4fr" },
                        gap: 1.25,
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
                        borderRadius: 2.5,
                        bgcolor: "background.paper",
                        }}
                    >
                        <Box
                        sx={{
                            width: 36,
                            height: 36,
                            flexShrink: 0,
                            display: "grid",
                            placeItems: "center",
                            borderRadius: 1.5,
                            bgcolor: "grey.100",
                            color: "text.secondary",
                        }}
                        >
                        <CalendarDays size={17} />
                        </Box>

                        <Box>
                        <Typography variant="caption" color="text.secondary">
                            Created
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {dayjs().format("D MMM YYYY")}
                        </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                        p: 1.25,
                        border: "1px solid",
                        borderColor: errors.some((error) => error.key === "due_date")
                            ? "error.main"
                            : "primary.light",
                        borderRadius: 2.5,
                        bgcolor: "primary.50",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1 }}>
                            <CalendarClock size={15} color="#2563eb" />
                            <Typography variant="caption" sx={{ color: "primary.dark", fontWeight: 700 }}>
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
                sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2.5,
                    bgcolor: "background.paper",
                }}
                >
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
                    slotProps={{ htmlInput: { maxLength: 300 } }}
                    error={errors.some((error) => error.key === "description")}
                    helperText={
                        errors.find((error) => error.key === "description")?.error ??
                        `${task.description?.length ?? 0}/300`
                    }
                    sx={{
                        "& .MuiInputBase-input": {
                        fontSize: 14,
                        lineHeight: 1.5,
                        },
                        "& .MuiInputLabel-root": {
                        fontSize: 14,
                        },
                        "& .MuiFormHelperText-root": {
                        fontSize: 11,
                        },
                    }}
                    />
                </Box>

                {/* Attachments */}
                <Box
                sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2.5,
                    bgcolor: "background.paper",
                }}
                >
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mb: 1.5 }}>
                    <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
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
                    sx={{
                    p: 2.5,
                    border: "1px dashed",
                    borderColor: fileError ? "error.main" : "primary.light",
                    borderRadius: 2,
                    bgcolor: fileError ? "error.50" : "primary.50",
                    textAlign: "center",
                    cursor: uploading ? "default" : "pointer",
                    }}
                >
                    <input {...getInputProps()} />

                    {uploading ? (
                    <>
                        <Typography variant="body2" sx={{ mb: 1, overflowWrap: "anywhere" }}>
                        Uploading {uploadedFileNames.join(", ")}
                        </Typography>
                        <LinearProgress
                        variant="determinate"
                        value={progress}
                        aria-label="Upload progress"
                        sx={{ borderRadius: 5, height: 6 }}
                        />
                    </>
                    ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                        <Box
                        component="img"
                        src={UploadIcon}
                        alt=""
                        sx={{ width: 28, height: 28, objectFit: "contain" }}
                        />
                        <Typography variant="body2">
                        <Box component="span" sx={{ color: "primary.main", fontWeight: 700 }}>
                            Tap to choose files
                        </Box>{" "}
                        or drop them here
                        </Typography>
                    </Box>
                    )}
                </Box>

                {fileError && (
                    <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
                    {fileError.msg}
                    </Typography>
                )}

                {!uploading && task.attachments.length > 0 && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1.5 }}>
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
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    mb: 1.5,
                    }}
                >
                    <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
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
                        sx={{ textTransform: "none", borderRadius: 2 }}
                    >Add</Button>
                </Box>

                {task.subTask.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                    No subtasks added.
                    </Typography>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                        {task.subTask.map((subTask, key) => {
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
                                        gap: 1,
                                        mb: 1.25,
                                    }}>
                                    <Box
                                        sx={{
                                        width: 26,
                                        height: 26,
                                        flexShrink: 0,
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

                                    <Chip
                                        size="small"
                                        icon={isDone ? <Check size={13} /> : <Circle size={12} />}
                                        label={isDone ? "Done · tap to reopen" : "Not done · tap to complete"}
                                        aria-label={isDone ? "Done. Tap to mark as not done" : "Not done. Tap to mark as done"}
                                        onClick={() =>
                                            handleSubTaskChange(key, "status", isDone ? "not-done" : "done")
                                        }
                                        sx={{
                                            height: 28,
                                            borderRadius: 10,
                                            fontSize: 11,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            bgcolor: isDone ? "success.50" : "grey.100",
                                            color: isDone ? "success.dark" : "text.secondary",
                                            border: "1px solid",
                                            borderColor: isDone ? "success.200" : "divider",
                                            "& .MuiChip-icon": { color: "inherit", ml: 0.75 },
                                            "&:hover": { bgcolor: isDone ? "success.100" : "grey.200" },
                                        }}
                                    />

                                    <Box sx={{ flex: 1 }} />

                                    <IconButton
                                        size="small"
                                        aria-label={`Remove subtask ${key + 1}`}
                                        onClick={() => handleRemoveSubTask(key)}
                                        sx={{
                                        color: "text.secondary",
                                        }}
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
                                    sx={{
                                        mt: 2,
                                        mb: -3,
                                        "& .MuiOutlinedInput-root": {
                                        bgcolor: "background.paper",
                                        },
                                        "& .MuiInputBase-input": {
                                        fontSize: 14,
                                        },
                                        "& .MuiInputLabel-root": {
                                        fontSize: 14,
                                        },
                                        "& .MuiFormHelperText-root": {
                                        fontSize: 11,
                                        },
                                    }}
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
                    sx={{ minHeight: 44, borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                >
                    {loading ? <CircularProgress size={22} color="inherit" /> : "Create task"}
                </Button>
            </MobileAppBar>
        </Box>
    );
}