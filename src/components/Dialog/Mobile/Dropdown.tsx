import {
  DropdownDialogDialogStyle1,
  DropdownBoxTextStyle2,
  DropdownTypographyTextStyle3,
  DropdownBoxLayoutStyle4,
  DropdownDialogContentSpacingStyle5,
  DropdownButtonSurfaceStyle6
} from "../../Styles/Dialog/Mobile/Dropdown/Dropdown.styles";
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
        <Dialog fullWidth maxWidth="xl" open={open} sx={DropdownDialogDialogStyle1}
        slotProps={{
            backdrop: {
                sx: {
                    height: '93.5vh',
                    bottom: 'auto',
                    top: 0,
                }
            }
        }}>
            <Box sx={DropdownBoxTextStyle2}>
                <Typography sx={DropdownTypographyTextStyle3}>{title}</Typography>
                <Box sx={DropdownBoxLayoutStyle4}>
                    <IconButton onClick={handleClose}><img src={Close} alt="close-model" height={15} width={15}/></IconButton>
                </Box>
            </Box>
            <Divider/>
            <DialogContent sx={DropdownDialogContentSpacingStyle5}>
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
                <Button type="button" variant="contained" color="primary" fullWidth onClick={handleApply} sx={DropdownButtonSurfaceStyle6}>Apply</Button>
            </DialogActions>
        </Dialog>
    )
}