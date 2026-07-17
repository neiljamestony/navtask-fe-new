import React, { useState, useEffect, useMemo } from 'react'
import { Box, Typography, Card, Button, Paper, Stack, IconButton, Badge, Grid, Link, Menu, MenuItem, Chip } from '@mui/material'
import { Add, ArrowRightOutlined } from '@mui/icons-material'
import dayjs from 'dayjs';
import { getTasks, removeTask } from '../../api/task/task';
import { useNavigate } from 'react-router-dom';
import type { GridRowSelectionModel, GridColumnVisibilityModel, GridRowParams, GridColDef } from '@mui/x-data-grid'; 
import { GRID_CHECKBOX_SELECTION_COL_DEF, DataGrid  } from '@mui/x-data-grid';
import toast from 'react-hot-toast';
import DeleteItems from './DeleteItems';

// ICONS
import FilterIcon from '../../assets/Icons/Filter.svg';
import Low from '../../assets/Icons/Low_table.svg';
import High from '../../assets/Icons/High_table.svg';
import Critical from '../../assets/Icons/Critical_table.svg';
import NotStarted from '../../assets/Icons/Not Started.svg';
import Cancelled from '../../assets/Icons/Cancelled.svg';
import Completed from '../../assets/Icons/Complete.svg';
import InProgress from '../../assets/Icons/In Progress.svg';
import Edit from '../../assets/Icons/Edit.svg';
import DeleteActive from '../../assets/Icons/Delete_active.svg';
import DeleteInactive from '../../assets/Icons/Delete_inactive.svg';
import ExpandSubTaskActive from '../../assets/Icons/Accordion_expand.svg'
import ExpandSubTaskInActive from '../../assets/Icons/Accordion_supress.svg'
import Done from '../../assets/Icons/Done.svg';
import NotDone from '../../assets/Icons/Not Done.svg';
import Attachment from '../../assets/Icons/attachment.svg'
import FetchingTaskLoader from '../../assets/loader.svg';

export const prioritiesIcons = {
    low: {
        icon: <img src={Low} alt="low-icon" height={20} width="100%"/>,
        label: "Low"
    },
    high: {
        icon: <img src={High} alt="low-icon" height={20} width="100%"/>,
        label: "High"
    },
    critical: {
        icon: <img src={Critical} alt="low-icon" height={20} width="100%"/>,
        label: "Critical"
    },
}

export const statusIcons = {
    "not-started": {
        icon: <img src={NotStarted} alt="not-started-icon" height={15} width={15}/>,
        label: "Not Started"
    },
    "in-progress": {
        icon: <img src={InProgress} alt="in-progress-icon" height={15} width={15}/>,
        label: "In Progress"
    },
    "completed": {
        icon: <img src={Completed} alt="completed-icon" height={15} width={15}/>,
        label: "Completed"
    },
    "cancelled": {
        icon: <img src={Cancelled} alt="cancelled-icon" height={15} width={15}/>,
        label: "Cancelled"
    },
}

