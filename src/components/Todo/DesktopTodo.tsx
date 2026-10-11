import {
  DesktopTodoButtonSurfaceStyle1,
  DesktopTodoBoxLayoutStyle2,
  DesktopTodoTypographyTextStyle3,
  DesktopTodoBoxSizeStyle4,
  DesktopTodoTypographyTextStyle5,
  DesktopTodoTypographySurfaceStyle6,
  DesktopTodoChipSurfaceStyle7,
  DesktopTodoBoxLayoutStyle8,
  DesktopTodoBoxLayoutStyle9,
  DesktopTodoBoxLayoutStyle10,
  DesktopTodoBoxLayoutStyle11,
  DesktopTodoTypographySizeStyle12,
  DesktopTodoTypographyTextStyle13,
  DesktopTodoChipSurfaceStyle14,
  DesktopTodoBoxLayoutStyle15,
  DesktopTodoCardSurfaceStyle16,
  DesktopTodoBoxLayoutStyle17,
  DesktopTodoBoxLayoutStyle18,
  DesktopTodoTypographyTextStyle19,
  DesktopTodoButtonSurfaceStyle20,
  DesktopTodoDividerSpacingStyle21,
  DesktopTodoGridSizeStyle22,
  DesktopTodoBoxSpacingStyle23,
  DesktopTodoBoxLayoutStyle24,
  DesktopTodoButtonSurfaceStyle25,
  DesktopTodoPaperSurfaceStyle26,
  DesktopTodoStackLayoutStyle27,
  DesktopTodoBoxSizeStyle28,
  DesktopTodoBoxSizeStyle29,
  DesktopTodoBoxSurfaceStyle30,
  DesktopTodoBoxTextStyle31,
  DesktopTodoTypographyTextStyle32,
  DesktopTodoBoxLayoutStyle33,
  DesktopTodoBoxSurfaceStyle34,
  DesktopTodoBoxSurfaceStyle35,
  DesktopTodoBoxSurfaceStyle36,
  DesktopTodoTypographyTextStyle37,
  DesktopTodoTypographySpacingStyle38,
  DesktopTodoPaperSurfaceStyle39,
  DesktopTodoDataGridTitleStyle40
} from "../Styles/Todo/DesktopTodo/DesktopTodo.styles";
import { useState, useEffect, useMemo } from 'react'
import { Box, Typography, Card, Button, Paper, Stack, IconButton, Grid, Chip, Divider, CircularProgress, Tooltip, useTheme, useMediaQuery } from '@mui/material'
import { Add } from '@mui/icons-material'
import { getTasks, removeTask } from '../../api/task/task';
import { useNavigate } from 'react-router-dom';
import type { GridRowSelectionModel, GridColumnVisibilityModel, GridRowParams, GridColDef } from '@mui/x-data-grid'; 
import { GRID_CHECKBOX_SELECTION_COL_DEF, DataGrid  } from '@mui/x-data-grid';
import { useSelector, useDispatch } from 'react-redux';
import { setFilteredPriorityItems, setFilteredStatusItems } from '../../reducer/DashboardSlice';
import { Eye, CopyCheck, SlidersHorizontal, SquarePen, ShieldCheck, ShieldOff, ShieldEllipsis, ShieldLock, Flag, Trash, TrashOff, StickyNotes } from 'lucide-react'
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import DeleteItems from './DeleteItems';

// ICONS
import Filters from './Filters/Filters';
import ButtonGridFilterMenuItems from './Filters/ButtonGridMenuItems';

export const prioritiesIcons = {
    low: {
        icon: <Flag size={14} color="#2563EB"/>,
        label: "Low",
        bgColor: "rgba(37, 99, 235, 0.12)",
        color: "#2563EB"
    },
    high: {
        icon: <Flag size={14} color="#EA580C"/>,
        label: "High",
        bgColor: "rgba(234, 88, 12, 0.12)",
        color: "#EA580C"
    },
    critical: {
        icon: <Flag size={14} color="#DC2626"/>,
        label: "Critical",
        bgColor: "rgba(220, 38, 38, 0.12)",
        color: "#DC2626"
    },
}

