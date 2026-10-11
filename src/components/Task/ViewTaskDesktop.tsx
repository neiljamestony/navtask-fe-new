import {
  ViewTaskDesktopCardSurfaceStyle1,
  ViewTaskDesktopBoxLayoutStyle2,
  ViewTaskDesktopBoxLayoutStyle3,
  ViewTaskDesktopBoxLayoutStyle4,
  ViewTaskDesktopTypographyTextStyle5,
  ViewTaskDesktopTypographyTextStyle6,
  ViewTaskDesktopDividerSpacingStyle7,
  ViewTaskDesktopCardSurfaceStyle8,
  ViewTaskDesktopBoxLayoutStyle9,
  ViewTaskDesktopAvatarTextStyle10,
  ViewTaskDesktopTypographyTextStyle11,
  ViewTaskDesktopBoxLayoutStyle12,
  ViewTaskDesktopButtonSurfaceStyle13,
  ViewTaskDesktopButtonSurfaceStyle14,
  ViewTaskDesktopButtonSurfaceStyle15,
  ViewTaskDesktopCardSurfaceStyle16,
  ViewTaskDesktopBoxSurfaceStyle17,
  ViewTaskDesktopTypographyTextStyle18,
  ViewTaskDesktopCardHeaderSurfaceStyle19,
  ViewTaskDesktopCardContentLayoutStyle20,
  ViewTaskDesktopBoxLayoutStyle21,
  ViewTaskDesktopTypographyLayoutStyle22,
  ViewTaskDesktopChipTextStyle23,
  ViewTaskDesktopTypographyLayoutStyle24,
  ViewTaskDesktopChipTextStyle25,
  ViewTaskDesktopBoxGridStyle26,
  ViewTaskDesktopBoxLayoutStyle27,
  ViewTaskDesktopTypographyTextStyle28,
  ViewTaskDesktopBoxLayoutStyle29,
  ViewTaskDesktopTypographyTextStyle30,
  ViewTaskDesktopTypographyTextStyle31,
  ViewTaskDesktopCardSurfaceStyle32,
  ViewTaskDesktopBoxSpacingStyle33,
  ViewTaskDesktopTabsSpacingStyle34,
  ViewTaskDesktopBoxTextStyle35,
  ViewTaskDesktopBoxSpacingStyle36,
  ViewTaskDesktopBoxSurfaceStyle37,
  ViewTaskDesktopTabSurfaceStyle38,
  ViewTaskDesktopCardContentSizeStyle39,
  ViewTaskDesktopBoxSpacingStyle40
} from "../Styles/Task/ViewTaskDesktop/ViewTaskDesktop.styles";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { Box, Typography, IconButton, Divider, Grid, Button, Card, Avatar, CardHeader, CardContent, Chip, Tabs, Tab, useMediaQuery, useTheme } from "@mui/material";
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
import FetchingTask from "../NotFound/FetchingTask";
import TaskNotFound from "../NotFound/TaskNotFound";

