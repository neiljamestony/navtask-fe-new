import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { Box, Typography, IconButton, AppBar, Toolbar, Chip, Avatar } from "@mui/material";
import { ArrowBackIosNewRounded } from "@mui/icons-material";
import { getTask } from "../../api/task/task";
import { prioritiesIcons, subTaskStatusIcons, statusIcons } from "../Todo/DesktopTodo";
import { removeTask } from "../../api/task/task";
import type { UTask } from "../../typescript/interface";
import { limitText } from "../../utils/utils";
import toast from "react-hot-toast";

//icons
import dayjs from "dayjs";
import DeleteItems from "../Todo/DeleteItems";

// COMPONENTS
import { MobileAppBar } from "../MobileAppBar";
import { CalendarClock, CalendarDays, ListTodo, Pencil, Trash } from "lucide-react";
import TaskNotFound from "../NotFound/TaskNotFound";
import FetchingTask from "../NotFound/FetchingTask";

export default function ViewTaskMobile(){
    const { id } = useParams();
    const [fetchingTask, setFetchingTask] = useState(false)
    const navigate = useNavigate();
    const [deleteItem, setDeleteItem] = useState(false)
    const [taskNotFound, setTaskNotFound] = useState(false)
    const [itemDeletionLoading, setItemDeletionLoader] = useState(false)
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
    
    const fetch = async () => {
        setFetchingTask(true)
        setTaskNotFound(false)
        try{
            const taskId = id as string;
            const result = await getTask(taskId);
            if(result.status === 401){
                toast.error("Session expired, please login again.");
                navigate("/login")
            }
            if(result.length < 1){
                setTask(task)
                setFetchingTask(false)
            }
            setTask(result);
            setFetchingTask(false)
        }catch(error: unknown){
            setFetchingTask(false)
            setTaskNotFound(true)
        }
    }

    useEffect(() => {
        let done = true;
        done && fetch();
        return () => {
            done = false;
        }
    }, [])


    const priority = prioritiesIcons[task?.priority as keyof typeof prioritiesIcons];
    const status = statusIcons[task?.status as keyof typeof statusIcons]

    const handleDeleteItem = async (ids: string[] | []) => {
        setItemDeletionLoader(true)
        const result = await removeTask(ids);
        if(result?.status === 200){
            setItemDeletionLoader(false)
            setDeleteItem(false)
            navigate("/");
        }else{
            setItemDeletionLoader(false)
            toast.error(result?.msg)
        }
    }

    return (
        <>
            <AppBar
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{
                    bgcolor: "rgba(255,255,255,0.94)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
                >
                <Toolbar sx={{ minHeight: 64, gap: 1.5 }}>
                    <IconButton
                    aria-label="Back to tasks"
                    onClick={() => navigate("/")}
                    sx={{
                        width: 38,
                        height: 38,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        color: "text.primary",
                    }}
                    >
                    <ArrowBackIosNewRounded sx={{ fontSize: 16 }} />
                    </IconButton>

                    <Box sx={{ minWidth: 0 }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", lineHeight: 1.2 }}
                    >
                        Tasks / Details
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        sx={{
                        fontWeight: 700,
                        lineHeight: 1.4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        }}
                    >
                        {task.title || "Task details"}
                    </Typography>
                    </Box>
                </Toolbar>
                </AppBar>

            {fetchingTask ? (
                <Box
                    sx={{
                    width: "100%",
                    minHeight: "50dvh",
                    boxSizing: "border-box",
                    pt: "64px",
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    }}
                >
                    <FetchingTask />
                </Box>
            ) : taskNotFound ? (
                <TaskNotFound/>
            ) : (
            <>
                <DeleteItems
                loading={itemDeletionLoading}
                close={() => setDeleteItem(false)}
                proceed={handleDeleteItem}
                open={deleteItem}
                ids={[task.id.toString()]}
                />

                <Box
                    component="main"
                    sx={{
                        px: 2,
                        pt: 10,
                        pb: 12,
                        bgcolor: "#f6f8fb",
                        minHeight: "100dvh",
                        boxSizing: "border-box",
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: "background.paper",
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 3,
                            }}
                        >
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {priority && (
                                    <Chip
                                        size="small"
                                        icon={priority.icon}
                                        label={priority.label}
                                        sx={{
                                        flexShrink: 0,
                                        bgcolor: priority.bgColor,
                                        color: priority.color,
                                        fontSize: 11,
                                        }}
                                    />
                                )}
                                {status && (
                                    <Chip
                                        size="small"
                                        icon={status.icon}
                                        label={status.label}
                                        sx={{
                                        flexShrink: 0,
                                        bgcolor: status.bgColor,
                                        color: status.color,
                                        fontSize: 11,
                                        }}
                                    />
                                )}
                            </Box>

                            <Typography
                                variant="h5"
                                sx={{ mt: 2, fontWeight: 750, overflowWrap: "anywhere" }}
                            >
                                {task.title}
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.5,
                                    mt: 2,
                                    p: 1.5,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 2,
                                    bgcolor: "background.paper",
                                }}
                                >
                                {[
                                    {
                                    label: "Created",
                                    value: task.created_at
                                        ? dayjs(task.created_at).format("D MMM YYYY")
                                        : "—",
                                    icon: <CalendarDays size={16} />,
                                    },
                                    {
                                    label: "Due date",
                                    value: task.due_date
                                        ? dayjs(task.due_date).format("D MMM YYYY")
                                        : "Not set",
                                    icon: <CalendarClock size={16} />,
                                    },
                                ].map((date) => (
                                    <Box
                                    key={date.label}
                                    sx={{ display: "flex", alignItems: "center", gap: 1.25 }}
                                    >
                                    <Box
                                        sx={{
                                        width: 32,
                                        height: 32,
                                        flexShrink: 0,
                                        display: "grid",
                                        placeItems: "center",
                                        borderRadius: 1.5,
                                        bgcolor: "grey.100",
                                        color: "text.secondary",
                                        }}
                                    >
                                        {date.icon}
                                    </Box>

                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography variant="caption" color="text.secondary">
                                        {date.label}
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {date.value}
                                        </Typography>
                                    </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {task.description && (
                        <Box
                            sx={{
                            p: 2,
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 3,
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.75 }}>
                            Description
                            </Typography>
                            <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", lineHeight: 1.6 }}
                            >
                            {task.description}
                            </Typography>
                        </Box>
                        )}

                        {task.attachments && task.attachments.length > 0 && (
                        <Box
                            sx={{
                            p: 2,
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 3,
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                                Attachments ({task.attachments.length})
                            </Typography>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                                    gap: 1.5,
                                }}
                            >
                            {task.attachments.map((item, key) => (
                                <Box key={`${item.name}-${key}`} sx={{ minWidth: 0 }}>
                                {item.url && (
                                    <Box
                                    component="a"
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    sx={{ display: "block", color: "inherit", textDecoration: "none" }}
                                    >
                                    <Box
                                        component="img"
                                        src={item.url}
                                        alt={item.name}
                                        sx={{
                                        width: "100%",
                                        aspectRatio: "1",
                                        display: "block",
                                        objectFit: "cover",
                                        borderRadius: 2,
                                        bgcolor: "grey.100",
                                        }}
                                    />
                                    <Typography
                                        variant="caption"
                                        title={item.name}
                                        sx={{
                                        display: "block",
                                        mt: 0.75,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        }}
                                    >
                                        {limitText(item.name)}
                                    </Typography>
                                    </Box>
                                )}
                                </Box>
                            ))}
                            </Box>
                        </Box>
                        )}

                        <Box
                            sx={{
                                p: 2,
                                bgcolor: "background.paper",
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 3,
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                                Subtasks
                                <Typography component="span" variant="caption" color="text.secondary">
                                {" "}({task.subtask.length})
                                </Typography>
                            </Typography>

                            {task.subtask.length > 0 ? (
                                
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {task.subtask.map((subTask, key) => {
                                    const subtaskStatus = subTaskStatusIcons[subTask?.status as keyof typeof subTaskStatusIcons]
                                    return (
                                    <Box
                                        key={`${subTask.title}-${key}`}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 1.5,
                                            p: 1.25,
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                bgcolor: "rgba(148, 0, 211, 0.10)",
                                                color: "#9400D3",
                                            }}
                                            >
                                            <ListTodo size={18} />
                                        </Avatar>
                                    <Typography variant="body2" sx={{ flex: 1, overflowWrap: "anywhere" }}>
                                        {subTask.title}
                                    </Typography>
                                    {subtaskStatus && (
                                        <Chip
                                            size="small"
                                            icon={subtaskStatus.icon}
                                            label={subtaskStatus.label}
                                            sx={{
                                            flexShrink: 0,
                                            bgcolor: subtaskStatus.bgColor,
                                            color: subtaskStatus.color,
                                            fontSize: 11,
                                            }}
                                        />
                                    )}
                                    </Box>
                                )})}
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No subtasks for this task.
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>

                <MobileAppBar>
                    <IconButton onClick={() => setDeleteItem(true)}>
                        <Trash size={18} />
                    </IconButton>
                    <IconButton color="info" size="small" onClick={() => navigate(`/edit-task/${id}`)}>
                        <Pencil size={18} />
                    </IconButton>
                </MobileAppBar>
            </>
            )}
        </>
    );
}