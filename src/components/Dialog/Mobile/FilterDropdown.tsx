import { Dialog, FormControl, FormLabel, DialogContent, DialogActions, Button, Typography, Box, Stack, IconButton, Divider, RadioGroup, Radio, FormControlLabel } from '@mui/material'
import { useEffect, useState } from 'react'
import Close from '../../../assets/Icons/Close.svg';

export default function FilterDropdownDialog({ open, proceed, priorities, status, close, selectedStatus, selectedPriority }: { open:boolean, proceed: (priority: string, status: string) => void, close: () => void, priorities: { value: string, label: string}[], status: { value: string, label: string}[], selectedStatus: string, selectedPriority: string }) {
    const [priorityValue, setPriorityValue] = useState(selectedPriority)
    const [statusValue, setStatusValue] = useState(selectedStatus)

    const handleClose = () => {
        close()
        setPriorityValue("")
        setStatusValue("")
    };

    const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => setPriorityValue(e.target.value)
    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => setStatusValue(e.target.value)

    const handleApply = () =>  {
        proceed(priorityValue, statusValue)
        close();
    }
    
    useEffect(() => {
        setStatusValue(selectedStatus)
        setPriorityValue(selectedPriority)
    }, [selectedStatus, selectedPriority])

    return (
        <Dialog fullWidth maxWidth="xl" open={open} sx={{
            '& .MuiDialog-paper': {
                borderRadius: '20px',
                boxShadow: 'none',
                marginTop: '64px',
                margin: 1,
                width: '100%',
                marginBottom: 8
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
                <Typography sx={{ fontSize: 16, fontWeight: 'bold', flexGrow: 1, paddingLeft: 4 }}>Filter Mobile</Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end", m: 0, p: 1  }}>
                    <IconButton onClick={handleClose}><img src={Close} alt="close-model" height={15} width={15}/></IconButton>
                </Box>
            </Box>
            <Divider/>
            <DialogContent sx={{ m: 0, p: 2 }}>
                <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend" sx={{ fontSize: 14, mb: 1 }}>Priority</FormLabel>
                            <RadioGroup 
                                name="filter-priority-group" // Explicit unique form namespace mapping
                                onChange={handlePriorityChange} 
                                value={priorityValue}
                            >
                                {
                                    priorities.map((option, key) => (
                                        <FormControlLabel 
                                            key={`priority-${key}`}
                                            value={option.label} // FIX: Bind to programmatic value instead of UI label string
                                            label={option.label} // Keeps client layout text clean
                                            control={<Radio/>}
                                            slotProps={{ 
                                                typography: { 
                                                    sx: { fontSize: 14 } 
                                                } 
                                            }}  
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        {/* 2. Isolated Status Controller Block */}
                        <FormControl component="fieldset">
                            <FormLabel component="legend" sx={{ fontSize: 14, mb: 1 }}>Status</FormLabel>
                            <RadioGroup 
                                name="filter-status-group" // Explicit unique form namespace mapping
                                onChange={handleStatusChange} 
                                value={statusValue}
                            >
                                {
                                    status.map((option, key) => (
                                        <FormControlLabel 
                                            key={`status-${key}`}
                                            value={option.label} // FIX: Bind to programmatic value instead of UI label string
                                            label={option.label} // Keeps client layout text clean
                                            control={<Radio/>}
                                            slotProps={{ 
                                                typography: { 
                                                    sx: { fontSize: 14 } 
                                                } 
                                            }}  
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button type="button" variant="contained" color="primary" fullWidth onClick={handleApply} sx={{ textTransform: 'none', borderRadius: 5 }}>Apply</Button>
            </DialogActions>
        </Dialog>
    )
}