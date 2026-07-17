import { Dialog, FormControl, FormLabel, DialogContent, DialogActions, Button, Typography, Box, Stack, IconButton, Divider, RadioGroup, Radio, FormControlLabel } from '@mui/material'
import { useState } from 'react'
import Close from '../../../assets/Icons/Close.svg';

export default function SortDropdownDialog({ open, proceed, items, close }: { open:boolean, proceed: (priority: string, sort: string) => void, close: () => void, items: { value: string, name: string}[] }) {
    const [sortValue, setSortValue] = useState("")
    const [priorityValue, setPriorityValue] = useState("")

    const sort = [
        {
            value: "asc",
            name: "Ascending"
        },
        {
            value: "desc",
            name: "Descending"
        }
    ]

    const handleClose = () => {
        close();
        setSortValue("")
        setPriorityValue("")
    };

    const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => setPriorityValue(e.target.value)
    const handleSortChange = (e: React.ChangeEvent<HTMLInputElement>) => setSortValue(e.target.value)

    const handleApply = () =>  {
        proceed(priorityValue, priorityValue !== "none" ? sortValue : "")
        close();
    }

    return (
        <Dialog fullWidth maxWidth="xl" open={open} sx={{
            '& .MuiDialog-paper': {
                borderRadius: '20px',
                boxShadow: 'none',
                marginTop: '64px',
                margin: 1,
                marginBox: 0,
                width: '100%',
                marginBottom: 10
            },
            '& .MuiDialog-container': {
                alignItems: 'flex-end',
            },
        }}
        slotProps={{
            backdrop: {
                sx: {
                    height: '93.5vh',
                    bottom: 'auto',
                    top: 0,
                }
            }
        }}>
            <Box sx={{ display: "flex", alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <Typography sx={{ fontSize: 16, fontWeight: 'bold', flexGrow: 1, paddingLeft: 4 }}>Sort by</Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end", m: 0, p: 1  }}>
                    <IconButton onClick={handleClose}><img src={Close} alt="close-model" height={15} width={15}/></IconButton>
                </Box>
            </Box>
            <Divider/>
            <DialogContent sx={{ m: 0, p: 2 }}>
                <Stack spacing={2}>
                    <FormControl>
                        <FormLabel sx={{ fontSize: 14 }}>Priority</FormLabel>
                        <RadioGroup onChange={handlePriorityChange} value={priorityValue}>
                            {
                                items.map((option, key) => (
                                    <FormControlLabel 
                                        slotProps={{ 
                                            typography: { 
                                                sx: { fontSize: 14 } 
                                            } 
                                        }}  
                                        key={key}
                                        value={option.value} 
                                        label={option.name} 
                                        control={<Radio/>}
                                    />
                                ))
                            }
                        </RadioGroup>
                        <Divider/>
                        <RadioGroup onChange={handleSortChange} value={priorityValue === "none" ? "" : sortValue}>
                            {
                                sort.map((option, key) => (
                                    <FormControlLabel 
                                        slotProps={{ 
                                            typography: { 
                                                sx: { fontSize: 14 } 
                                            } 
                                        }}
                                        disabled={priorityValue === "none"}
                                        key={key}
                                        value={option.value} 
                                        label={option.name} 
                                        control={<Radio/>}
                                    />
                                ))
                            }
                        </RadioGroup>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button type="button" variant="contained" color="primary" fullWidth onClick={handleApply} sx={{ textTransform: 'none', borderRadius: 5 }}>Apply</Button>
            </DialogActions>
        </Dialog>
    )
}