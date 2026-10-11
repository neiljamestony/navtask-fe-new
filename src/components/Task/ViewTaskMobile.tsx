import {
  ViewTaskMobileAppBarSurfaceStyle1,
  ViewTaskMobileToolbarSizeStyle2,
  ViewTaskMobileIconButtonSurfaceStyle3,
  ViewTaskMobileArrowBackIosNewRoundedTextStyle4,
  ViewTaskMobileBoxSizeStyle5,
  ViewTaskMobileTypographySizeStyle6,
  ViewTaskMobileTypographyTextStyle7,
  ViewTaskMobileBoxSizeStyle8,
  ViewTaskMobileBoxTextStyle9,
  ViewTaskMobileBoxLayoutStyle10,
  ViewTaskMobileBoxSurfaceStyle11,
  ViewTaskMobileBoxLayoutStyle12,
  ViewTaskMobileChipTextStyle13,
  ViewTaskMobileChipTextStyle14,
  ViewTaskMobileTypographyTextStyle15,
  ViewTaskMobileBoxSurfaceStyle16,
  ViewTaskMobileBoxLayoutStyle17,
  ViewTaskMobileBoxSurfaceStyle18,
  ViewTaskMobileBoxSizeStyle19,
  ViewTaskMobileTypographyTextStyle20,
  ViewTaskMobileBoxSurfaceStyle21,
  ViewTaskMobileTypographyTextStyle22,
  ViewTaskMobileTypographySizeStyle23,
  ViewTaskMobileBoxSurfaceStyle24,
  ViewTaskMobileTypographyTextStyle25,
  ViewTaskMobileBoxGridStyle26,
  ViewTaskMobileBoxSizeStyle27,
  ViewTaskMobileBoxTextStyle28,
  ViewTaskMobileBoxSurfaceStyle29,
  ViewTaskMobileTypographyTextStyle30,
  ViewTaskMobileBoxSurfaceStyle31,
  ViewTaskMobileTypographyTextStyle32,
  ViewTaskMobileBoxLayoutStyle33,
  ViewTaskMobileBoxSurfaceStyle34,
  ViewTaskMobileAvatarTextStyle35,
  ViewTaskMobileTypographyLayoutStyle36,
  ViewTaskMobileChipTextStyle37
} from "../Styles/Task/ViewTaskMobile/ViewTaskMobile.styles";
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
                sx={ViewTaskMobileAppBarSurfaceStyle1}
                >
                <Toolbar sx={ViewTaskMobileToolbarSizeStyle2}>
                    <IconButton
                    aria-label="Back to tasks"
                    onClick={() => navigate("/")}
                    sx={ViewTaskMobileIconButtonSurfaceStyle3}
                    >
                    <ArrowBackIosNewRounded sx={ViewTaskMobileArrowBackIosNewRoundedTextStyle4} />
                    </IconButton>

                    <Box sx={ViewTaskMobileBoxSizeStyle5}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={ViewTaskMobileTypographySizeStyle6}
                    >
                        Tasks / Details
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        sx={ViewTaskMobileTypographyTextStyle7}
                    >
                        {task.title || "Task details"}
                    </Typography>
                    </Box>
                </Toolbar>
                </AppBar>

            {fetchingTask ? (
                <Box
                    sx={ViewTaskMobileBoxSizeStyle8}
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
                    sx={ViewTaskMobileBoxTextStyle9}
                >
                    <Box sx={ViewTaskMobileBoxLayoutStyle10}>
                        <Box
                            sx={ViewTaskMobileBoxSurfaceStyle11}
                        >
                            <Box sx={ViewTaskMobileBoxLayoutStyle12}>
                                {priority && (
                                    <Chip
                                        size="small"
                                        icon={priority.icon}
                                        label={priority.label}
                                        sx={ViewTaskMobileChipTextStyle13({ priority: priority })}
                                    />
                                )}
                                {status && (
                                    <Chip
                                        size="small"
                                        icon={status.icon}
                                        label={status.label}
                                        sx={ViewTaskMobileChipTextStyle14({ status: status })}
                                    />
                                )}
                            </Box>

                            <Typography
                                variant="h5"
                                sx={ViewTaskMobileTypographyTextStyle15}
                            >
                                {task.title}
                            </Typography>

                            <Box
                                sx={ViewTaskMobileBoxSurfaceStyle16}
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
                                    sx={ViewTaskMobileBoxLayoutStyle17}
                                    >
                                    <Box
                                        sx={ViewTaskMobileBoxSurfaceStyle18}
                                    >
                                        {date.icon}
                                    </Box>

                                    <Box sx={ViewTaskMobileBoxSizeStyle19}>
                                        <Typography variant="caption" color="text.secondary">
                                        {date.label}
                                        </Typography>
                                        <Typography variant="body2" sx={ViewTaskMobileTypographyTextStyle20}>
                                        {date.value}
                                        </Typography>
                                    </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {task.description && (
                            <Box
                                sx={ViewTaskMobileBoxSurfaceStyle21}
                            >
                                <Typography variant="subtitle2" sx={ViewTaskMobileTypographyTextStyle22}>
                                Description
                                </Typography>
                                <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={ViewTaskMobileTypographySizeStyle23}
                                >
                                {task.description}
                                </Typography>
                            </Box>
                        )}

                        {task.attachments && task.attachments.length > 0 && (
                            <Box
                                sx={ViewTaskMobileBoxSurfaceStyle24}
                            >
                                <Typography variant="subtitle2" sx={ViewTaskMobileTypographyTextStyle25}>
                                    Attachments ({task.attachments.length})
                                </Typography>

                                <Box
                                    sx={ViewTaskMobileBoxGridStyle26}
                                >
                                {task.attachments.map((item, key) => (
                                    <Box key={`${item.name}-${key}`} sx={ViewTaskMobileBoxSizeStyle27}>
                                    {item.url && (
                                        <Box
                                        component="a"
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        sx={ViewTaskMobileBoxTextStyle28}
                                        >
                                        <Box
                                            component="img"
                                            src={item.url}
                                            alt={item.name}
                                            sx={ViewTaskMobileBoxSurfaceStyle29}
                                        />
                                        <Typography
                                            variant="caption"
                                            title={item.name}
                                            sx={ViewTaskMobileTypographyTextStyle30}
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
                            sx={ViewTaskMobileBoxSurfaceStyle31}
                        >
                            <Typography variant="subtitle2" sx={ViewTaskMobileTypographyTextStyle32}>
                                Subtasks
                                <Typography component="span" variant="caption" color="text.secondary">
                                {" "}({task.subtask.length})
                                </Typography>
                            </Typography>

                            {task.subtask.length > 0 ? (
                                
                                <Box sx={ViewTaskMobileBoxLayoutStyle33}>
                                {task.subtask.map((subTask, key) => {
                                    const subtaskStatus = subTaskStatusIcons[subTask?.status as keyof typeof subTaskStatusIcons]
                                    return (
                                    <Box
                                        key={`${subTask.title}-${key}`}
                                        sx={ViewTaskMobileBoxSurfaceStyle34}
                                    >
                                        <Avatar
                                            variant="rounded"
                                            sx={ViewTaskMobileAvatarTextStyle35}
                                            >
                                            <ListTodo size={18} />
                                        </Avatar>
                                    <Typography variant="body2" sx={ViewTaskMobileTypographyLayoutStyle36}>
                                        {subTask.title}
                                    </Typography>
                                    {subtaskStatus && (
                                        <Chip
                                            size="small"
                                            icon={subtaskStatus.icon}
                                            label={subtaskStatus.label}
                                            sx={ViewTaskMobileChipTextStyle37({ subtaskStatus: subtaskStatus })}
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