export const statusIcons = {
    "not-started": {
        icon: <ShieldLock size={14} color="#64748B"/>,
        label: "Not Started",
        bgColor: "rgba(100, 116, 139, 0.12)",
        color: "#64748B"
    },
    "in-progress": {
        icon: <ShieldEllipsis size={14} color="#2563EB"/>,
        label: "In Progress",
        bgColor: "rgba(37, 99, 235, 0.12)",
        color: "#2563EB"
    },
    "completed": {
        icon: <ShieldCheck size={14} color="#16A34A"/>,
        label: "Completed",
        bgColor: "rgba(22, 163, 74, 0.12)",
        color: "#16A34A"
    },
    "cancelled": {
        icon: <ShieldOff size={14} color="#DC2626"/>,
        label: "Cancelled",
        bgColor: "rgba(220, 38, 38, 0.12)",
        color: "#DC2626"
    },
}

export const subTaskStatusIcons = {
    "not-done": {
        icon: <ShieldOff size={14} color="#DC2626"/>,
        label: "Not Done",
        bgColor: "rgba(220, 38, 38, 0.12)",
        color: "#DC2626"
    },
    "done": {
        icon: <ShieldCheck size={14} color="#16A34A"/>,
        label: "Done",
        bgColor: "rgba(22, 163, 74, 0.12)",
        color: "#16A34A"
    }
}

interface SubTask {
    id: number;
    status: string;
    title: string;
}

interface Task {
    completed_date: null,
    created_at: string;
    due_date: string;
    id: number;
    priority: string;
    status: string;
    subtask: SubTask[] | [],
    title: string;
    user_id: number;
}

