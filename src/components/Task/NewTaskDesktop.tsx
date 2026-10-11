import {
  NewTaskDesktopBoxTextStyle1,
  NewTaskDesktopBoxSizeStyle2,
  NewTaskDesktopBoxLayoutStyle3,
  NewTaskDesktopIconButtonSurfaceStyle4,
  NewTaskDesktopTypographyTextStyle5,
  NewTaskDesktopPaperSurfaceStyle6,
  NewTaskDesktopBoxSpacingStyle7,
  NewTaskDesktopTypographyTextStyle8,
  NewTaskDesktopTypographySpacingStyle9,
  NewTaskDesktopTextFieldInputStyle10,
  NewTaskDesktopGridLayoutStyle11,
  NewTaskDesktopGridSpacingStyle12,
  NewTaskDesktopTypographyTextStyle13,
  NewTaskDesktopTypographySpacingStyle14,
  NewTaskDesktopGridSpacingStyle15,
  NewTaskDesktopBoxSpacingStyle16,
  NewTaskDesktopTypographyTextStyle17,
  NewTaskDesktopBoxSurfaceStyle18,
  NewTaskDesktopBoxSurfaceStyle19,
  NewTaskDesktopBoxSurfaceStyle20,
  NewTaskDesktopBoxLayoutStyle21,
  NewTaskDesktopBoxSurfaceStyle22,
  NewTaskDesktopBoxSizeStyle23,
  NewTaskDesktopTypographyTextStyle24,
  NewTaskDesktopTypographyTextStyle25,
  NewTaskDesktopTypographyTextStyle26,
  NewTaskDesktopBoxSurfaceStyle27,
  NewTaskDesktopBoxSurfaceStyle28,
  NewTaskDesktopLinearProgressSurfaceStyle29,
  NewTaskDesktopBoxLayoutStyle30,
  NewTaskDesktopBoxSizeStyle31,
  NewTaskDesktopTypographyTextStyle32,
  NewTaskDesktopBoxTextStyle33,
  NewTaskDesktopBoxLayoutStyle34,
  NewTaskDesktopTypographyLayoutStyle35,
  NewTaskDesktopPaperSurfaceStyle36,
  NewTaskDesktopTypographyTextStyle37,
  NewTaskDesktopTypographySpacingStyle38,
  NewTaskDesktopGridSpacingStyle39,
  NewTaskDesktopTypographyTextStyle40,
  NewTaskDesktopGridSpacingStyle41,
  NewTaskDesktopBoxLayoutStyle42,
  NewTaskDesktopTypographyTextStyle43,
  NewTaskDesktopButtonSurfaceStyle44,
  NewTaskDesktopBoxSurfaceStyle45,
  NewTaskDesktopBoxSizeStyle46,
  NewTaskDesktopBoxSizeStyle47,
  NewTaskDesktopBoxSizeStyle48,
  NewTaskDesktopBoxGridStyle49,
  NewTaskDesktopBoxSurfaceStyle50,
  NewTaskDesktopTextFieldInputStyle51,
  NewTaskDesktopTextFieldGridStyle52,
  NewTaskDesktopTypographyTextStyle53,
  NewTaskDesktopBoxSurfaceStyle54,
  NewTaskDesktopButtonSurfaceStyle55,
  NewTaskDesktopButtonSurfaceStyle56
} from "../Styles/Task/NewTaskDesktop/NewTaskDesktop.styles";
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
import { ChevronLeft, Plus, Trash, UploadCloud } from 'lucide-react';

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
      <Box sx={NewTaskDesktopBoxTextStyle1}>
        <Box
          sx={NewTaskDesktopBoxSizeStyle2}
        >
          {/* Page header */}
          <Box sx={NewTaskDesktopBoxLayoutStyle3}>
            <IconButton
                size='small'
                aria-label="Go back"
                onClick={() => navigate("/")}
                sx={NewTaskDesktopIconButtonSurfaceStyle4}
            >
              <ChevronLeft size={20} />
            </IconButton>

            <Box>
              <Typography variant="h5" sx={NewTaskDesktopTypographyTextStyle5}>
                Create a task
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add the details, schedule, and files for this task.
              </Typography>
            </Box>
          </Box>

          <Paper
            elevation={0}
            sx={NewTaskDesktopPaperSurfaceStyle6}
          >
            <Box sx={NewTaskDesktopBoxSpacingStyle7}>
              <Grid container spacing={{ xs: 2, md: 2.25, lg: 2.5 }}>
                {/* Task details */}
                <Grid size={12}>
                  <Typography variant="subtitle1" sx={NewTaskDesktopTypographyTextStyle8}>
                    Task details
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={NewTaskDesktopTypographySpacingStyle9}>
                    Add a clear title, then organize the work and timing.
                  </Typography>
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
                    sx={NewTaskDesktopTextFieldInputStyle10}
                  />
                </Grid>


                <Grid size={12}>
                  <Grid container spacing={{ xs: 2, lg: 3 }} sx={NewTaskDesktopGridLayoutStyle11}>
                    <Grid size={{ xs: 12, lg: 8 }}>
                      <Grid container spacing={2.25}>
                        {/* Description */}
                        <Grid size={12} sx={NewTaskDesktopGridSpacingStyle12}>
                          <Divider />
                        </Grid>

                        <Grid size={12}>
                          <Typography variant="subtitle1" sx={NewTaskDesktopTypographyTextStyle13}>
                            Description
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={NewTaskDesktopTypographySpacingStyle14}>
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
                        <Grid size={12} sx={NewTaskDesktopGridSpacingStyle15}>
                          <Divider />
                        </Grid>

                        <Grid size={12}>
                          <Box sx={NewTaskDesktopBoxSpacingStyle16}>
                            <Typography variant="subtitle1" sx={NewTaskDesktopTypographyTextStyle17}>
                              Attachments
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Add up to 5 files. Each file can be up to 10 MB.
                            </Typography>
                          </Box>

                          <Box
                            {...getRootProps()}
                            sx={NewTaskDesktopBoxSurfaceStyle18({ fileError: fileError, uploading: uploading })}
                          >
                            <input {...getInputProps()} />

                            {uploading ? (
                             <Box
                                role="status"
                                aria-live="polite"
                                sx={NewTaskDesktopBoxSurfaceStyle19}
                              >
                                <Box
                                  sx={NewTaskDesktopBoxSurfaceStyle20}
                                >
                                  <Box sx={NewTaskDesktopBoxLayoutStyle21}>
                                    <Box
                                      sx={NewTaskDesktopBoxSurfaceStyle22}
                                    >
                                      <UploadCloud size={22} />
                                    </Box>

                                    <Box sx={NewTaskDesktopBoxSizeStyle23}>
                                      <Typography variant="body2" sx={NewTaskDesktopTypographyTextStyle24}>
                                        Uploading files
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={NewTaskDesktopTypographyTextStyle25}
                                        title={uploadedFileNames.join(", ")}
                                      >
                                        {uploadedFileNames.join(", ")}
                                      </Typography>
                                    </Box>

                                    <Typography
                                      variant="body2"
                                      color="primary.main"
                                      sx={NewTaskDesktopTypographyTextStyle26}
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
                                    sx={NewTaskDesktopBoxSurfaceStyle27}
                                  >
                                    <Box
                                      sx={NewTaskDesktopBoxSurfaceStyle28({ progress: progress })}
                                    />
                                  </Box>
                                </Box>

                                <LinearProgress
                                  variant="determinate"
                                  value={progress}
                                  aria-label="File upload progress"
                                  sx={NewTaskDesktopLinearProgressSurfaceStyle29}
                                />
                              </Box>
                            ) : (
                              <Box
                                sx={NewTaskDesktopBoxLayoutStyle30}
                              >
                                <Box
                                  component="img"
                                  src={UploadIcon}
                                  alt=""
                                  sx={NewTaskDesktopBoxSizeStyle31}
                                />
                                <Typography variant="body2" sx={NewTaskDesktopTypographyTextStyle32}>
                                  <Box component="span" sx={NewTaskDesktopBoxTextStyle33}>
                                    Choose files
                                  </Box>{" "}
                                  or drag and drop them here
                                </Typography>
                              </Box>
                            )}

                            {!uploading && task.attachments.length > 0 && (
                              <Box
                                sx={NewTaskDesktopBoxLayoutStyle34}
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
                            <Typography variant="caption" color="error" sx={NewTaskDesktopTypographyLayoutStyle35}>
                              {fileError.msg}
                            </Typography>
                          )}
                        </Grid>

                      </Grid>
                    </Grid>
                    <Grid size={{ xs: 12, lg: 4 }}>
                      <Paper variant="outlined" sx={NewTaskDesktopPaperSurfaceStyle36}>
                        <Typography variant="subtitle1" sx={NewTaskDesktopTypographyTextStyle37}>Planning</Typography>
                        <Typography variant="body2" color="text.secondary" sx={NewTaskDesktopTypographySpacingStyle38}>Set the task priority, status, and dates.</Typography>
                        <Grid container spacing={2}>
                        <Grid size={12}>
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

                        <Grid size={12}>
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

                        {/* Schedule */}
                        <Grid size={12} sx={NewTaskDesktopGridSpacingStyle39}>
                          <Divider />
                        </Grid>

                        <Grid size={12}>
                          <Typography variant="subtitle1" sx={NewTaskDesktopTypographyTextStyle40}>
                            Schedule
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Set the due date for this task.
                          </Typography>
                        </Grid>

                        <Grid size={12}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Date created"
                              value={dayjs()}
                              disabled
                              slotProps={{ textField: { fullWidth: true } }}
                            />
                          </LocalizationProvider>
                        </Grid>

                        <Grid size={12}>
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

                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
                {/* Subtasks */}
                <Grid size={12} sx={NewTaskDesktopGridSpacingStyle41}>
                  <Divider />
                </Grid>

                <Grid size={12}>
                  <Box
                    sx={NewTaskDesktopBoxLayoutStyle42}
                  >
                    <Box>
                      <Typography variant="subtitle1" sx={NewTaskDesktopTypographyTextStyle43}>
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
                      sx={NewTaskDesktopButtonSurfaceStyle44}
                    >
                      Add subtask
                    </Button>
                  </Box>
                </Grid>

                <Grid size={12}>
                    {task.subTask.length === 0 ? (
                    <Grid size={12}>
                      <Box
                        sx={NewTaskDesktopBoxSurfaceStyle45}
                      >
                        <Typography variant="body2" color="text.secondary">
                          No subtasks added yet.
                        </Typography>
                      </Box>
                    </Grid>
                  ) : (
                    <Box sx={NewTaskDesktopBoxSizeStyle46}>
                    {task.subTask.map((subTask, key) => {
                      const isDone = subTask.status === "done";

                      return (
                        <Box key={key} sx={NewTaskDesktopBoxSizeStyle47}>
                          <Box
                            sx={NewTaskDesktopBoxSizeStyle48}>
                              <Box
                                sx={NewTaskDesktopBoxGridStyle49({ isDone: isDone })}>
                              <Box
                                sx={NewTaskDesktopBoxSurfaceStyle50({ isDone: isDone })}
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
                                sx={NewTaskDesktopTextFieldInputStyle51}
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
                                sx={NewTaskDesktopTextFieldGridStyle52}
                              >
                                {subTasksDropdown.map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    <Typography variant="body2" sx={NewTaskDesktopTypographyTextStyle53}>
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
              </Grid>
            </Box>

            {/* Form actions */}
            <Box
              sx={NewTaskDesktopBoxSurfaceStyle54}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate("/")}
                disabled={loading}
                sx={NewTaskDesktopButtonSurfaceStyle55}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={NewTaskDesktopButtonSurfaceStyle56}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : "Create task"}
              </Button>
            </Box>
          </Paper>
        </Box>
    </Box>
  );
}