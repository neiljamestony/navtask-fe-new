import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { Box, Typography, IconButton, Divider, Stack, Grid, Button, Card, Avatar, CardHeader, CardContent, Chip, Tabs, Tab } from "@mui/material";
import { getTask } from "../../api/task/task";
import toast from "react-hot-toast";
import { prioritiesIcons, statusIcons } from "../Todo/DesktopTodo";
import { removeTask } from "../../api/task/task";
import Subtask from "./Subtask";
import Attachments from "./Attachments";
import type { UTask } from "../../typescript/interface";
import dayjs from "dayjs";
import DeleteItems from "../Todo/DeleteItems";
import { ChevronLeft, CopyCheck, ListTodo, Edit, Trash, GripVertical } from 'lucide-react'

export default function ViewTaskDesktop(){
    const { id } = useParams();
    const [tab, setTab] = useState(0);
    const navigate = useNavigate();
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
            
        }catch(error: unknown){
            toast.error("Error fetching tasks, please reload the page.");
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
                    !task || !task.title ? (
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
                                    <Card variant="outlined" sx={{ borderRadius: 5, height: '79vh' }}>
                                        <CardHeader
                                            avatar={
                                                <GripVertical/>
                                            }
                                            title={
                                                <Typography variant="body2" sx={{ fontSize: 16, fontWeight: 'bold' }}>Task Information</Typography>
                                            }
                                        />
                                        <CardContent>
                                            <Stack spacing={2}>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontSize: 14, color: 'gray', mb: 1 }}>Status</Typography>
                                                    <Chip icon={status && status.icon} label={status && status.label} sx={{ backgroundColor: status.bgColor, color: status.color, fontSize: 12 }}/>
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontSize: 14, color: 'gray', mb: 1 }}>Priority</Typography>
                                                    <Chip icon={priority && priority.icon} label={priority && priority.label} sx={{ backgroundColor: priority.bgColor, color: priority.color, fontSize: 12 }}/>
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontSize: 14, color: 'gray', mb: 1 }}>Due Date</Typography>
                                                    <Typography variant="caption" sx={{ fontSize: 13, color: 'gray' }}>{dayjs(task.due_date).format("D MMM YYYY")}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontSize: 14, color: 'gray', mb: 1 }}>Created Date</Typography>
                                                    <Typography variant="caption" sx={{ fontSize: 13, color: 'gray' }}>{dayjs(task.created_at).format("D MMM YYYY")}</Typography>
                                                </Box>
                                                {task.description && (
                                                    <Box sx={{ width: "100%" }}>
                                                        <Typography
                                                        variant="body2"
                                                        sx={{ fontSize: 14, color: "gray", mb: 1 }}
                                                        >
                                                        Description
                                                        </Typography>
                                                        <Typography
                                                        variant="caption"
                                                        component="p"
                                                        sx={{
                                                            display: "block",
                                                            width: "100%",
                                                            fontSize: 13,
                                                            color: "gray",
                                                            textAlign: "justify",
                                                            m: 0,
                                                        }}
                                                        >
                                                        {task.description}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Stack>
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
                
            </Box>
        </>
    )
}