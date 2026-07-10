import { Dialog, DialogContent, DialogActions, Button, Typography, CircularProgress, Box, Stack, IconButton } from '@mui/material'
import Alert from '../../assets/Icons/Alert.svg';
import Close from '../../assets/Icons/Close.svg';

export default function MobileDeleteItems({ proceed, open, close, ids, loading }: { proceed: (params: string[] | []) => void, open: boolean, close: () => void, ids: string[] | [], loading: boolean }) {

    const handleProceed = async () => {
        proceed(ids)
    }

    const handleClose = () => {
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
            <Box sx={{ display: "flex", justifyContent: "flex-end", m: 0, p: 1  }}>
                <IconButton onClick={close}><img src={Close} alt="close-model" height={15} width={15}/></IconButton>
            </Box>
            <DialogContent sx={{ m: 0, p: 0 }}>
                <Stack spacing={2}>
                    <Box><img src={Alert} alt="alert-icon" height={50} width="100%"/></Box>
                    <Typography sx={{ fontFamily: "Roboto", textAlign: 'center', color: 'grey.600' }}><span style={{ color: '#62C6FF' }}>{ids.length}</span> {ids.length > 1 ? "Tasks" : "Task"} will be deleted.</Typography>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button type="button" variant="outlined" color="primary" fullWidth onClick={handleClose} sx={{ textTransform: 'none', borderRadius: 5 }} disabled={loading}>Cancel</Button>
                <Button type="button" variant="contained" color="primary" fullWidth onClick={handleProceed} sx={{ textTransform: 'none', borderRadius: 5 }} disabled={loading}>{loading ? <CircularProgress color="inherit" size={30}/> : "Delete"}</Button>
            </DialogActions>
        </Dialog>
    )
}