export default function DesktopTodo() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const smallLaptop = useMediaQuery(theme.breakpoints.down(1441))
    const { filteredPriorityItems, filteredStatusItems } = useSelector((state: any) => state.dashboard);
    const [allTasks, setAllTasks] = useState<Task[] | []>([]);
    const [fetchingTasks, setFetchingTasks] = useState(false);
    const [ids, setIds] = useState<string[] | []>([])
    const [openFilters, setOpenFilters] = useState(false)
    const [deleteItem, setDeleteItem] = useState(false)
    const [loadingitemRemoval, setitemRemoval] = useState(false)
    const [rowSelectioChangeModel, setRowSelectionChangeModel] = useState<GridRowSelectionModel>({
        type: 'include',
        ids: new Set()
    })
    const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
        id: false
    })

    const statusMenuItems = [
        {
            value: 'all-status',
            name: 'All',
            action: (name: string) => handleFilterStatusItems(name)
        },
        {
            value: 'not-started',
            name: 'Not Started',
            action: (name: string) => handleFilterStatusItems(name)
        },
        {
            value: 'in-progress',
            name: 'In Progress',
            action: (name: string) => handleFilterStatusItems(name)
        },
        {
            value: 'completed',
            name: 'Completed',
            action: (name: string) => handleFilterStatusItems(name)
        },
        {
            value: 'cancelled',
            name: 'Cancelled',
            action: (name: string) => handleFilterStatusItems(name)
        }
    ]

    const priorityMenuItems = [
        {
            value: 'all-priority',
            name: 'All',
            action: (name: string) => handleFilterPriorityItems(name)
        },
         {
            value: 'low',
            name: 'Low',
            action: (name: string) => handleFilterPriorityItems(name)
        },
        {
            value: 'high',
            name: 'High',
            action: (name: string) => handleFilterPriorityItems(name)
        },
        {
            value: 'critical',
            name: 'Critical',
            action: (name: string) => handleFilterPriorityItems(name)
        }
    ]

    const statusMap = new Map(statusMenuItems.map(item => [item.name, item.value]));
    const priorityMap = new Map(priorityMenuItems.map(item => [item.name, item.value]));
    const hasActiveFilters = Boolean(filteredPriorityItems || filteredStatusItems);

    const handleDeleteItem = async (ids: string[] | []) => {
        setitemRemoval(true)
        const result = await removeTask(ids);
        if(result?.status === 200){
            fetch()
            setIds([])
            setitemRemoval(false)
            setRowSelectionChangeModel({
                type: 'include',
                ids: new Set()
            })
            setDeleteItem(false)
        }else{
            setIds([])
            setitemRemoval(false)
            setRowSelectionChangeModel({
                type: 'include',
                ids: new Set()
            })
            toast.error(result?.msg)
        }
    }

    const handleFilterPriorityItems = (item: string) => dispatch(setFilteredPriorityItems(filteredPriorityItems === item ? "" : item))

    const handleFilterStatusItems = (item: string) => dispatch(setFilteredStatusItems(filteredStatusItems === item ? "" : item))

    const columns: GridColDef[] = [
        {
            ...GRID_CHECKBOX_SELECTION_COL_DEF,
            width: 80,
            renderHeader: () => (
                <Button
                    type="button"
                    variant={ids.length > 0 ? "outlined" : "text"}
                    color="error"
                    disabled={ids.length === 0}
                    onClick={() => setDeleteItem(true)}
                    startIcon={ids.length > 0 ? <Trash size={18} /> : <TrashOff size={18} />}
                    sx={DesktopTodoButtonSurfaceStyle1}
                    >
                    {ids.length > 0 ? `(${ids.length})` : ""}
                </Button>
            ),
        },
        { field: 'id', headerName: ""},
        {
            field: "title",
            headerName: "Title",
            flex: 1,
            minWidth: 200,
            renderCell: (params) => {
                const dueDate = params.row.due_date;

                return (
                <Box sx={DesktopTodoBoxLayoutStyle2}>
                    <Typography
                    variant="caption"
                    sx={DesktopTodoTypographyTextStyle3({ dueDate: dueDate })}
                    >
                    {params.row.title}
                    </Typography>
                </Box>
                );
            },
        },
        {
            field: "due_date",
            headerName: "Due Date",
            width: 180,
            sortable: true,
            renderCell: ({ value, row }) => {
                if (!value) return "—";

                const dueDate = dayjs(value);
                if (!dueDate.isValid()) return "—";

                const now = dayjs();
                const isCompleted = row.status === "completed";
                const isOverdue = !isCompleted && dueDate.isBefore(now, "day");
                const isDueToday = !isCompleted && dueDate.isSame(now, "day");
                const hoursRemaining = dueDate.diff(now, "hour");
                const isCriticalSoon =
                !isCompleted &&
                row.priority === "critical" &&
                hoursRemaining >= 0 &&
                hoursRemaining <= 48;

                let label = "";
                let color = "text.secondary";
                let backgroundColor = "transparent";

                if (isOverdue) {
                label = "Overdue";
                color = "error.main";
                backgroundColor = "error.lighter";
                } else if (isDueToday) {
                label = "Today";
                color = "warning.dark";
                backgroundColor = "warning.lighter";
                } else if (isCriticalSoon) {
                label = "Critical · due soon";
                color = "error.main";
                backgroundColor = "error.lighter";
                }

                return (
                <Box sx={DesktopTodoBoxSizeStyle4}>
                    <Typography variant="body2" sx={DesktopTodoTypographyTextStyle5}>
                    {dueDate.format("MMM D, YYYY")}
                    </Typography>

                    {label && (
                    <Typography
                        variant="caption"
                        sx={DesktopTodoTypographySurfaceStyle6({ color: color, backgroundColor: backgroundColor })}
                    >
                        {label}
                    </Typography>
                    )}
                </Box>
                );
            },
            },
        { field: 'priority', 
            headerName: 'Priority', 
            width: 200, 
            sortable: true, 
            renderCell: (params) => {
                const p = prioritiesIcons[params.value as keyof typeof prioritiesIcons];
                if(!p) return params.value;
                return (
                    <Chip icon={p && p.icon} label={p && p.label} sx={DesktopTodoChipSurfaceStyle7({ p: p })}/>
                )
            } 
        },
        { field: 'status', headerName: 'Status', width: 200, sortable: true,
            renderCell: (params) => {
                const p = statusIcons[params.value as keyof typeof statusIcons];
                const subItem = subTaskStatusIcons[params.value as keyof typeof subTaskStatusIcons];
                if(!p && params.row.due_date === "" && subItem) {
                    return (
                        <Box sx={DesktopTodoBoxLayoutStyle8}>
                            <Box>{subItem.icon}</Box>
                            <Typography variant="caption">{subItem.label}</Typography>
                        </Box>
                    )
                }else{
                    return (
                        <Box sx={DesktopTodoBoxLayoutStyle9}>
                            {
                                params.row.completed_date !== null && params.row.status === "completed" ? (
                                    <>
                                        <Box sx={DesktopTodoBoxLayoutStyle10}>{p.icon}</Box>
                                          <Box sx={DesktopTodoBoxLayoutStyle11}>
                                            <Typography variant="caption" sx={DesktopTodoTypographySizeStyle12}>{p.label}</Typography>
                                            <Typography variant="caption" sx={DesktopTodoTypographyTextStyle13}>{dayjs(params.row.completed_date).format("MM/DD/YYYY")}</Typography>
                                        </Box>
                                    </>
                                   
                                ): (
                                    <Box>
                                        <Chip icon={p && p.icon} label={p && p.label} sx={DesktopTodoChipSurfaceStyle14({ p: p })}/>
                                    </Box>
                                )
                            }
                            
                        </Box>
                    )
                }
                
            } 
        },
        { field: 'edit', headerName: 'Actions', width: 50, sortable: false, flex: 1,
            renderCell: (params) => {
                return (
                    params.row.due_date !== "" && <Box sx={DesktopTodoBoxLayoutStyle15}>
                        <Tooltip title="Edit Task">
                            <IconButton onClick={() => params.field === "edit" && navigate(`/edit-task/${params.row.id}`)}>
                                <SquarePen size={20}/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="View Task">
                             <IconButton onClick={() => params.field === "edit" && navigate(`/view-task/${params.row.id}`)}>
                                <Eye size={20}/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                )
            },
        },
    ];

    const fetch = async () => {
        setFetchingTasks(true)
        try{
            const result = await getTasks();
            if(result.status === 401){
                toast.error("Session expired, please login again.");
                navigate("/login")
            }
            setAllTasks(result)
            setFetchingTasks(false)
        }catch(error: unknown){
            toast.error("Error fetching tasks, please reload the page.");
            setFetchingTasks(false)
        }
    }

    const handleSelectionChange = (newSelectionModel: GridRowSelectionModel) => {
        const ids = newSelectionModel.ids;
        let newIds: any = [];
        Array.from(ids).map((item) => {
            newIds.push(item.toString())
        })
        setIds(newIds)
        setRowSelectionChangeModel(newSelectionModel)
    };

    const displayedTasks = useMemo(() => {
        let result = allTasks;

        const hasFilters = filteredPriorityItems !== "" || filteredStatusItems !== "";
        
        if (hasFilters) {
            const selectedStatus = statusMap.get(filteredStatusItems);
            const selectedPriority = priorityMap.get(filteredPriorityItems);
            const bypassStatus = !selectedStatus || selectedStatus === "all-status";
            const bypassPriority = !selectedPriority || selectedPriority === "all-priority";
            result = allTasks.filter((task) => {
                const matchesStatus = bypassStatus || task.status === selectedStatus;
                const matchesPriority = bypassPriority || task.priority === selectedPriority;
                
                return matchesStatus && matchesPriority;
            });
        }
        
        return result
    
    }, [allTasks, filteredPriorityItems, filteredStatusItems]);

    const handleCancelDelete = () => {
        setDeleteItem(false)
        setIds([])
        setRowSelectionChangeModel({
            type: 'include',
            ids: new Set()
        })
        setitemRemoval(false)
    }

    useEffect(() => {
        let done = true;
        done && fetch();

        return () => {
            done = false
        }
    }, [])

    return (
        <>
            <DeleteItems loading={loadingitemRemoval} close={handleCancelDelete} proceed={handleDeleteItem} open={deleteItem} ids={ids}/>
            <Stack spacing={2}>
                <Card variant="outlined" sx={DesktopTodoCardSurfaceStyle16}>
                    <Box sx={DesktopTodoBoxLayoutStyle17}>
                        <Box sx={DesktopTodoBoxLayoutStyle18}>
                            <CopyCheck size={20}/>
                            <Typography sx={DesktopTodoTypographyTextStyle19}>Tasks</Typography>
                        </Box>
                        <Button type="button" variant="contained" sx={DesktopTodoButtonSurfaceStyle20} startIcon={<Add/>} onClick={() => navigate('/new-task')}>Create</Button>
                    </Box>
                    <Divider sx={DesktopTodoDividerSpacingStyle21}/>
                    <Grid container spacing={1} sx={DesktopTodoGridSizeStyle22}>
                        <Grid size={openFilters ? 2 : 0}>
                            {!smallLaptop && openFilters && <Filters priorityMenuItems={priorityMenuItems} statusMenuItems={statusMenuItems} />}
                        </Grid>
                        <Grid size={!smallLaptop && openFilters ? 10 : 12}>
                            <Box sx={DesktopTodoBoxSpacingStyle23}>
                                <Box sx={DesktopTodoBoxLayoutStyle24({ openFilters: openFilters })}>
                                    <Button
                                        type="button"
                                        variant={openFilters ? "contained" : "outlined"}
                                        aria-expanded={openFilters}
                                        onClick={() => setOpenFilters((open) => !open)}
                                        startIcon={<SlidersHorizontal size={15} />}
                                        sx={DesktopTodoButtonSurfaceStyle25({ openFilters: openFilters })}
                                    >
                                    {openFilters ? "Hide filters" : "Show filters"}
                                    </Button>
                                </Box>

                                {smallLaptop && openFilters && (
                                    <Paper
                                    variant="outlined"
                                    sx={DesktopTodoPaperSurfaceStyle26}
                                    >
                                        <Stack
                                            direction="row"
                                            useFlexGap
                                            spacing={2}
                                            sx={DesktopTodoStackLayoutStyle27}
                                            >
                                            <Box sx={DesktopTodoBoxSizeStyle28}>
                                                <ButtonGridFilterMenuItems
                                                filterMenuItems={statusMenuItems}
                                                name="Status"
                                                />
                                            </Box>

                                            <Box sx={DesktopTodoBoxSizeStyle29}>
                                                <ButtonGridFilterMenuItems
                                                filterMenuItems={priorityMenuItems}
                                                name="Priority"
                                                />
                                            </Box>
                                        </Stack>
                                    </Paper>
                                )}
                            </Box>
                            {
                                fetchingTasks ? (
                                    <Box
                                        role="status"
                                        aria-live="polite"
                                        sx={DesktopTodoBoxSurfaceStyle30}
                                        >
                                        <CircularProgress size={28} />
                                        <Box sx={DesktopTodoBoxTextStyle31}>
                                            <Typography variant="subtitle2" sx={DesktopTodoTypographyTextStyle32}>
                                            Loading your tasks
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                            This should only take a moment.
                                            </Typography>
                                        </Box>

                                        <Box sx={DesktopTodoBoxLayoutStyle33}>
                                            {[0, 1, 2].map((dot) => (
                                            <Box
                                                key={dot}
                                                sx={DesktopTodoBoxSurfaceStyle34({ dot: dot })}
                                            />
                                            ))}
                                        </Box>
                                    </Box>
                                ): (
                                    <>
                                        {
                                            !displayedTasks.length ? (
                                                <Box
                                                    sx={DesktopTodoBoxSurfaceStyle35}
                                                    >
                                                    <Box
                                                        sx={DesktopTodoBoxSurfaceStyle36}
                                                    >
                                                        <StickyNotes size={30} color="#9e9e9e"/>
                                                    </Box>
                                                        <Box>
                                                            <Typography variant="subtitle1" sx={DesktopTodoTypographyTextStyle37}>
                                                                {hasActiveFilters ? "No matching tasks" : "No tasks yet"}
                                                            </Typography>

                                                            <Typography variant="body2" color="text.secondary" sx={DesktopTodoTypographySpacingStyle38}>
                                                                {hasActiveFilters
                                                                ? "Try changing or clearing your filters to see more tasks."
                                                                : "Your tasks will appear here once they’re added."}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                            ): (
                                                <Paper
                                                    elevation={0}
                                                    sx={DesktopTodoPaperSurfaceStyle39}
                                                    >
                                                    <DataGrid
                                                        rows={displayedTasks}
                                                        columns={columns}
                                                        hideFooterPagination
                                                        hideFooterSelectedRowCount
                                                        disableColumnResize
                                                        disableRowSelectionOnClick
                                                        isRowSelectable={(params: GridRowParams) => params.row.due_date !== ""}
                                                        rowSelectionModel={rowSelectioChangeModel}
                                                        onRowSelectionModelChange={handleSelectionChange}
                                                        columnVisibilityModel={columnVisibilityModel}
                                                        onColumnVisibilityModelChange={(newModel: GridColumnVisibilityModel) =>
                                                        setColumnVisibilityModel(newModel)
                                                        }
                                                        checkboxSelection
                                                        sx={DesktopTodoDataGridTitleStyle40}
                                                    />
                                                    </Paper>
                                            )
                                        }
                                    </>
                                )
                            }
                        </Grid>
                    </Grid>
                </Card>
            </Stack>
        </>
    )
}