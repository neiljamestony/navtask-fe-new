import { useState, useEffect, useMemo } from 'react'
import { Box, Typography, Card, Button, Paper, Stack, IconButton, Grid, Chip, Divider, CircularProgress, Tooltip } from '@mui/material'
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
                    sx={{
                        minHeight: 38,
                        px: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        "&.Mui-disabled": {
                        color: "text.disabled",
                        },
                    }}
                    >
                    {ids.length > 0 ? `(${ids.length})` : ""}
                </Button>
            ),
        },
        { field: 'id', headerName: ""},
        { field: 'title', headerName: 'Title', flex: 1, minWidth: 160, 
            renderCell: (params) => {
                const due_date = params.row.due_date;
                return (
                    <Box sx={{ display: "flex", alignItems: 'center', justifyContent: 'flex-start', gap: 1, marginTop: 2 }}>
                        <Typography variant="caption" sx={{ paddingLeft: due_date === "" ? 10 : 0, fontWeight: 'bold', paddingTop: due_date === "" ? 2 : 0 }}>{params.row.title}</Typography>
                    </Box>
                )
                
            } 
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
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", lineHeight: 1.3 }}>
                    <Typography variant="body2" sx={{ color: "text.primary" }}>
                    {dueDate.format("MMM D, YYYY")}
                    </Typography>

                    {label && (
                    <Typography
                        variant="caption"
                        sx={{
                        color,
                        bgcolor: backgroundColor,
                        fontWeight: 600,
                        borderRadius: 1,
                        px: 0.75,
                        py: 0.25,
                        mt: 0.25,
                        width: "fit-content",
                        }}
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
                    <Chip icon={p && p.icon} label={p && p.label} sx={{ backgroundColor: p.bgColor, color: p.color, fontSize: 12 }}/>
                )
            } 
        },
        { field: 'status', headerName: 'Status', width: 200, sortable: true,
            renderCell: (params) => {
                const p = statusIcons[params.value as keyof typeof statusIcons];
                const subItem = subTaskStatusIcons[params.value as keyof typeof subTaskStatusIcons];
                if(!p && params.row.due_date === "" && subItem) {
                    return (
                        <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', gap: 1, paddingLeft: 5 }}>
                            <Box>{subItem.icon}</Box>
                            <Typography variant="caption">{subItem.label}</Typography>
                        </Box>
                    )
                }else{
                    return (
                        <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                            {
                                params.row.completed_date !== null && params.row.status === "completed" ? (
                                    <>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>{p.icon}</Box>
                                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: 1 }}>
                                            <Typography variant="caption" sx={{ lineHeight: 1.2 }}>{p.label}</Typography>
                                            <Typography variant="caption" sx={{ lineHeight: 1.2, color: '#818D99' }}>{dayjs(params.row.completed_date).format("MM/DD/YYYY")}</Typography>
                                        </Box>
                                    </>
                                   
                                ): (
                                    <Box>
                                        <Chip icon={p && p.icon} label={p && p.label} sx={{ backgroundColor: p.bgColor, color: p.color, fontSize: 12 }}/>
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
                    params.row.due_date !== "" && <Box sx={{ display: "flex", justifyContent: "center", alignItems: 'center', paddingTop: 1 }}>
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
                <Card variant="outlined" sx={{ padding: 2, borderRadius: 5, height: "93vh" }}>
                    <Box sx={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'start', gap: 1 }}>
                            <CopyCheck size={20}/>
                            <Typography sx={{ fontSize: 14 }}>Tasks</Typography>
                        </Box>
                        <Button type="button" variant="contained" sx={{ textTransform: 'none', borderRadius: 3, backgroundColor: 'black' }} startIcon={<Add/>} onClick={() => navigate('/new-task')}>Create</Button>
                    </Box>
                    <Divider sx={{ marginBottom: 2}}/>
                    <Grid container spacing={1} sx={{ width: "100%", minWidth: 0 }}>
                        <Grid size={openFilters ? 2 : 0}>
                            {openFilters && <Filters priorityMenuItems={priorityMenuItems} statusMenuItems={statusMenuItems} />}
                        </Grid>
                        <Grid size={openFilters ? 10 : 12}>
                            <Box sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center', gap: 1, marginBottom: 1 }}>
                                <Button 
                                    type="button" 
                                    variant="outlined" 
                                    sx={{ 
                                        textTransform: 'none', 
                                        backgroundColor: '#fff', 
                                        color: 'black', 
                                        borderColor: 'grey.300', 
                                        borderRadius: 3 
                                    }}
                                    onClick={() => setOpenFilters(!openFilters)}
                                    startIcon={
                                        <SlidersHorizontal size={15}/>
                                    }>{openFilters ? "Hide Filters" : "Show Filters"}
                                </Button>
                            </Box>
                            {
                                fetchingTasks ? (
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
                                ): (
                                    <>
                                        {
                                            !displayedTasks.length ? (
                                                <Box
                                                    sx={{
                                                        minHeight: 240,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        gap: 1.5,
                                                        px: 3,
                                                        py: 4,
                                                        border: "1px dashed",
                                                        borderColor: "divider",
                                                        borderRadius: 3,
                                                        bgcolor: "grey.50",
                                                        textAlign: "center",
                                                    }}
                                                    >
                                                    <Box
                                                        sx={{
                                                        width: 72,
                                                        height: 72,
                                                        display: "grid",
                                                        placeItems: "center",
                                                        borderRadius: "50%",
                                                        bgcolor: "common.white",
                                                        border: "1px solid",
                                                        borderColor: "divider",
                                                        }}
                                                    >
                                                        <StickyNotes size={30} color="#9e9e9e"/>
                                                    </Box>
                                                        <Box>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                                                {hasActiveFilters ? "No matching tasks" : "No tasks yet"}
                                                            </Typography>

                                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                                {hasActiveFilters
                                                                ? "Try changing or clearing your filters to see more tasks."
                                                                : "Your tasks will appear here once they’re added."}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                            ): (
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        height: "81vh",
                                                        width: "100%",
                                                        overflow: "hidden",
                                                        border: "1px solid",
                                                        borderColor: "divider",
                                                        borderRadius: 3,
                                                        bgcolor: "background.paper",
                                                    }}
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
                                                        sx={{
                                                        height: "100%",
                                                        border: 0,
                                                        color: "text.primary",

                                                        "& .MuiDataGrid-columnHeaders": {
                                                            bgcolor: "#f8fafc",
                                                            borderBottom: "1px solid",
                                                            borderColor: "divider",
                                                        },
                                                        "& .MuiDataGrid-columnHeaderTitle": {
                                                            fontWeight: 700,
                                                            fontSize: 13,
                                                            color: "text.secondary",
                                                        },
                                                        "& .MuiDataGrid-cell": {
                                                            borderColor: "divider",
                                                            display: "flex",
                                                            alignItems: "center",
                                                        },
                                                        "& .MuiDataGrid-row": {
                                                            transition: "background-color 120ms ease",
                                                            "&:hover": { bgcolor: "#f8fafc" },
                                                            "&.Mui-selected": {
                                                            bgcolor: "rgba(25, 118, 210, 0.06)",
                                                            "&:hover": { bgcolor: "rgba(25, 118, 210, 0.1)" },
                                                            },
                                                        },
                                                        "& .MuiCheckbox-root.Mui-checked": {
                                                            color: "primary.main",
                                                        },
                                                        "& .MuiDataGrid-row .MuiDataGrid-cellCheckbox .Mui-disabled": {
                                                            visibility: "hidden",
                                                        },
                                                        "& .MuiDataGrid-columnSeparator": {
                                                            color: "divider",
                                                        },
                                                        "& .MuiDataGrid-overlay": {
                                                            bgcolor: "background.paper",
                                                        },
                                                        }}
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