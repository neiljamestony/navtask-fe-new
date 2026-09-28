import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { Box, Typography, IconButton, Divider, Grid, Button, Card, Avatar, CardHeader, CardContent, Chip, Tabs, Tab, CircularProgress } from "@mui/material";
import { getTask } from "../../api/task/task";
import toast from "react-hot-toast";
import { prioritiesIcons, statusIcons } from "../Todo/DesktopTodo";
import { removeTask } from "../../api/task/task";
import Subtask from "./Subtask";
import Attachments from "./Attachments";
import type { UTask } from "../../typescript/interface";
import dayjs from "dayjs";
import DeleteItems from "../Todo/DeleteItems";
import { ChevronLeft, CopyCheck, ListTodo, Edit, Trash, GripVertical, CalendarClock, CalendarCheck } from 'lucide-react'

export default function ViewTaskDesktop(){
    const { id } = useParams();
    const [tab, setTab] = useState(0);
    const navigate = useNavigate();
    const [fetchingTask, setFetchingTask] = useState<boolean>(false)
    const [deleteItem, setDeleteItem] = useState(false)
    const [itemDeletionLoader, setItemDeletionLoader] = useState(false)
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
        try{
            const taskId = id as string;
            const result = await getTask(taskId);
            if(result.status === 401){
                toast.error("Session expired, please login again.");
                navigate("/login")
            }else if(!result.length){
                setTask(task)
            }
            setTask(result);
            setFetchingTask(false)
        }catch(error: unknown){
            toast.error("Error fetching tasks, please reload the page.");
            setFetchingTask(false)
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
    const status = statusIcons[task?.status as keyof typeof statusIcons];

    const tabInfo = [
        {
            name: "Subtasks",
            count: task.subtask.length
        },
        {
            name: "Attachments",
            count: task.attachments.length
        },
    ]

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

    return(
        <>
            <Box>
                {
                    fetchingTask ? (
                        <>
                            <Box
                                role="status"
                                aria-live="polite"
                                sx={{
                                    width: "97%",
                                    mx: "auto",
                                    minHeight: 220,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 2,
                                    p: { xs: 2, sm: 3 },
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 3,
                                    bgcolor: "background.paper",
                                }}
                                >
                                <CircularProgress size={28} />
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                    Loading your tasks
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                    This should only take a moment.
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", gap: 0.75, mt: 0.5 }}>
                                    {[0, 1, 2].map((dot) => (
                                    <Box
                                        key={dot}
                                        sx={{
                                        width: 7,
                                        height: 7,
                                        borderRadius: "50%",
                                        bgcolor: "primary.main",
                                        animation: "loadingDot 1s ease-in-out infinite",
                                        animationDelay: `${dot * 150}ms`,
                                        "@keyframes loadingDot": {
                                            "0%, 60%, 100%": { opacity: 0.3, transform: "scale(0.8)" },
                                            "30%": { opacity: 1, transform: "scale(1)" },
                                        },
                                        }}
                                    />
                                    ))}
                                </Box>
                            </Box>
                        </>
                    ):(
                        <>
                            {
                                !task ? (
                                    <>
                                        <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                                            <Typography sx={{ fontSize: 20 , fontWeight: 'bold' }}>No data found</Typography>
                                        </Box>
                                    </>
                                ): (
                                    <Card variant="outlined" sx={{ borderRadius: 5, padding: 2, height: '92vh' }}>
                                        <DeleteItems loading={itemDeletionLoader} close={() => setDeleteItem(false)} proceed={handleDeleteItem} open={deleteItem} ids={[task.id.toString()]}/>
                                        <Box sx={{ display: "flex", justifyContent: "start", alignItems: 'center', gap: 2 }}>
                                            <IconButton size="small" onClick={() => navigate("/")}>
                                                <ChevronLeft size={14}/>
                                            </IconButton>
                                            <Box sx={{ display: "flex", alignItems: 'flex-start', gap: 1 }}>
                                                <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', gap: 1, opacity: 0.4 }}>
                                                    <CopyCheck size={20}/>
                                                    <Typography sx={{ fontSize: 14 }}>Task</Typography>
                                                    <span>/</span>
                                                </Box>
                                                <Typography sx={{ fontSize: 14 }}>Task Details</Typography>
                                            </Box>
                                        </Box>
                                        <Divider sx={{ marginY: 1 }}/>
                                        <Card variant="outlined" sx={{ borderRadius: 5, marginBottom: 1, padding: 1 }}>
                                            <Grid container spacing={1}>
                                                <Grid size={6}>
                                                    <Box sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center', gap: 2, padding: 1 }}>
                                                        <Avatar
                                                            variant="rounded"
                                                            sx={{ bgcolor: "rgba(148, 0, 211, 0.15)" }}
                                                            >
                                                            <ListTodo size={20} color="#9400D3" strokeWidth={3}/>
                                                        </Avatar>
                                                        <Typography variant="caption" sx={{ fontSize: 24, marginTop: 1 }}>{task.title}</Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid size={6}>
                                                    <Box sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'flex-start', gap: 2, padding: 1, marginTop: 1 }}>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<CopyCheck size={20} />}
                                                            sx={{
                                                                backgroundColor: "#fff",
                                                                borderRadius: 2,
                                                                borderColor: "divider",
                                                                color: "#424242",
                                                                textTransform: "none",
                                                                boxShadow: "none",
                                                                "&:hover": {
                                                                borderColor: "divider",
                                                                backgroundColor: "#f5f5f5",
                                                                boxShadow: "none",
                                                                },
                                                                "&:focus": { boxShadow: "none" },
                                                            }}
                                                            >
                                                            Create Sub Task
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<Edit size={20} />}
                                                            onClick={() => navigate(`/edit-task/${task.id}`)}
                                                            sx={{
                                                                backgroundColor: "#fff",
                                                                borderRadius: 2,
                                                                borderColor: "divider",
                                                                color: "#424242",
                                                                textTransform: "none",
                                                                boxShadow: "none",
                                                                "&:hover": {
                                                                borderColor: "divider",
                                                                backgroundColor: "#f5f5f5",
                                                                boxShadow: "none",
                                                                },
                                                                "&:focus": { boxShadow: "none" },
                                                            }}
                                                            >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<Trash size={20} />}
                                                            onClick={() => setDeleteItem(true)}
                                                            sx={{
                                                                backgroundColor: "#fff",
                                                                borderRadius: 2,
                                                                borderColor: "divider",
                                                                color: "#424242",
                                                                textTransform: "none",
                                                                boxShadow: "none",
                                                                "&:hover": {
                                                                borderColor: "divider",
                                                                backgroundColor: "#f5f5f5",
                                                                boxShadow: "none",
                                                                },
                                                                "&:focus": { boxShadow: "none" },
                                                            }}
                                                            >
                                                            Remove
                                                        </Button>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                        <Grid container spacing={1}>
                                            <Grid size={2}>
                                                <Card
                                                    variant="outlined"
                                                    sx={{
                                                        height: "79vh",
                                                        borderRadius: 3,
                                                        borderColor: "divider",
                                                        overflow: "hidden",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                    }}
                                                    >
                                                    <CardHeader
                                                        avatar={
                                                        <Box
                                                            sx={{
                                                            width: 36,
                                                            height: 36,
                                                            display: "grid",
                                                            placeItems: "center",
                                                            borderRadius: 1.5,
                                                            bgcolor: "primary.50",
                                                            color: "primary.main",
                                                            }}
                                                        >
                                                            <GripVertical size={18} />
                                                        </Box>
                                                        }
                                                        title={
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                                            Task information
                                                        </Typography>
                                                        }
                                                        sx={{
                                                        px: 2.5,
                                                        py: 2,
                                                        borderBottom: "1px solid",
                                                        borderColor: "divider",
                                                        }}
                                                    />

                                                    <CardContent
                                                        sx={{
                                                        flex: 1,
                                                        overflowY: "auto",
                                                        p: 2.5,
                                                        "&:last-child": { pb: 2.5 },
                                                        }}
                                                    >
                                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                                                            <Box>
                                                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.75 }}>Status</Typography>
                                                                <Chip
                                                                    size="small"
                                                                    icon={status?.icon}
                                                                    label={status?.label ?? "—"}
                                                                    sx={{
                                                                        bgcolor: status?.bgColor,
                                                                        color: status?.color,
                                                                        fontWeight: 600,
                                                                    }}
                                                                />
                                                            </Box>
                                                            <Box>
                                                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.75 }}>Priority</Typography>
                                                                <Chip
                                                                    size="small"
                                                                    icon={priority?.icon}
                                                                    label={priority?.label ?? "—"}
                                                                    sx={{
                                                                        bgcolor: priority?.bgColor,
                                                                        color: priority?.color,
                                                                        fontWeight: 600,
                                                                    }}
                                                                />
                                                            </Box>
                                                            <Divider />
                                                            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 2 }}>
                                                                <Box>
                                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                        <CalendarClock size={15} />
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            Due date
                                                                        </Typography>
                                                                    </Box>
                                                                    <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                                                                        {task.due_date ? dayjs(task.due_date).format("D MMM YYYY") : "Not set"}
                                                                    </Typography>
                                                                </Box>

                                                                <Box>
                                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                        <CalendarCheck size={15} />
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            Created
                                                                        </Typography>
                                                                    </Box>
                                                                    <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                                                                        {task.created_at ? dayjs(task.created_at).format("D MMM YYYY") : "—"}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>

                                                            {task.description && (
                                                                <>
                                                                    <Divider />
                                                                    <Box>
                                                                        <Typography variant="caption" color="text.secondary">Description</Typography>
                                                                        <Typography
                                                                            variant="body2"
                                                                            sx={{
                                                                                mt: 0.75,
                                                                                lineHeight: 1.65,
                                                                                color: "text.primary",
                                                                                whiteSpace: "pre-wrap",
                                                                                overflowWrap: "anywhere",
                                                                            }}
                                                                        >
                                                                        {task.description}
                                                                        </Typography>
                                                                    </Box>
                                                                </>
                                                            )}
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid size={10}>
                                                <Card variant="outlined" sx={{ borderRadius: 5, height: '79vh', overflowY: 'auto' }}>
                                                    <Box sx={{ marginTop: 1 }}>
                                                        <Tabs
                                                            value={tab}
                                                            onChange={(_, newValue) => setTab(newValue)}
                                                            aria-label="Task tabs"
                                                            sx={{
                                                                "& .MuiTabs-indicator": { display: "none" },
                                                            }}
                                                            >
                                                            {tabInfo.map((tabData, index) => (
                                                                <Tab
                                                                    key={tabData.name}
                                                                    value={index}
                                                                    label={
                                                                        <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', gap: 1, textAlign: 'center' }}>
                                                                            <Box sx={{ pr: 1 }}>{tabData.name}</Box>
                                                                            {tabData.count > 0 && <Box sx={{ backgroundColor: 'black', color: '#fff', textAlign: 'center', padding: 0.5, borderRadius: 2, fontSize: 12 }}>{tabData.count}</Box>}
                                                                        </Box>
                                                                    }
                                                                    sx={{
                                                                        minHeight: "auto",
                                                                        minWidth: 0,
                                                                        px: 2,
                                                                        py: 1,
                                                                        ml: 1,
                                                                        border: "1px solid transparent",
                                                                        borderRadius: 2,
                                                                        color: "#424242",
                                                                        textTransform: "none",
                                                                        "&:hover": { backgroundColor: "#f5f5f5" },
                                                                        "&.Mui-selected": {
                                                                        backgroundColor: "#fff",
                                                                        borderColor: "divider",
                                                                        color: "#424242",
                                                                        boxShadow: "none",
                                                                        },
                                                                    }}
                                                                />
                                                            ))}
                                                        </Tabs>
                                                        <Box role="tabpanel" sx={{ mr: 1 }}>
                                                            {tab === 0 && <Subtask subtasks={task.subtask}/>}
                                                            {tab === 1 && <Attachments attachments={task.attachments}/>}
                                                        </Box>
                                                    </Box>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                )
                            }
                        </>
                    )
                }
            </Box>
        </>
    )
}