import { useState } from 'react'
import { List, ListItemButton, ListItemIcon, Collapse, Radio, ListItemText, Typography, RadioGroup, FormControlLabel, FormControl } from '@mui/material'
import { CircleCheckBig, ChevronDown, ChevronUp, Flag } from 'lucide-react'
import type { IFilterMenuItems } from '../../../typescript/interface'
import { useDispatch, useSelector } from 'react-redux'
import { setFilteredPriorityItems, setFilteredStatusItems } from '../../../reducer/DashboardSlice'

export default function FilterMenuItem({ filterMenuItems, name }: { filterMenuItems: IFilterMenuItems[], name: string }) {
    const [openFilter, setOpenFilter] = useState(false);
    const { filteredPriorityItems, filteredStatusItems } = useSelector((state: any) => state.dashboard);
    const selectedItem = name === "Priority" ? filteredPriorityItems : filteredStatusItems;
    const dispatch = useDispatch();

    return (
        <List sx={{ backgroundColor: '#ebebeb', borderRadius: 3, padding: 0 }}>
            <ListItemButton onClick={() => setOpenFilter(!openFilter)}>
                <ListItemIcon>
                    {name === "Priority" ? <Flag size={20}/> : <CircleCheckBig size={20} />}
                </ListItemIcon>
                <ListItemText primary={<Typography variant="caption" sx={{ fontSize: 14, fontWeight: 'bold' }}>{name}</Typography>} />
                {openFilter ? <ChevronUp /> : <ChevronDown />}
            </ListItemButton>
            <Collapse in={openFilter} timeout="auto">
                <List component="div" sx={{ padding: 2 }}>
                    <FormControl>
                        <RadioGroup
                            value={selectedItem}
                            sx={{ display: "flex", alignItems: "flex-start"}}
                            onChange={(_, value) => {
                                dispatch(
                                name === "Priority"
                                    ? setFilteredPriorityItems(value)
                                    : setFilteredStatusItems(value)
                                );
                            }}
                        >
                            {filterMenuItems.map((item) => (
                                <FormControlLabel
                                    key={item.value}
                                    value={item.name}
                                    control={<Radio size="small" onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                            if (selectedItem === item.name) {
                                                e.preventDefault();
                                                dispatch(
                                                    name === "Priority"
                                                    ? setFilteredPriorityItems("")
                                                    : setFilteredStatusItems("")
                                                );
                                            }
                                        }
                                    }/>}
                                    label={item.name}
                                    sx={{ 
                                        "& .MuiFormControlLabel-label": {
                                            fontSize: 14
                                        } 
                                    }}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </List>
            </Collapse>
        </List>
    )
}
