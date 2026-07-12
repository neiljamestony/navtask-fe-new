import React, { useState, useEffect, useMemo } from 'react'
import { Box, Typography, Stack, CircularProgress, IconButton, Badge, Grid, Menu, MenuItem, Chip, AppBar, Toolbar, List, ListItem, ListItemText, Divider, Checkbox } from '@mui/material'
import { Add, ArrowRightOutlined, Circle } from '@mui/icons-material'
import dayjs from 'dayjs';
import { getTasks, removeTask } from '../../api/task/task';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DeleteItems from './DeleteItems';
import type { IFile } from '../../typescript/interface';
import { prioritiesDropdown, statusDropdown } from '../../utils/utils';

// ICONS
import FilterIcon from '../../assets/Icons/Filter.svg';
import Low from '../../assets/Icons/Low_table.svg';
import High from '../../assets/Icons/High_table.svg';
import Critical from '../../assets/Icons/Critical_table.svg';
import NotStarted from '../../assets/Icons/Not Started.svg';
import Cancelled from '../../assets/Icons/Cancelled.svg';
import Completed from '../../assets/Icons/Complete.svg';
import InProgress from '../../assets/Icons/In Progress.svg';
import DeleteActive from '../../assets/Icons/Delete_active.svg';
import DeleteInactive from '../../assets/Icons/Delete_inactive.svg';
import ExpandSubTaskActive from '../../assets/Icons/Accordion_expand.svg'
import ExpandSubTaskInActive from '../../assets/Icons/Accordion_supress.svg'
import Done from '../../assets/Icons/Done.svg';
import NotDone from '../../assets/Icons/Not Done.svg';
import Attachment from '../../assets/Icons/attachment.svg'
import Sort from '../../assets/Icons/Sort.svg'
import DueDate from '../../assets/Icons/Due Date.svg'

import { MobileAppBar } from '../MobileAppBar';
import FilterDropdownDialog from '../Dialog/Mobile/FilterDropdown';
import SortDropdownDialog from '../Dialog/Mobile/SortDropdown';

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
        icon: <img src={NotStarted} alt="not-started-icon" height={15} width="100%"/>,
        label: "Not Started"
    },
    "in-progress": {
        icon: <img src={InProgress} alt="in-progress-icon" height={15} width="100%"/>,
        label: "In Progress"
    },
    "completed": {
        icon: <img src={Completed} alt="completed-icon" height={15} width="100%"/>,
        label: "Completed"
    },
    "cancelled": {
        icon: <img src={Cancelled} alt="cancelled-icon" height={12} width="100%"/>,
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
    attachments?: IFile[] | []
}

