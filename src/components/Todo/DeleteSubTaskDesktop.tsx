import { Dialog, DialogContent, DialogActions, Button, Typography, Box, Stack } from '@mui/material'
import Alert from '../../assets/Icons/Alert.svg';

export default function DeleteSubTaskDesktop({ proceed, open, close, subtaskTitle, itemToDelete }: { proceed: (key: number) => void, open: boolean, close: () => void, subtaskTitle: string, itemToDelete: number }) {
    const handleProceed = () => {
        proceed(itemToDelete)
        close();
    }

    const handleClose = () => {
        close();
    }

    return (
        <Dialog fullWidth maxWidth="xl" open={open} sx={{
            '& .MuiDialog-paper': {
                borderRadius: '20px',
                boxShadow: 'none',
                width: 300
            },
        }}>
            <DialogContent>
                <Stack spacing={2}>
                    <Box><img src={Alert} alt="alert-icon" height={50} width="100%"/></Box>
                    <Typography sx={{ fontFamily: "Roboto", textAlign: 'center', color: 'grey.600' }}>Delete this subtask?</Typography>
                    <Typography sx={{ fontFamily: "Roboto", textAlign: 'center', color: 'grey.600', fontWeight: 'bold', fontSize: 20, textDecoration: 'underline' }}>{subtaskTitle}</Typography>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button type="button" variant="outlined" color="primary" fullWidth onClick={handleClose} sx={{ textTransform: 'none', borderRadius: 5 }}>Cancel</Button>
                <Button type="button" variant="contained" color="primary" fullWidth onClick={handleProceed} sx={{ textTransform: 'none', borderRadius: 5 }}>Delete</Button>
            </DialogActions>
        </Dialog>
    )
}