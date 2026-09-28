import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, TextField, LinearProgress, MenuItem, Grid, Divider, CircularProgress, IconButton } from '@mui/material'
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
import { ChevronLeft, Plus, Trash } from 'lucide-react';

dayjs.extend(customParseFormat);
export default function NewTaskDesktop() {
    const [loading, setLoading] = useState(false);
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
  <Box sx={{ minHeight: "100vh", bgcolor: "#f6f8fb", pb: 12 }}>
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        px: { xs: 2, md: 4 },
        pt: { xs: 2, md: 4 },
      }}
    >
      {/* Page header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton
            size='small'
            aria-label="Go back"
            onClick={() => navigate("/")}
            sx={{ bgcolor: "white", border: "1px solid", borderColor: "divider" }}
        >
          <ChevronLeft size={20} />
        </IconButton>

        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#17212b" }}>
            Create a task
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add the details, schedule, and files for this task.
          </Typography>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "#e6eaf0",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Grid container spacing={2.5}>
            {/* Task details */}
            <Grid size={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Task details
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Give your task a name and choose its priority and status.
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Priority"
                value={task.priority}
                fullWidth
                onChange={(e) =>
                  setTask((prev) => ({ ...prev, priority: e.target.value }))
                }
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
                onChange={(e) =>
                  setTask((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                {status.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={12}>
              <TextField
                id="task-title"
                label="Title"
                name="title"
                value={task.title}
                onChange={handleTextChange}
                slotProps={{ htmlInput: { maxLength: 25 } }}
                required
                fullWidth
                error={errors.some((error) => error.key === "title")}
                helperText={errors.find((error) => error.key === "title")?.error ?? ""}
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: 18,
                    fontWeight: 600,
                  },
                }}
              />
            </Grid>

            {/* Schedule */}
            <Grid size={12} sx={{ mt: 1 }}>
              <Divider />
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Schedule
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Set the due date for this task.
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date created"
                  value={dayjs()}
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
                  onChange={handleDueDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: errors.some((error) => error.key === "due_date"),
                      helperText:
                        errors.find((error) => error.key === "due_date")?.error ?? "",
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Description */}
            <Grid size={12} sx={{ mt: 1 }}>
              <Divider />
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Description
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Add context or instructions (optional).
              </Typography>

              <TextField
                id="task-description"
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
                  `${task.description && task.description.length}/300`
                }
              />
            </Grid>

            {/* Attachments */}
            <Grid size={12} sx={{ mt: 1 }}>
              <Divider />
            </Grid>

            <Grid size={12}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Attachments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add up to 5 files. Each file can be up to 10 MB.
                </Typography>
              </Box>

              <Box
                {...getRootProps()}
                sx={{
                  position: "relative",
                  p: 2,
                  border: "1.5px dashed",
                  borderColor: fileError ? "error.main" : "#cbd5e1",
                  borderRadius: 2,
                  bgcolor: "#fafcff",
                  cursor: uploading ? "default" : "pointer",
                  transition: "border-color 150ms ease, background-color 150ms ease",
                  "&:hover": {
                    borderColor: fileError ? "error.main" : "primary.main",
                    bgcolor: "#f3f8ff",
                  },
                }}
              >
                <input {...getInputProps()} />

                {uploading ? (
                  <Box sx={{ maxWidth: 420, mx: "auto", py: 1, textAlign: "center" }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Uploading {uploadedFileNames.join(", ")}
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      py: 1,
                    }}
                  >
                    <Box
                      component="img"
                      src={UploadIcon}
                      alt=""
                      sx={{ width: 34, height: 34, objectFit: "contain" }}
                    />
                    <Typography variant="body2" sx={{ textAlign: "center" }}>
                      <Box component="span" sx={{ color: "primary.main", fontWeight: 700 }}>
                        Choose files
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
                      <FilePreview
                        key={`${file.name}-${key}`}
                        file={file}
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
            </Grid>

            {/* Subtasks */}
            <Grid size={12} sx={{ mt: 1 }}>
              <Divider />
            </Grid>

            <Grid size={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Subtasks
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Break this task into smaller steps.
                  </Typography>
                </Box>

                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<Plus />}
                  disabled={task.subTask.length >= 10}
                  onClick={handleNewSubTask}
                  sx={{ textTransform: "none", borderRadius: 2, flexShrink: 0 }}
                >
                  Add subtask
                </Button>
              </Box>
            </Grid>

            {task.subTask.length === 0 ? (
              <Grid size={12}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 2,
                    textAlign: "center",
                    bgcolor: "#fafcff",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No subtasks added yet.
                  </Typography>
                </Box>
              </Grid>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: '100%' }}>
              {task.subTask.map((subTask, key) => {
                const isDone = subTask.status === "done";

                return (
                  <Box key={key} sx={{ width: "100%", boxSizing: "border-box" }}>
                    <Box
                      sx={{
                        width: "100%",
                        boxSizing: "border-box" }}>
                        <Box
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
                          }}
                        >
                          {key + 1}
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
                              <Typography variant="body2" sx={{ fontSize: 13 }}>
                                {option.label}
                              </Typography>
                            </MenuItem>
                          ))}
                        </TextField>

                        <IconButton
                          size="small"
                          aria-label={`Remove subtask ${key + 1}`}
                          onClick={() => handleRemoveSubTask(key)}>
                          <Trash size={20}/>
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
              </Box>
            )}
          </Grid>
        </Box>

        {/* Form actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            px: { xs: 2, sm: 3, md: 4 },
            py: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "#fcfdff",
          }}
        >
          <Button
            type="button"
            variant="outlined"
            onClick={() => navigate("/")}
            disabled={loading}
            sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ textTransform: "none", borderRadius: 2, px: 3, fontWeight: 700 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Create task"}
          </Button>
        </Box>
      </Paper>
    </Box>
  </Box>
);
}