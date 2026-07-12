import { useState, useEffect } from "react";
import type { ReactNode } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import { Box, Button, Typography, CircularProgress, IconButton, Divider, Stack, Grid, Link, AppBar, Toolbar } from "@mui/material";
import { ArrowBackIosNewRounded } from "@mui/icons-material";
import { getTask } from "../../api/task/task";
import toast from "react-hot-toast";
import { prioritiesIcons, statusIcons } from "../Todo/DesktopTodo";
import { removeTask } from "../../api/task/task";
import type { UTask } from "../../typescript/interface";
//icons
import Delete from '../../assets/Icons/Delete_active.svg';
import Edit from '../../assets/Icons/Edit.svg';
import Done from '../../assets/Icons/Done.svg';
import NotDone from '../../assets/Icons/Not Done.svg';
import dayjs from "dayjs";
import DeleteItems from "../Todo/DeleteItems";

import { MobileAppBar } from "../MobileAppBar";
import { limitText } from "../../utils/utils";

export default function ViewTaskMobile(){
    const { id } = useParams();
    const [fetchingTask, setFetchingTask] = useState(false)
    const navigate = useNavigate();
    const [deleteItem, setDeleteItem] = useState(false)
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

    const StatusIcon = ({children, action}: {children: ReactNode, action?: () => void }) => {
        return <IconButton size="medium" sx={{ p: 2 }} onClick={action}>{children}</IconButton>
    }

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
            <AppBar position="fixed" color="inherit" sx={{ top: 0, bottom: "auto" }}>
                <Toolbar sx={{ display: "flex", alignItems: 'center', gap: 1 }}>
                    <Button type="button" onClick={() => navigate("/")} startIcon={<ArrowBackIosNewRounded/>}>
                        <Typography sx={{ fontFamily: "Roboto", fontWeight: 'bold', textTransform: 'none', color: '#027CEC', fontSize: 14 }}>Back</Typography>
                    </Button>
                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                        <Divider orientation="vertical" flexItem sx={{ height: 25 }}/>
                    </Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 'bold' }}>View Task</Typography>
                </Toolbar>
            </AppBar>
            {
                fetchingTask ? (
                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center'}}>
                        <CircularProgress size={30} color="inherit"/>
                        <Typography variant="body1">fetching data ...</Typography>
                    </Box>
                ):(
                    <>
                        {
                            !task || !task.title ? (
                                <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                                    <Typography sx={{ fontSize: 20 , fontWeight: 'bold' }}>No data found</Typography>
                                </Box>
                            ): (
                                <>
                                    <DeleteItems loading={itemDeletionLoading} close={() => setDeleteItem(false)} proceed={handleDeleteItem} open={deleteItem} ids={[task.id.toString()]}/>
                                    <Box sx={{ padding: 2, paddingBottom: 10 }}>
                                        <Box sx={{ display: "flex", justifyContent: "start", alignItems: 'center', gap: 2 }}>
                                            <Button type="button" onClick={() => navigate("/")} startIcon={<ArrowBackIosNewRounded/>}>
                                                <Typography sx={{ fontFamily: "Roboto", fontWeight: 'bold', textTransform: 'none' }}>Back</Typography>
                                            </Button>
                                            <Typography sx={{ fontFamily: "Roboto", fontWeight: 'bold' }}>View Task</Typography>
                                        </Box>
                                        <Box sx={{ padding: 2 }}>
                                            {fetchingTask && <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center'}}>
                                                <CircularProgress size={30} color="inherit"/>
                                                <Typography variant="body1">fetching data ...</Typography>
                                            </Box>}
                                            <Stack spacing={2}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignitems: "center"}}>
                                                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                                                        <Box>{priority && priority.icon}</Box>
                                                        <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                                                            <Box>{status && status.icon}</Box>
                                                            <Typography variant="caption">{status && status.label} {task.status === "completed" && task.completed_date !== null && `- ${dayjs(task.completed_date).format('D MMM YYYY')}`}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                <Typography variant="h6">{task.title}</Typography>
                                                <Typography variant="caption" sx={{ color: 'grey.600' }}>{dayjs(task.created_at).format("D MMM YYYY")} - {dayjs(task.due_date).format("D MMM YYYY")}</Typography>
                                                <Typography variant="body2" sx={{ marginTop: 2, maxWidth: "100ch", wordWrap: 'break-word' }}>{task.description}</Typography>
                                                <Box sx={{ display: "flex", flexWrap: 'wrap', gap: 2, height: "100%", width: '100%' }}>
                                                {
                                                    task.attachments && task.attachments.map((item, key) => (
                                                        <Box key={key}>
                                                            <Box sx={{ display: 'block' }}>
                                                                <img src={item.url} alt={item.name + "icon"} height={100} width={100}/>
                                                                <Link href={item.url}><Typography sx={{ fontSize: 14 }}>{limitText(item.name)}</Typography></Link>
                                                            </Box>
                                                        </Box>
                                                    ))
                                                }
                                                </Box>
                                                <Divider/>
                                                <Stack spacing={2}>
                                                    <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Subtask</Typography>
                                                    {
                                                        task.subtask.length > 0 && (
                                                        <>
                                                            {
                                                                task.subtask.map((subTask, key) => (
                                                                    <Box key={key} sx={{ display: "flex", justifyContent: 'space-between', alignItems: 'center'}}>
                                                                        <Typography variant="body2" sx={{ fontSize: 15, fontWeight: "regular" }}>{subTask.title}</Typography>
                                                                        <Box sx={{ display: "flex", alignItems: 'center', width: '100%%', gap: 1 }}>
                                                                            <Box><img src={subTask.status === "not-done" ? NotDone : Done} alt={subTask.status === "not-done" ? "not-done-icon" : "done-icon"} height={12} width="100%"/></Box>
                                                                            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey.600' }}>{subTask.status === "not-done" ? "Not Done" : "Done"}</Typography>
                                                                        </Box>
                                                                    </Box>
                                                                ))
                                                            }
                                                        </>
                                                        )
                                                    }
                                                </Stack>
                                            </Stack>
                                        </Box>
                                    </Box>
                                    <MobileAppBar>
                                        <Box sx={{ cursor: 'pointer' }} onClick={() => setDeleteItem(true)}> 
                                            <Grid container spacing={3}>
                                                <StatusIcon action={() => setDeleteItem(true)}><img src={Delete} alt="delete-task-icon" height={15} width="100%"/></StatusIcon>
                                            </Grid>
                                        </Box>
                                        <StatusIcon action={() => navigate(`/edit-task/${id}`)}><img src={Edit} alt="edit-task-icon" height={15} width="100%"/></StatusIcon>
                                    </MobileAppBar>
                                </>
                            )
                        }
                    </>
                )
            }
        </>
    )
}