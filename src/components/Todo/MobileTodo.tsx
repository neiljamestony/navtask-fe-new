import {
  MobileTodoMenuSurfaceStyle1,
  MobileTodoMenuItemTextStyle2,
  MobileTodoBoxLayoutStyle3,
  MobileTodoMenuSurfaceStyle4,
  MobileTodoMenuItemTextStyle5,
  MobileTodoBoxSurfaceStyle6,
  MobileTodoTypographyTextStyle7,
  MobileTodoChipTextStyle8,
  MobileTodoChipTextStyle9,
  MobileTodoBoxLayoutStyle10,
  MobileTodoTypographyTextStyle11,
  MobileTodoTypographyTextStyle12,
  MobileTodoTypographyTextStyle13,
  MobileTodoBoxLayoutStyle14,
  MobileTodoimgContainerStyle15,
  MobileTodoTypographyTextStyle16,
  MobileTodoCircleTextStyle17,
  MobileTodoBoxLayoutStyle18,
  MobileTodoimgContainerStyle19,
  MobileTodoTypographyTextStyle20,
  MobileTodoCircleTextStyle21,
  MobileTodoBoxLayoutStyle22,
  MobileTodoimgContainerStyle23,
  MobileTodoTypographyTextStyle24,
  MobileTodoBoxLayoutStyle25,
  MobileTodoTypographyTextStyle26,
  MobileTodoAppBarSurfaceStyle27,
  MobileTodoToolbarSizeStyle28,
  MobileTodoTypographyTextStyle29,
  MobileTodoIconButtonSurfaceStyle30,
  MobileTodoIconButtonSurfaceStyle31,
  MobileTodoBadgeSpacingStyle32,
  MobileTodoBoxLayoutStyle33,
  MobileTodoBoxSpacingStyle34,
  MobileTodoBoxSizeStyle35,
  MobileTodoBoxTextStyle36,
  MobileTodoBoxSurfaceStyle37,
  MobileTodoCircleTextStyle38,
  MobileTodoTypographyTextStyle39,
  MobileTodoTypographySpacingStyle40,
  MobileTodoBoxLayoutStyle41,
  MobileTodoBoxSurfaceStyle42,
  MobileTodoBoxLayoutStyle43,
  MobileTodoBoxSizeStyle44,
  MobileTodoBoxLayoutStyle45,
  MobileTodoBoxLayoutStyle46,
  MobileTodoBoxSizeStyle47,
  MobileTodoBoxSpacingStyle48,
  MobileTodoBoxSpacingStyle49,
  MobileTodoCheckboxSpacingStyle50,
  MobileTodoIconButtonSurfaceStyle51,
  MobileTodoIconButtonTextStyle52
} from "../Styles/Todo/MobileTodo/MobileTodo.styles";
import React, { useState, useEffect, useMemo } from 'react'
import { Box, Typography, IconButton, Badge, Menu, MenuItem, Chip, AppBar, Toolbar, Checkbox } from '@mui/material'
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
import FetchingTask from '../NotFound/FetchingTask';

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
            sx={MobileTodoMenuSurfaceStyle1}
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
                    return <MenuItem key={key} onClick={(e: React.MouseEvent<HTMLElement>) => item.action(e.currentTarget)} value={item.value} sx={MobileTodoMenuItemTextStyle2}>
                        <Box sx={MobileTodoBoxLayoutStyle3}>{item.name}</Box>
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
            sx={MobileTodoMenuSurfaceStyle4}
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
                    return <MenuItem key={key} onClick={() => item.action(item.name)} value={item.value} sx={MobileTodoMenuItemTextStyle5}>
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
                sx={MobileTodoBoxSurfaceStyle6}
            >
                {subtaskStatus.icon}
                <Typography variant="caption" sx={MobileTodoTypographyTextStyle7}>
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
                sx={MobileTodoChipTextStyle8({ taskStatus: taskStatus })}
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
            sx={MobileTodoChipTextStyle9({ p: p })}
        />
    }

    const handleTitle = (id: number, title: string, due_date: string, attachments?: IFile[] | []) => {
        return (
            <Box sx={MobileTodoBoxLayoutStyle10}>
                {
                    due_date !== "" ? (
                        <Typography variant="caption" onClick={() => navigate(`/view-task/${id}`)} sx={MobileTodoTypographyTextStyle11}>{title}</Typography>
                    ) : (
                        <Typography variant="caption" sx={MobileTodoTypographyTextStyle12({ due_date: due_date })}>{title}</Typography>
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
            return <Typography variant="caption" sx={MobileTodoTypographyTextStyle13}>—</Typography>;
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
                <Box sx={MobileTodoBoxLayoutStyle14}>
                    {status !== "cancelled" && due_date !== "" && <img 
                            src={DueDate} 
                            alt="due-date-icon" 
                            height={18} 
                            width={18}
                            style={MobileTodoimgContainerStyle15({ getIconFilter: getIconFilter })}
                    />}
                    <Typography variant="caption" sx={MobileTodoTypographyTextStyle16}>{formattedDisplayDate} <Circle sx={MobileTodoCircleTextStyle17}/> Overdue</Typography>
                </Box>
            );
        }

        if (isSameDayAsToday) {
            return (
                <Box sx={MobileTodoBoxLayoutStyle18}>
                    {status !== "cancelled" && due_date !== "" && <img 
                            src={DueDate} 
                            alt="due-date-icon" 
                            height={18} 
                            width={18}
                            style={MobileTodoimgContainerStyle19({ getIconFilter: getIconFilter })}
                    />}
                    <Typography variant="caption" sx={MobileTodoTypographyTextStyle20}>{formattedDisplayDate} <Circle sx={MobileTodoCircleTextStyle21}/> Today</Typography>
                </Box>
            );
        }

        if (criticalItems) {
            return (
                <Box sx={MobileTodoBoxLayoutStyle22}>
                    {status !== "cancelled" && due_date !== "" && <img 
                            src={DueDate} 
                            alt="due-date-icon" 
                            height={18} 
                            width={18}
                            style={MobileTodoimgContainerStyle23({ getIconFilter: getIconFilter })}
                    />}
                    <Typography variant="caption" sx={MobileTodoTypographyTextStyle24}>{formattedDisplayDate}</Typography>
                </Box>
            );
        }

        return (
            <Box sx={MobileTodoBoxLayoutStyle25}>
                {status !== "cancelled" && due_date !== "" && <img 
                        src={DueDate} 
                        alt="due-date-icon" 
                        height={18} 
                        width={18}
                />}
                <Typography variant="caption" sx={MobileTodoTypographyTextStyle26}>{formattedDisplayDate}</Typography>
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
                sx={MobileTodoAppBarSurfaceStyle27}
            >
                <Toolbar sx={MobileTodoToolbarSizeStyle28}>
                    <Typography variant="subtitle1" sx={MobileTodoTypographyTextStyle29}>
                        My tasks
                    </Typography>

                    <IconButton
                        aria-label="Filter tasks"
                        onClick={() => setOpenFilterDropdown((prev) => !prev)}
                        sx={MobileTodoIconButtonSurfaceStyle30}
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
                        sx={MobileTodoIconButtonSurfaceStyle31({ selectedSortOption: selectedSortOption })}
                        >
                        <Badge
                            variant="dot"
                            invisible={selectedSortOption.sortTitle === "none"}
                            sx={MobileTodoBadgeSpacingStyle32}
                        >
                            <ArrowDownUp size={20}/>
                        </Badge>
                    </IconButton>
                </Toolbar>

                {(filteredPriorityItems || filteredStatusItems) && (
                    <Box
                    sx={MobileTodoBoxLayoutStyle33}
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
                sx={MobileTodoBoxSpacingStyle34({ filteredPriorityItems: filteredPriorityItems, filteredStatusItems: filteredStatusItems })}
            >
            {fetchingTasks ? (
                <Box
                    sx={MobileTodoBoxSizeStyle35}
                >
                    <FetchingTask />
                </Box>
            ) : displayedTasks.length === 0 ? (
                <Box
                    sx={MobileTodoBoxTextStyle36}
                >
                <Box
                    sx={MobileTodoBoxSurfaceStyle37}
                >
                    <Circle sx={MobileTodoCircleTextStyle38} />
                </Box>

                <Typography variant="subtitle1" sx={MobileTodoTypographyTextStyle39}>
                    {filteredPriorityItems || filteredStatusItems
                    ? "No matching tasks"
                    : "No tasks yet"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={MobileTodoTypographySpacingStyle40}>
                    {filteredPriorityItems || filteredStatusItems
                    ? "Try changing or clearing your filters."
                    : "Tasks you create will show up here."}
                </Typography>
                </Box>
            ) : (
                <Box sx={MobileTodoBoxLayoutStyle41}>
                    {displayedTasks.map((task) => {
                        const taskId = task.id.toString();
                        const isSelected = ids.includes(taskId);

                        return (
                            <Box
                                key={task.id}
                                sx={MobileTodoBoxSurfaceStyle42({ isSelected: isSelected })}
                            >
                                <Box
                                sx={MobileTodoBoxLayoutStyle43}
                                >
                                <Box sx={MobileTodoBoxSizeStyle44}>
                                    <Box sx={MobileTodoBoxLayoutStyle45}>
                                        <Box sx={MobileTodoBoxLayoutStyle46}>
                                            {handlePriorityIcons(task.priority)}
                                        </Box>
                                        <Box sx={MobileTodoBoxSizeStyle47}>
                                            {handleStatusIcons(
                                                task.status,
                                                task.due_date
                                            )}
                                        </Box>
                                    </Box>

                                    <Box sx={MobileTodoBoxSpacingStyle48}>
                                        {handleTitle(
                                            task.id,
                                            task.title,
                                            task.due_date,
                                            task.attachments
                                        )}
                                    </Box>

                                    {task.due_date !== "" && (
                                    <Box sx={MobileTodoBoxSpacingStyle49}>
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
                                            sx={MobileTodoCheckboxSpacingStyle50}
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
                        sx={MobileTodoIconButtonSurfaceStyle51({ ids: ids })}>
                        {ids.length ? <Trash size={18} /> : <TrashOff size={18} />}
                    </IconButton>
                </Badge>

                <IconButton
                    aria-label="Create task"
                    onClick={() => navigate("/new-task")}
                    sx={MobileTodoIconButtonTextStyle52}
                >
                    <Add />
                </IconButton>
            </MobileAppBar>
        </>
        );
}