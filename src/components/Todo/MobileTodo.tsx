import React, { useState, useEffect, useMemo } from 'react'
import { Box, Typography, IconButton, Badge, Menu, MenuItem, Chip, AppBar, Toolbar, Checkbox, CircularProgress } from '@mui/material'
import { Add, ArrowRightOutlined, Circle } from '@mui/icons-material'
import dayjs from 'dayjs';
import { getTasks, removeTask } from '../../api/task/task';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DeleteItems from './DeleteItems';
import type { IFile } from '../../typescript/interface';
import { prioritiesDropdown, statusDropdown } from '../../utils/utils';

// ICONS
import Done from '../../assets/Icons/Done.svg';
import NotDone from '../../assets/Icons/Not Done.svg';
import Attachment from '../../assets/Icons/attachment.svg'
import DueDate from '../../assets/Icons/Due Date.svg'

import { MobileAppBar } from '../MobileAppBar';
import FilterDropdownDialog from '../Dialog/Mobile/FilterDropdown';
import SortDropdownDialog from '../Dialog/Mobile/SortDropdown';
import { ArrowDownUp, Funnel, Trash, TrashOff } from 'lucide-react';
import { prioritiesIcons, statusIcons } from './DesktopTodo';

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

    const handleStatusIcons = (status: string, due_date: string ) => {
        const taskStatus = statusIcons[status as keyof typeof statusIcons];
        const subtaskStatus = subTaskStatusIcons[status as keyof typeof subTaskStatusIcons];

        if (!taskStatus && due_date === "" && subtaskStatus) {
            return (
            <Box
                sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 1,
                py: 0.5,
                borderRadius: 10,
                bgcolor: "grey.100",
                color: "text.secondary",
                }}
            >
                {subtaskStatus.icon}
                <Typography variant="caption" sx={{ fontWeight: 600, lineHeight: 1 }}>
                {subtaskStatus.label}
                </Typography>
            </Box>
            );
        }

        if (!taskStatus) return null;

        return (
            <Chip
                size="small"
                icon={taskStatus?.icon}
                label={<Typography variant="caption">{taskStatus?.label ?? "—"}</Typography>}
                sx={{
                    bgcolor: taskStatus?.bgColor,
                    color: taskStatus?.color,
                    fontWeight: 600,
                }}
            />
        );
    };

    const handlePriorityIcons = (status: string) => {
        const p = prioritiesIcons[status as keyof typeof prioritiesIcons];
        if(!p) return status;
        return <Chip
            size="small"
            icon={p?.icon}
            label={<Typography variant="caption">{p?.label ?? "—"}</Typography>}
            sx={{
                bgcolor: p?.bgColor,
                color: p?.color,
                fontWeight: 600,
            }}
        />
    }

    const handleTitle = (id: number, title: string, due_date: string, attachments?: IFile[] | []) => {
        return (
            <Box sx={{ display: "flex", alignItems: 'center', gap: 1 }}>
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
        });

        return finalFlattenedGrid;

    }, [allTasks, filteredPriorityItems, filteredStatusItems, selectedSortOption]);

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
            <FilterDropdownDialog
                close={handleCloseFilter}
                proceed={handleFilter}
                open={openFilterDropdown}
                priorities={prioritiesDropdown}
                selectedPriority={filteredPriorityItems}
                selectedStatus={filteredStatusItems}
                status={statusDropdown}
            />

            <SortDropdownDialog
                open={openSort}
                proceed={handleSort}
                close={() => setOpenSort(false)}
                items={sortItems}
            />

            <AppBar
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{
                    top: 0,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    bgcolor: "rgba(255,255,255,0.96)",
                    backdropFilter: "blur(12px)",
                }}
            >
                <Toolbar sx={{ minHeight: 64, gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 750, mr: "auto" }}>
                        My tasks
                    </Typography>

                    <IconButton
                        aria-label="Filter tasks"
                        onClick={() => setOpenFilterDropdown((prev) => !prev)}
                        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
                        >
                        <Funnel size={20}/>
                    </IconButton>

                    <IconButton
                        aria-label={
                            selectedSortOption.sortTitle === "none"
                            ? "Sort tasks"
                            : `Sort tasks by ${selectedSortOption.sortTitle}`
                        }
                        aria-pressed={selectedSortOption.sortTitle !== "none"}
                        onClick={() => setOpenSort((prev) => !prev)}
                        sx={{
                            border: "1px solid",
                            borderColor:
                            selectedSortOption.sortTitle !== "none" ? "primary.main" : "divider",
                            borderRadius: 2,
                            bgcolor:
                            selectedSortOption.sortTitle !== "none" ? "primary.50" : "background.paper",
                            color:
                            selectedSortOption.sortTitle !== "none" ? "primary.main" : "text.secondary",
                            "&:hover": {
                            bgcolor:
                                selectedSortOption.sortTitle !== "none" ? "primary.100" : "action.hover",
                            },
                        }}
                        >
                        <Badge
                            variant="dot"
                            invisible={selectedSortOption.sortTitle === "none"}
                            sx={{
                            "& .MuiBadge-badge": {
                                bgcolor: "primary.main",
                                boxShadow: "0 0 0 2px white",
                            },
                            }}
                        >
                            <ArrowDownUp size={20}/>
                        </Badge>
                    </IconButton>
                </Toolbar>

                {(filteredPriorityItems || filteredStatusItems) && (
                    <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        px: 2,
                        pb: 1.25,
                        overflowX: "auto",
                    }}
                    >
                    {filteredPriorityItems && (
                        <Chip
                            size="small"
                            label={`Priority: ${filteredPriorityItems}`}
                            onDelete={handleRemoveFilterItem}
                            variant="outlined"
                        />
                    )}
                    {filteredStatusItems && (
                        <Chip
                        size="small"
                        label={`Status: ${filteredStatusItems}`}
                        onDelete={handleRemoveStatusItem}
                        variant="outlined"
                        />
                    )}
                    </Box>
                )}
            </AppBar>

            {renderPriorityStatusMenu}
            {renderMenu(statusMenuItems, "status")}
            {renderMenu(priorityMenuItems, "priority")}

            <DeleteItems
                loading={loadingitemRemoval}
                close={handleCancelDelete}
                proceed={handleDeleteItem}
                open={deleteItem}
                ids={ids}
            />

            <Box
                component="main"
                sx={{
                    px: 2,
                    pt: filteredPriorityItems || filteredStatusItems ? 13 : 10,
                    pb: 12,
                }}
            >
            {fetchingTasks ? (
                <Box
                    role="status"
                    aria-live="polite"
                    sx={{
                        minHeight: 240,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1.5,
                        color: "text.secondary",
                    }}
                    >
                    <CircularProgress size={28} />
                    <Typography variant="body2">Loading tasks…</Typography>
                </Box>
            ) : displayedTasks.length === 0 ? (
                <Box
                    sx={{
                        minHeight: "55vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        px: 3,
                        textAlign: "center",
                    }}
                >
                <Box
                    sx={{
                    width: 64,
                    height: 64,
                    mb: 2,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 3,
                    bgcolor: "grey.100",
                    color: "text.secondary",
                    }}
                >
                    <Circle sx={{ fontSize: 18 }} />
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {filteredPriorityItems || filteredStatusItems
                    ? "No matching tasks"
                    : "No tasks yet"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {filteredPriorityItems || filteredStatusItems
                    ? "Try changing or clearing your filters."
                    : "Tasks you create will show up here."}
                </Typography>
                </Box>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {displayedTasks.map((task) => {
                        const taskId = task.id.toString();
                        const isSelected = ids.includes(taskId);

                        return (
                            <Box
                                key={task.id}
                                sx={{
                                p: 1.75,
                                border: "1px solid",
                                borderColor: isSelected ? "primary.light" : "divider",
                                borderRadius: 2.5,
                                bgcolor: isSelected ? "rgba(25,118,210,0.035)" : "background.paper",
                                boxShadow: "0 2px 8px rgba(15,23,42,0.035)",
                                }}
                            >
                                <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                    gap: 1,
                                }}
                                >
                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1 }}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            {handlePriorityIcons(task.priority)}
                                        </Box>
                                        <Box sx={{ minWidth: 0 }}>
                                            {handleStatusIcons(
                                                task.status,
                                                task.due_date
                                            )}
                                        </Box>
                                    </Box>

                                    <Box sx={{ "& .MuiTypography-root": { fontSize: 15 } }}>
                                        {handleTitle(
                                            task.id,
                                            task.title,
                                            task.due_date,
                                            task.attachments
                                        )}
                                    </Box>

                                    {task.due_date !== "" && (
                                    <Box sx={{ mt: 1 }}>
                                        {handleDueDate(task.status, task.due_date, task.priority)}
                                    </Box>
                                    )}
                                </Box>

                                    {task.due_date !== "" && (
                                        <Checkbox
                                            size="small"
                                            aria-label={`Select ${task.title}`}
                                            checked={isSelected}
                                            onChange={() => handleSelectionChange(taskId)}
                                            sx={{ p: 0.5, mt: -0.5 }}
                                        />
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            )}
            </Box>

            <MobileAppBar>
                <Badge
                    badgeContent={ids.length}
                    color="error"
                    invisible={!ids.length}
                    overlap="circular">
                    <IconButton
                        disabled={!ids.length}
                        aria-label={`Delete ${ids.length} selected tasks`}
                        onClick={() => setDeleteItem(true)}
                        sx={{
                            borderRadius: 2,
                            color: ids.length ? "error.main" : "text.disabled",
                        }}>
                        {ids.length ? <Trash size={18} /> : <TrashOff size={18} />}
                    </IconButton>
                </Badge>

                <IconButton
                    aria-label="Create task"
                    onClick={() => navigate("/new-task")}
                    sx={{
                    width: 44,
                    height: 44,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": { bgcolor: "primary.dark" },
                    }}
                >
                    <Add />
                </IconButton>
            </MobileAppBar>
        </>
        );
}