export default function MobileTodo() {
    const navigate = useNavigate();
    const [allTasks, setAllTasks] = useState<Task[] | []>([]);
    const [fetchingTasks, setFetchingTasks] = useState(false);
    const [ids, setIds] = useState<string[]>([])
    const [openSubTask, setOpenSubTask] = useState<number[]>([])
    const [deleteItem, setDeleteItem] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [priorityEl, setPriorityEl] = useState<null | HTMLElement>(null);
    const [statusEl, setStatusEl] = useState<null | HTMLElement>(null);
    const [filteredPriorityItems, setFilteredPriorityItems] = useState<string>("")
    const [filteredStatusItems, setFilteredStatusItems] = useState<string>("")
    const [openFilterDropdown, setOpenFilterDropdown] = useState(false)
    const [loadingitemRemoval, setitemRemoval] = useState(false)
    const [selectedSortOption, setSelectedSortOption] = useState({
        order: "",
        sortTitle: "none"
    })
    const [openSort, setOpenSort] = useState(false)
    const isMenuOpen = Boolean(anchorEl);

    const sortItems = [
        {
            value: 'none',
            name: 'None',
        },
        {
            value: 'due-date',
            name: 'Due Date',
        },
        {
            value: 'priority',
            name: 'Priority',
        },
        {
            value: 'status',
            name: 'Status',
        }
    ]

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

    

    const borderDesign = {
        border: '1px solid', 
        borderRadius: 3, 
        borderColor: 'grey.500'
    }
    const statusMap = new Map(statusMenuItems.map(item => [item.name, item.value]));
    const priorityMap = new Map(priorityMenuItems.map(item => [item.name, item.value]));

    const handleDeleteItem = async (ids: string[] | []) => {
        setitemRemoval(true)
        const result = await removeTask(ids);
        if(result?.status === 200){
            setitemRemoval(false)
            setDeleteItem(false)
            fetch()
            setIds([])
        }else{
            toast.error(result?.msg)
            setitemRemoval(false)
        }
    }

    const handleRemoveFilterItem = () => setFilteredPriorityItems("")
    const handleRemoveStatusItem = () => setFilteredStatusItems("")

    const handleFilterPriorityItems = (item: string) => setFilteredPriorityItems(item);

    const handleFilterStatusItems = (item: string) => setFilteredStatusItems(item);

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

    const handleSubTask = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
        e.stopPropagation();

        const isCurrentlyOpen = openSubTask.includes(id);

        setOpenSubTask((prev) => 
            isCurrentlyOpen ? prev.filter((prevId) => prevId !== id) : [...prev, id]
        );
    }

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

    const handleSelectionChange = (id: string) => {
        const exists = ids.includes(id)
        setIds((prev) => exists ? prev.filter((prevId) => prevId !== id) : [...prev, id])
    };

    const handleStatusIcons = (status: string, due_date: string, completed_date?: null | string) => {
        const p = statusIcons[status as keyof typeof statusIcons];
        const subItem = subTaskStatusIcons[status as keyof typeof subTaskStatusIcons];
        if(!p && due_date === "" && subItem) {
            return (
                <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', gap: 0.5, paddingLeft: 10 }}>
                    <Box>{subItem.icon}</Box>
                    <Typography variant="caption" sx={{ fontSize: 12, color: '#C7CED6', mt: 0.5 }}>{subItem.label}</Typography>
                </Box>
            )
        }else{
            return (
                <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                    <Box>{p.icon}</Box>
                    <Typography variant="caption" sx={{ color: 'grey.600' }}>{p.label} {completed_date && status === "completed" && "- " + dayjs(completed_date).format("MM-DD-YYYY")}</Typography>
                </Box>
            )
        }
    }

    const handlePriorityIcons = (status: string) => {
        const p = prioritiesIcons[status as keyof typeof prioritiesIcons];
        if(!p) return status;
        return <Box>{p.icon}</Box>
    }

    const handleTitle = (id: number, title: string, due_date: string, subtask: SubTask[] | [], attachments?: IFile[] | []) => {
        return (
            <Box sx={{ display: "flex", alignItems: 'center', gap: 1 }}>
                {
                    subtask.length > 0 && due_date !== "" && <Box sx={{ marginLeft: -3 }}>
                        <IconButton onClick={(e) => handleSubTask(e, id)}>
                            {openSubTask.includes(id) ? <img src={ExpandSubTaskActive} alt="close-subtask" height={8} width={8}/> : <img src={ExpandSubTaskInActive} alt="open-subtask" height={8} width={8}/> }
                        </IconButton>
                    </Box>
                }
                {
                    due_date !== "" ? (
                        <Typography variant="caption" onClick={() => navigate(`/view-task/${id}`)} sx={{ paddingLeft: 0, fontWeight: 'bold', textDecoration: 'underline', fontSize: 14 }}>{title}</Typography>
                    ) : (
                        <Typography variant="caption" sx={{ paddingLeft: 13.5, fontWeight: 'bold', paddingTop: due_date === "" ? 2 : 0, fontSize: 14 }}>{title}</Typography>
                    )
                }
                {
                    due_date !== "" && attachments && attachments.length > 0 && <img src={Attachment} alt="attachment-icon" height={14} width={14}/>
                }
            </Box>
        )
    }


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

        if (selectedSortOption.sortTitle === "none") {
            result = [...result];
        }

        if(selectedSortOption.sortTitle === "status"){
            const statusOrder = ["not-started", 'in-progress', 'cancelled', 'completed'];
            if(selectedSortOption.order === "asc"){
                result = [...result].sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status))
            }else if(selectedSortOption.order === "desc"){
                result = [...result].sort((a, b) => statusOrder.indexOf(b.status) - statusOrder.indexOf(a.status))
            }
        }

        if(selectedSortOption.sortTitle === "priority"){
            const priorityOrder = ["critical","high","low"];
            if(selectedSortOption.order === "asc"){
                result = [...result].sort((a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority))
            }else if(selectedSortOption.order === "desc"){
                result = [...result].sort((a, b) => priorityOrder.indexOf(b.priority) - priorityOrder.indexOf(a.priority))
            }
        }

        if(selectedSortOption.sortTitle === "due-date"){
            result = [...result].sort((a, b) => {
                const timeA = dayjs(a.due_date).valueOf();
                const timeB = dayjs(b.due_date).valueOf();

                 if (selectedSortOption.order === "asc") {
                    return timeA - timeB;
                } else {
                    return timeB - timeA;
                }
            })
        }

        const finalFlattenedGrid: any[] = [];

        result.forEach((task) => {
            finalFlattenedGrid.push(task);
            if (openSubTask.includes(task.id) && task.subtask && task.subtask.length > 0) {
                const formattedSubTasks = task.subtask.map((subItem) => ({
                    ...subItem,
                    isSubTask: true,
                    due_date: "", 
                    priority: "",
                    completed_date: null, 
                    subtask: [], 
                    created_at: "", 
                    user_id: 0
                }));

                finalFlattenedGrid.push(...formattedSubTasks);
            }
        });

        return finalFlattenedGrid;

    }, [allTasks, filteredPriorityItems, filteredStatusItems, openSubTask, selectedSortOption]);

    const handleCancelDelete = () => {
        setDeleteItem(false)
        setIds([])
    }

    const handleFilter = (priority: string, status: string) => {
        handleFilterPriorityItems(priority)
        handleFilterStatusItems(status)
    }

    const handleCloseFilter = () => {
        setOpenFilterDropdown(false)
    }

    const handleSort = (priority: string, sort: string) => {
        setSelectedSortOption({ sortTitle: priority, order: sort })
    }
    
    const handleDueDate = (status: string, due_date: string, priority: string) => {
        if(due_date === "") return false
        const rawValue = due_date;
        const dueDateObj = rawValue ? dayjs(rawValue) : null;
        const currentInstant = dayjs();

        if (!dueDateObj) {
            return <Typography variant="caption" sx={{ color: '#272D32', paddingTop: 1 }}>—</Typography>;
        }

        const isSameDayAsToday = status !== "completed" && currentInstant.isSame(dueDateObj, 'day');
        const isDue = status !== "completed" && currentInstant.isAfter(dueDateObj, 'day');

        const hoursRemaining = dueDateObj.diff(currentInstant, "hour");
        const criticalItems = status !== "completed" && priority === "critical" && hoursRemaining <= 48 && hoursRemaining >= 0;
        const formattedDisplayDate = dueDateObj.format("MM/DD/YYYY");

        const getIconFilter = () => {
            if (isDue) return 'invert(11%) sepia(94%) saturate(6008%) hue-rotate(324deg) brightness(92%) contrast(107%)';
            if (isSameDayAsToday || criticalItems) return 'invert(37%) sepia(93%) saturate(545%) hue-rotate(133deg) brightness(96%) contrast(102%)';
            return 'invert(15%) sepia(10%) saturate(563%) hue-rotate(167deg) brightness(93%) contrast(92%)';
        };

        if (isDue) {
            return (
                <Box sx={{ display: "flex", alignItems: 'center', gap: 0.5 }}>
                    {status !== "cancelled" && due_date !== "" && <img 
                            src={DueDate} 
                            alt="due-date-icon" 
                            height={18} 
                            width={18}
                            style={{
                                filter: getIconFilter(),
                                transition: 'filter 0.2s ease-in-out'
                            }}
                    />}
                    <Typography variant="caption" sx={{ color: '#CA0061' }}>{formattedDisplayDate} <Circle sx={{ fontSize: 5 }}/> Overdue</Typography>
                </Box>
            );
        }

        if (isSameDayAsToday) {
            return (
                <Box sx={{ display: "flex", alignItems: 'center', gap: 0.5 }}>
                    {status !== "cancelled" && due_date !== "" && <img 
                            src={DueDate} 
                            alt="due-date-icon" 
                            height={18} 
                            width={18}
                            style={{
                                filter: getIconFilter(),
                                transition: 'filter 0.2s ease-in-out'
                            }}
                    />}
                    <Typography variant="caption" sx={{ color: '#009292' }}>{formattedDisplayDate} <Circle sx={{ fontSize: 5 }}/> Today</Typography>
                </Box>
            );
        }

        if (criticalItems) {
            return (
                <Box sx={{ display: "flex", alignItems: 'center', gap: 0.5 }}>
                    {status !== "cancelled" && due_date !== "" && <img 
                            src={DueDate} 
                            alt="due-date-icon" 
                            height={18} 
                            width={18}
                            style={{
                                filter: getIconFilter(),
                                transition: 'filter 0.2s ease-in-out'
                            }}
                    />}
                    <Typography variant="caption" sx={{ color: '#009292' }}>{formattedDisplayDate}</Typography>
                </Box>
            );
        }

        return (
            <Box sx={{ display: "flex", alignItems: 'center', gap: 0.5 }}>
                {status !== "cancelled" && due_date !== "" && <img 
                        src={DueDate} 
                        alt="due-date-icon" 
                        height={18} 
                        width={18}
                />}
                <Typography variant="caption" sx={{ color: '#272D32' }}>{formattedDisplayDate}</Typography>
            </Box>
        );
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
            <SortDropdownDialog open={openSort} proceed={handleSort} close={() => setOpenSort(false)} items={sortItems}/>
            <FilterDropdownDialog 
            close={handleCloseFilter} 
            proceed={handleFilter} 
            open={openFilterDropdown} 
            priorities={prioritiesDropdown}
            selectedPriority={filteredPriorityItems}
            selectedStatus={filteredStatusItems}
            status={statusDropdown}/>
            <AppBar position="fixed" color="inherit" sx={{ top: 0, bottom: "auto" }}>
                <Toolbar sx={{ display: "flex", justifyContent: 'space-evenly', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={() => setOpenFilterDropdown((prev) => !prev)}
                        sx={{ border: '1px solid grey', borderRadius: 3 }}>
                        <img src={FilterIcon} alt="filter-icon" height={15} width={15}/>
                    </IconButton>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        {
                            filteredPriorityItems.length > 0 && 
                                <Stack direction="row" spacing={1}>
                                    <Chip
                                        variant="outlined"
                                        label={filteredPriorityItems}
                                        onDelete={() => handleRemoveFilterItem()}
                                    />
                            </Stack>
                        }
                        {
                            filteredStatusItems.length > 0 && 
                            <Stack direction="row" spacing={1}>
                                <Chip
                                    variant="outlined"
                                    label={filteredStatusItems}
                                    onDelete={() => handleRemoveStatusItem()}
                                />
                            </Stack>
                        }
                        {renderPriorityStatusMenu}
                        {renderMenu(statusMenuItems, 'status')}
                        {renderMenu(priorityMenuItems, 'priority')}
                    </Box>
                    <IconButton color="inherit" aria-label="new-task" onClick={() => setOpenSort((prev) => !prev)} 
                        sx={{ border: '1px solid grey', borderRadius: 3, gap: selectedSortOption.sortTitle !== "none" ? 1 : 0 }}>
                        {
                            selectedSortOption.sortTitle !== "none" && <Badge
                                variant="dot"
                                sx={{ 
                                    '& .MuiBadge-badge': { 
                                        backgroundColor: '#2FBD00  !important',
                                        color: '#2FBD00  !important'
                                    } 
                                }}
                            />
                        }
                        <img src={Sort} alt="sort-icon" height={20} width={20}/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <DeleteItems loading={loadingitemRemoval} close={handleCancelDelete} proceed={handleDeleteItem} open={deleteItem} ids={ids}/>
            <Box>
                <Stack spacing={2}>
                    {
                        fetchingTasks ? (
                            <Box sx={{ height: 400, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography sx={{ fontFamily: "Roboto", fontWeight: 'bold'}}><CircularProgress size={30} color="inherit"/> Fetching tasks ... </Typography>
                            </Box>
                        ): (
                            <>
                                {
                                    !displayedTasks.length ? (
                                        <Box sx={{ height: 400, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Typography sx={{ fontFamily: "Roboto", fontWeight: 'bold'}}>No data found</Typography>
                                        </Box>
                                    ): (
                                            <List sx={{ paddingTop: 9, paddingBottom: 10 }}>
                                                {
                                                    displayedTasks.map((task, key) => {
                                                        return (
                                                            <Box key={key}>
                                                                <Box sx={{ display: "flex", gap: 2 }}>
                                                                    {task.due_date !== "" && <Checkbox 
                                                                        value={task.id} 
                                                                        onChange={() => handleSelectionChange(task.id.toString())}
                                                                        checked={ids.includes(task.id.toString())}
                                                                        sx={{
                                                                            '&.Mui-checked': {
                                                                                color: "#62C6FF",
                                                                            }
                                                                        }}/>}
                                                                    <ListItem>
                                                                        <Box sx={{ display: 'block' }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 1 }}>
                                                                                <Box>{handlePriorityIcons(task.priority)}</Box>
                                                                                <Box>{handleStatusIcons(task.status, task.due_date, task.completed_date)}</Box>
                                                                            </Box>
                                                                            <ListItemText>{handleTitle(task.id, task.title, task.due_date, task.subtask, task.attachments)}</ListItemText>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, marginLeft: 1 }}>
                                                                                <ListItemText>
                                                                                    {task.due_date !== "" && handleDueDate(task.status, task.due_date, task.priority) }
                                                                                </ListItemText>
                                                                            </Box>
                                                                        </Box>
                                                                    </ListItem>
                                                                    
                                                                </Box>
                                                                <Divider/>
                                                            </Box>
                                                        )
                                                    })
                                                    
                                                }
                                            </List>
                                    )
                                }
                            </>
                        )
                    }
                </Stack>
            </Box>
            <MobileAppBar>
                <Box sx={{ cursor: 'pointer' }} onClick={() => ids.length > 0 ? setDeleteItem(true) : ""}> 
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
                <IconButton color="inherit" sx={{ backgroundColor: '#027CEC', color: '#fff' }} aria-label="new-task" onClick={() => navigate('/new-task')}>
                    <Add />
                </IconButton>
            </MobileAppBar>
        </>
    )
}