export const subTaskStatusIcons = {
    "not-done": {
        icon: <img src={NotDone} alt="not-started-icon" height={11} width="100%"/>,
        label: "Not Done"
    },
    "done": {
        icon: <img src={Done} alt="not-started-icon" height={11} width="100%"/>,
        label: "Done"
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
    const [allTasks, setAllTasks] = useState<Task[] | []>([]);
    const [fetchingTasks, setFetchingTasks] = useState(false);
    const [ids, setIds] = useState<string[] | []>([])
    const [openSubTask, setOpenSubTask] = useState<number[]>([])
    const [deleteItem, setDeleteItem] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [priorityEl, setPriorityEl] = useState<null | HTMLElement>(null);
    const [statusEl, setStatusEl] = useState<null | HTMLElement>(null);
    const [filteredPriorityItems, setFilteredPriorityItems] = useState<string>("")
    const [filteredStatusItems, setFilteredStatusItems] = useState<string>("")
    const [loadingitemRemoval, setitemRemoval] = useState(false)
    const isMenuOpen = Boolean(anchorEl);
    const [rowSelectioChangeModel, setRowSelectionChangeModel] = useState<GridRowSelectionModel>({
        type: 'include',
        ids: new Set()
    })
    const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
        id: false
    })

    const priorityStatusItems = [
        {
            value: 'priority',
            name: 'Priority',
            action: (e: null | HTMLElement) => setPriorityEl(e)
        },
        {
            value: 'status',
            name: 'Status',
            action: (e: null | HTMLElement) => setStatusEl(e)
        },
    ]

    const statusMenuItems = [
        {
            value: 'all-status',
            name: 'All',
            action: (name: string) => handleFilterStatusItems(name),
            close: () => setStatusEl(null)
        },
        {
            value: 'not-started',
            name: 'Not Started',
            action: (name: string) => handleFilterStatusItems(name),
            close: () => setStatusEl(null)
        },
        {
            value: 'in-progress',
            name: 'In Progress',
            action: (name: string) => handleFilterStatusItems(name),
            close: () => setStatusEl(null)
        },
        {
            value: 'completed',
            name: 'Completed',
            action: (name: string) => handleFilterStatusItems(name),
            close: () => setStatusEl(null)
        },
        {
            value: 'cancelled',
            name: 'Cancelled',
            action: (name: string) => handleFilterStatusItems(name),
            close: () => setStatusEl(null)
        }
    ]

    const priorityMenuItems = [
        {
            value: 'all-priority',
            name: 'All',
            action: (name: string) => handleFilterPriorityItems(name),
            close: () => setPriorityEl(null)
        },
         {
            value: 'low',
            name: 'Low',
            action: (name: string) => handleFilterPriorityItems(name),
            close: () => setPriorityEl(null)
        },
        {
            value: 'high',
            name: 'High',
            action: (name: string) => handleFilterPriorityItems(name),
            close: () => setPriorityEl(null)
        },
        {
            value: 'critical',
            name: 'Critical',
            action: (name: string) => handleFilterPriorityItems(name),
            close: () => setPriorityEl(null)
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

    const handleFilterPriorityItems = (item: string) => setFilteredPriorityItems((prev) => prev === item ? "" : item)

    const handleFilterStatusItems = (item: string) => setFilteredStatusItems((prev) => prev === item ? "" : item)

    const renderPriorityStatusMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id='priority-status-menu'
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            sx={{
                marginTop: 5,
                borderRadius: 20
            }}
            slotProps={{
                paper: {
                    sx: {
                        width: 150,
                        maxWidth: '100%'
                    },
                },
            }}
            open={isMenuOpen}
            onClose={() => setAnchorEl(null)}
            >
            {
                priorityStatusItems.map((item, key) => {
                    return <MenuItem key={key} onClick={(e: React.MouseEvent<HTMLElement>) => item.action(e.currentTarget)} value={item.value} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 14 }}>
                        <Box sx={{ flexGrow: 1 }}>{item.name}</Box>
                        <ArrowRightOutlined/>
                    </MenuItem>
                })
            }
        </Menu>
    );

    const renderMenu = (items: {value: string, name: string, close: () => void, action: (name: string) => void }[], type: string) => {
        return <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={type + '- menu'}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            sx={{
                marginTop: 5,
                borderRadius: 20,
                marginLeft: 20
            }}
            slotProps={{
                paper: {
                    sx: {
                        width: 150,
                        maxWidth: '100%'
                    },
                },
            }}
            open={type === "status" ? Boolean(statusEl) : Boolean(priorityEl)}
            onClose={() => items.forEach((item) => item.close())}>
            {
                items.map((item, key) => {
                    return <MenuItem key={key} onClick={() => item.action(item.name)} value={item.value} sx={{ textAlign: 'left', fontSize: 14 }}>
                        {item.name}
                    </MenuItem>
                })
            }
        </Menu>
    }

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
        { field: 'title', headerName: 'Title', width: 530, 
            renderCell: (params) => {
                const id = params.row.id;
                const due_date = params.row.due_date;
                const subtasks = params.row.subtask;
                const attachments = params.row.attachments;
                return (
                    <Box sx={{ display: "flex", alignItems: 'center', gap: 1 }}>
                        {
                            subtasks.length > 0 && due_date !== "" && <IconButton onClick={(e) => handleSubTask(e, id, subtasks)}>
                                {openSubTask.includes(id) ? <img src={ExpandSubTaskActive} alt="close-subtask" height={8} width={8}/> : <img src={ExpandSubTaskInActive} alt="open-subtask" height={8} width={8}/> }
                            </IconButton>
                        }
                        {
                            due_date !== "" ? (
                                <Link href={`/view-task/${id}`} color="inherit"><Typography variant="caption" sx={{ paddingLeft: due_date === "" ? 5 : 0, fontWeight: 'bold' }}>{params.row.title}</Typography></Link>
                            ) : (
                                <Typography variant="caption" sx={{ paddingLeft: due_date === "" ? 10 : 0, fontWeight: 'bold', paddingTop: due_date === "" ? 2 : 0 }}>{params.row.title}</Typography>
                            )
                        }
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
                    <Box>{p.icon}</Box>
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
                                    <>
                                        <Box>{p.icon}</Box>
                                        <Typography variant="caption">{p.label}</Typography>
                                    </>
                                )
                            }
                            
                        </Box>
                    )
                }
                
            } 
        },
        { field: 'edit', headerName: '', width: 50, sortable: false, flex: 1,
            renderCell: (params) => {
                return (
                    params.row.due_date !== "" && <Box sx={{ display: "flex", justifyContent: "center", alignItems: 'center', paddingTop: 1 }}>
                        <IconButton onClick={() => params.field === "edit" && navigate(`/edit-task/${params.row.id}`)}>
                            <img src={Edit} alt="edit-icon" height={15} width="100%"/>
                        </IconButton>
                    </Box>
                )
            },
        },
    ];

    const handleSubTask = (e: React.MouseEvent<HTMLButtonElement>, id: number, subtasks: SubTask[]) => {
        e.stopPropagation();
        const isCurrentlyOpen = openSubTask.includes(id);

        setOpenSubTask((prev) =>
            isCurrentlyOpen
            ? prev.filter((taskId) => taskId !== id)
            : [...prev, id]
        );

        const subTaskIds = new Set(subtasks.map((subtask) => subtask.id));

        setAllTasks((prevTasks) => {
            if (isCurrentlyOpen) {
                return prevTasks.filter((task) => !subTaskIds.has(task.id));
            }

            const alreadyInserted = prevTasks.some((task) => subTaskIds.has(task.id));

            if (alreadyInserted) {
                return prevTasks;
            }

            const newSubTasks = subtasks.map((item) => ({
                ...item,
                due_date: "",
                priority: "",
                completed_date: null,
                subtask: [],
                created_at: "",
                user_id: 0,
            }));

            const newTasks = [...prevTasks];
            const index = newTasks.findIndex((task) => task.id === id);
            if (index !== -1) {
                newTasks.splice(index + 1, 0, ...newSubTasks);
            }

            return newTasks;
        });
    };

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
    
    }, [allTasks, filteredPriorityItems, filteredStatusItems, openSubTask]);

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
            <Box sx={{ padding: 2 }}>
                <Stack spacing={2}>
                    <Typography sx={{ fontFamily: "Roboto", fontWeight: 'bold'}}>To-do</Typography>
                    <Card variant="outlined" sx={{ padding: 1, borderRadius: 5 }}>
                        <Box sx={{ display: "flex", justifyContent: 'flex', alignItems: 'center'}}>
                            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
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
                                        onClick={(e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}
                                        startIcon={
                                            <img src={FilterIcon} alt="filter-icon" height={15} width="100%"/>
                                        }>Filter
                                </Button>
                                {
                                    filteredPriorityItems.length > 0 && 
                                        <Stack direction="row" spacing={1}>
                                            <Chip
                                                variant="outlined"
                                                label={filteredPriorityItems}
                                                onDelete={() => handleFilterPriorityItems(filteredPriorityItems)}
                                            />
                                    </Stack>
                                }
                                {
                                    filteredStatusItems.length > 0 && 
                                    <Stack direction="row" spacing={1}>
                                        <Chip
                                            variant="outlined"
                                            label={filteredStatusItems}
                                            onDelete={() => handleFilterStatusItems(filteredStatusItems)}
                                        />
                                    </Stack>
                                }
                            </Box>
                            <Button type="button" variant="contained" sx={{ textTransform: 'none', borderRadius: 5 }} startIcon={<Add/>} onClick={() => navigate('/new-task')}>New Task</Button>
                            {renderPriorityStatusMenu}
                            {renderMenu(statusMenuItems, 'status')}
                            {renderMenu(priorityMenuItems, 'priority')}
                        </Box>
                    </Card>
                    {
                        fetchingTasks ? (
                            <Paper sx={{ height: 400, width: '100%', borderRadius: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                    <img src={FetchingTaskLoader} height={500} width={400} alt="fetching-task-loader"/>
                                </Box>
                                <Typography sx={{ fontSize: 25 }}>Fetching Tasks ...</Typography>
                            </Paper>
                        ): (
                            <>
                                {
                                    !displayedTasks.length ? (
                                        <Paper sx={{ height: 400, width: '100%', borderRadius: 5, display: 'flex', justifyContent: 'center', alignItems: 'center',  }}>
                                            <Typography sx={{ fontSize: 14, fontWeight: 'bold'}}>No data found</Typography>
                                        </Paper>
                                    ): (
                                        <Paper sx={{ height: "100%", width: '100%', borderRadius: 5 }}>
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
                                                    }
                                                }}
                                            />
                                        </Paper>
                                    )
                                }
                            </>
                        )
                    }
                </Stack>
            </Box>
        </>
    )
}