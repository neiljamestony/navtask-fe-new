import { useState, useEffect, useMemo } from 'react'
import { Box, Typography, Card, Button, Paper, Stack, IconButton, Badge, Grid, Chip, Divider } from '@mui/material'
import { Add } from '@mui/icons-material'
import dayjs from 'dayjs';
import { getTasks, removeTask } from '../../api/task/task';
import { useNavigate } from 'react-router-dom';
import type { GridRowSelectionModel, GridColumnVisibilityModel, GridRowParams, GridColDef } from '@mui/x-data-grid'; 
import { GRID_CHECKBOX_SELECTION_COL_DEF, DataGrid  } from '@mui/x-data-grid';
import toast from 'react-hot-toast';
import DeleteItems from './DeleteItems';
import { useSelector, useDispatch } from 'react-redux';
import { setFilteredPriorityItems, setFilteredStatusItems } from '../../reducer/DashboardSlice';
import { Eye, CopyCheck, SlidersHorizontal, SquarePen, ShieldCheck, ShieldOff, ShieldEllipsis, ShieldLock, Flag } from 'lucide-react'

// ICONS
import DeleteActive from '../../assets/Icons/Delete_active.svg';
import DeleteInactive from '../../assets/Icons/Delete_inactive.svg';
import Attachment from '../../assets/Icons/attachment.svg'
import FetchingTaskLoader from '../../assets/loader.svg';
import NoTaskFound from '../../assets/Icons/no-task-found.png';
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
    const [priorityEl, setPriorityEl] = useState<null | HTMLElement>(null);
    const [statusEl, setStatusEl] = useState<null | HTMLElement>(null);
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

    const borderDesign = {
        border: '1px solid', 
        borderRadius: 3, 
        borderColor: 'grey.500'
    }

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
                <Box sx={{ cursor: 'pointer' }} onClick={() => setDeleteItem(true)}> 
                    <Grid container spacing={3} sx={ids.length > 0 ? borderDesign : null}>
                        <Grid size={ids.length > 0 ? 6 : 12}>
                            <IconButton size="small" disabled={ids.length < 1}><img src={ids.length ? DeleteActive : DeleteInactive} alt="delete-item" height={20} width={20}/></IconButton>
                        </Grid>
                        {
                            ids.length > 0 && 
                            <Grid size={6}>
                                <Badge badgeContent={ids.length} sx={{ 
                                    "& .MuiBadge-badge": { 
                                        backgroundColor: "#62C6FF", 
                                        color: "white",
                                        top: 4
                                    } 
                                }}/>
                            </Grid>
                        }
                    </Grid>
                </Box>
            ),
        },
        { field: 'id', headerName: ""},
        { field: 'title', headerName: 'Title', width: openFilters ? 430 : 230, 
            renderCell: (params) => {
                const due_date = params.row.due_date;
                const attachments = params.row.attachments;
                return (
                    <Box sx={{ display: "flex", alignItems: 'center', justifyContent: 'flex-start', gap: 1, marginTop: 2 }}>
                        <Typography variant="caption" sx={{ paddingLeft: due_date === "" ? 10 : 0, fontWeight: 'bold', paddingTop: due_date === "" ? 2 : 0 }}>{params.row.title}</Typography>
                        {
                            due_date !== "" && attachments.length > 0 && <img src={Attachment} alt="attachment-icon" height={12} width={12}/>
                        }
                    </Box>
                )
                
            } 
        },
        { field: 'due_date', headerName: 'Due Date', width: 330, sortable: true, 
            renderCell: (params) => {
                if(params.value === "") return false
                const rawValue = params.value;
                const dueDateObj = rawValue ? dayjs(rawValue) : null;
                const currentInstant = dayjs();

                if (!dueDateObj) {
                    return <Typography variant="caption" sx={{ color: '#272D32', paddingTop: 1 }}>—</Typography>;
                }

                const isSameDayAsToday = params.row.status !== "completed" && currentInstant.isSame(dueDateObj, 'day');
                const isDue = params.row.status !== "completed" && currentInstant.isAfter(dueDateObj, 'day');

                const hoursRemaining = dueDateObj.diff(currentInstant, "hour");
                const criticalItems = params.row.status !== "completed" && params.row.priority === "critical" && hoursRemaining <= 48 && hoursRemaining >= 0;
                const formattedDisplayDate = dueDateObj.format("MM/DD/YYYY");

                if (isDue) {
                    return (
                        <Box sx={{ display: "flex", flexDirection: "column", paddingTop: 1 }}>
                            <Typography variant="caption" sx={{ color: '#CA0061' }}>{formattedDisplayDate}</Typography>
                            <Typography variant="caption" sx={{ color: '#CA0061', fontWeight: 'bold' }}>Overdue</Typography>
                        </Box>
                    );
                }

                if (isSameDayAsToday) {
                    return (
                        <Box sx={{ display: "flex", flexDirection: "column", paddingTop: 1 }}>
                            <Typography variant="caption" sx={{ color: '#009292' }}>{formattedDisplayDate}</Typography>
                            <Typography variant="caption" sx={{ color: '#009292', fontWeight: 'bold' }}>Today</Typography>
                        </Box>
                    );
                }

                if (criticalItems) {
                    return (
                        <Box sx={{ display: "flex", flexDirection: "column", paddingTop: 2 }}>
                            <Typography variant="caption" sx={{ color: '#009292' }}>{formattedDisplayDate}</Typography>
                        </Box>
                    );
                }

                return (
                    <Box sx={{ display: "flex", flexDirection: "column", paddingTop: 2 }}>
                        <Typography variant="caption" sx={{ color: '#272D32' }}>{formattedDisplayDate}</Typography>
                    </Box>
                );
                
            }
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
                        <IconButton onClick={() => params.field === "edit" && navigate(`/edit-task/${params.row.id}`)}>
                            <SquarePen size={20}/>
                        </IconButton>
                        <IconButton onClick={() => params.field === "edit" && navigate(`/view-task/${params.row.id}`)}>
                            <Eye size={20}/>
                        </IconButton>
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
                    <Grid container spacing={1}>
                        <Grid size={openFilters ? 2 : 0}>
                            {openFilters && <Filters priorityMenuItems={priorityMenuItems} statusMenuItems={statusMenuItems} />}
                        </Grid>
                        <Grid size={openFilters ? 10 : 12}>
                            <Box sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center', gap: 1, marginBottom: 2 }}>
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
                                    <Box sx={{ borderRadius: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                            <img src={FetchingTaskLoader} height={500} width={400} alt="fetching-task-loader"/>
                                        </Box>
                                        <Typography sx={{ fontSize: 25 }}>Fetching Tasks ...</Typography>
                                    </Box>
                                ): (
                                    <>
                                        {
                                            !displayedTasks.length ? (
                                                <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
                                                    <img src={NoTaskFound} alt="No tasks found" height={100} width={100}/>
                                                    <Typography sx={{ fontSize: 14, fontWeight: 'bold'}}>No data found</Typography>
                                                </Box>
                                            ): (
                                                <Paper sx={{ height: "81vh", width: '100%', borderRadius: 5 }}>
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
                                                        onColumnVisibilityModelChange={(newModel: GridColumnVisibilityModel) => setColumnVisibilityModel(newModel)}
                                                        checkboxSelection
                                                        sx={{ 
                                                            borderRadius: 5,
                                                            '& .MuiCheckbox-root.Mui-checked': {
                                                                color: '#62C6FF', 
                                                            },
                                                                '& .MuiDataGrid-row .MuiDataGrid-cellCheckbox .Mui-disabled': {
                                                                display: 'none',
                                                            },
                                                            minHeight: '80vh'
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