import { Dialog, DialogContent, DialogActions, Button, Typography, Box, Stack, IconButton, Divider, RadioGroup, Radio, FormControlLabel } from '@mui/material'
import { useState, useEffect } from 'react'
import Close from '../../../assets/Icons/Close.svg';

export default function DropdownDialog(
    { open, title, options, proceed, close, defaultValue }: 
    { open: boolean, title: string, options: {label: string, value: string, active?: boolean}[], proceed: (value: string) => void, close: () => void, defaultValue: string }
    ) {
    const [optionValue, setOptionValue] = useState(defaultValue)

    const handleClose = () => {
        close()
        setOptionValue(defaultValue)
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setOptionValue(e.target.value)

    const handleApply = () =>  {
        proceed(optionValue)
        close();
    }

    useEffect(() => {
        setOptionValue(defaultValue)
    }, [defaultValue])

    return (
        <Dialog fullWidth maxWidth="xl" open={open} sx={{
            '& .MuiDialog-paper': {
                borderRadius: '20px',
                boxShadow: 'none',
                marginTop: '64px',
                margin: 1,
                marginBox: 0,
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
                <Typography sx={{ fontSize: 16, fontWeight: 'bold', flexGrow: 1, paddingLeft: 4 }}>{title}</Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end", m: 0, p: 1  }}>
                    <IconButton onClick={handleClose}><img src={Close} alt="close-model" height={15} width={15}/></IconButton>
                </Box>
            </Box>
            <Divider/>
            <DialogContent sx={{ m: 0, p: 2 }}>
                <Stack spacing={2}>
                    <RadioGroup onChange={handleChange} value={optionValue}>
                        {
                            options.map((option, key) => (
                                <FormControlLabel 
                                    slotProps={{ 
                                        typography: { 
                                            sx: { fontSize: 14 } 
                                        } 
                                    }}  
                                    key={key}
                                    disabled={!option.active}
                                    value={option.value} 
                                    label={option.label} 
                                    control={<Radio/>}
                                />
                            ))
                        }
                        
                    </RadioGroup>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button type="button" variant="contained" color="primary" fullWidth onClick={handleApply} sx={{ textTransform: 'none', borderRadius: 5 }}>Apply</Button>
            </DialogActions>
        </Dialog>
    )
}