export default function ViewTaskDesktop(){
    const { id } = useParams();
    const theme = useTheme();
    const smallLaptop = useMediaQuery(theme.breakpoints.down(1441))
    const [tab, setTab] = useState(0);
    const navigate = useNavigate();
    const [fetchingTask, setFetchingTask] = useState<boolean>(false)
    const [taskNotFound, setTaskNotFound] = useState(false)
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
        setTaskNotFound(false)
        try{
            const taskId = id as string;
            const result = await getTask(taskId);
            if(result.status === 401){
                toast.error("Session expired, please login again.");
                navigate("/login")
            }
            if(!result.length){
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
                        <FetchingTask/>
                    ):(
                        <>
                            {
                                taskNotFound ? (
                                    <TaskNotFound/>
                                ): (
                                    <Card variant="outlined" sx={ViewTaskDesktopCardSurfaceStyle1}>
                                        <DeleteItems loading={itemDeletionLoader} close={() => setDeleteItem(false)} proceed={handleDeleteItem} open={deleteItem} ids={[task.id.toString()]}/>
                                        <Box sx={ViewTaskDesktopBoxLayoutStyle2}>
                                            <IconButton size="small" onClick={() => navigate("/")}>
                                                <ChevronLeft size={14}/>
                                            </IconButton>
                                            <Box sx={ViewTaskDesktopBoxLayoutStyle3}>
                                                <Box sx={ViewTaskDesktopBoxLayoutStyle4}>
                                                    <CopyCheck size={20}/>
                                                    <Typography sx={ViewTaskDesktopTypographyTextStyle5}>Task</Typography>
                                                    <span>/</span>
                                                </Box>
                                                <Typography sx={ViewTaskDesktopTypographyTextStyle6}>Task Details</Typography>
                                            </Box>
                                        </Box>
                                        <Divider sx={ViewTaskDesktopDividerSpacingStyle7}/>
                                        <Card variant="outlined" sx={ViewTaskDesktopCardSurfaceStyle8}>
                                            <Grid container spacing={1}>
                                                <Grid size={6}>
                                                    <Box sx={ViewTaskDesktopBoxLayoutStyle9}>
                                                        <Avatar
                                                            variant="rounded"
                                                            sx={ViewTaskDesktopAvatarTextStyle10}
                                                            >
                                                            <ListTodo size={20} color="#9400D3" strokeWidth={3}/>
                                                        </Avatar>
                                                        <Typography variant="caption" sx={ViewTaskDesktopTypographyTextStyle11}>{task.title}</Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid size={6}>
                                                    <Box sx={ViewTaskDesktopBoxLayoutStyle12}>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<CopyCheck size={20} />}
                                                            sx={ViewTaskDesktopButtonSurfaceStyle13}
                                                            >
                                                            Create Sub Task
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<Edit size={20} />}
                                                            onClick={() => navigate(`/edit-task/${task.id}`)}
                                                            sx={ViewTaskDesktopButtonSurfaceStyle14}
                                                            >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<Trash size={20} />}
                                                            onClick={() => setDeleteItem(true)}
                                                            sx={ViewTaskDesktopButtonSurfaceStyle15}
                                                            >
                                                            Remove
                                                        </Button>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                        <Grid container spacing={1}>
                                            <Grid size={smallLaptop ? 3 : 2}>
                                                <Card
                                                    variant="outlined"
                                                    sx={ViewTaskDesktopCardSurfaceStyle16}
                                                    >
                                                    <CardHeader
                                                        avatar={
                                                        <Box
                                                            sx={ViewTaskDesktopBoxSurfaceStyle17}
                                                        >
                                                            <GripVertical size={18} />
                                                        </Box>
                                                        }
                                                        title={
                                                        <Typography variant="subtitle1" sx={ViewTaskDesktopTypographyTextStyle18}>
                                                            Task information
                                                        </Typography>
                                                        }
                                                        sx={ViewTaskDesktopCardHeaderSurfaceStyle19}
                                                    />

                                                    <CardContent
                                                        sx={ViewTaskDesktopCardContentLayoutStyle20}
                                                    >
                                                        <Box sx={ViewTaskDesktopBoxLayoutStyle21}>
                                                            <Box>
                                                                <Typography variant="caption" color="text.secondary" sx={ViewTaskDesktopTypographyLayoutStyle22}>Status</Typography>
                                                                <Chip
                                                                    size="small"
                                                                    icon={status?.icon}
                                                                    label={status?.label ?? "—"}
                                                                    sx={ViewTaskDesktopChipTextStyle23({ status: status })}
                                                                />
                                                            </Box>
                                                            <Box>
                                                                <Typography variant="caption" color="text.secondary" sx={ViewTaskDesktopTypographyLayoutStyle24}>Priority</Typography>
                                                                <Chip
                                                                    size="small"
                                                                    icon={priority?.icon}
                                                                    label={priority?.label ?? "—"}
                                                                    sx={ViewTaskDesktopChipTextStyle25({ priority: priority })}
                                                                />
                                                            </Box>
                                                            <Divider />
                                                            <Box sx={ViewTaskDesktopBoxGridStyle26}>
                                                                <Box>
                                                                    <Box sx={ViewTaskDesktopBoxLayoutStyle27}>
                                                                        <CalendarClock size={15} />
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            Due date
                                                                        </Typography>
                                                                    </Box>
                                                                    <Typography variant="body2" sx={ViewTaskDesktopTypographyTextStyle28}>
                                                                        {task.due_date ? dayjs(task.due_date).format("D MMM YYYY") : "Not set"}
                                                                    </Typography>
                                                                </Box>

                                                                <Box>
                                                                    <Box sx={ViewTaskDesktopBoxLayoutStyle29}>
                                                                        <CalendarCheck size={15} />
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            Created
                                                                        </Typography>
                                                                    </Box>
                                                                    <Typography variant="body2" sx={ViewTaskDesktopTypographyTextStyle30}>
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
                                                                            sx={ViewTaskDesktopTypographyTextStyle31}
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
                                            <Grid size={smallLaptop ? 9 : 10}>
                                                <Card variant="outlined" sx={ViewTaskDesktopCardSurfaceStyle32}>
                                                    <Box sx={ViewTaskDesktopBoxSpacingStyle33}>
                                                        <Tabs
                                                            value={tab}
                                                            onChange={(_, newValue) => setTab(newValue)}
                                                            aria-label="Task tabs"
                                                            sx={ViewTaskDesktopTabsSpacingStyle34}
                                                            >
                                                            {tabInfo.map((tabData, index) => (
                                                                <Tab
                                                                    key={tabData.name}
                                                                    value={index}
                                                                    label={
                                                                        <Box sx={ViewTaskDesktopBoxTextStyle35}>
                                                                            <Box sx={ViewTaskDesktopBoxSpacingStyle36}>{tabData.name}</Box>
                                                                            {tabData.count > 0 && <Box sx={ViewTaskDesktopBoxSurfaceStyle37}>{tabData.count}</Box>}
                                                                        </Box>
                                                                    }
                                                                    sx={ViewTaskDesktopTabSurfaceStyle38}
                                                                />
                                                            ))}
                                                        </Tabs>
                                                        <CardContent sx={ViewTaskDesktopCardContentSizeStyle39}>
                                                            <Box role="tabpanel" sx={ViewTaskDesktopBoxSpacingStyle40}>
                                                                {tab === 0 && <Subtask subtasks={task.subtask}/>}
                                                                {tab === 1 && <Attachments attachments={task.attachments}/>}
                                                            </Box>
                                                        </CardContent>
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