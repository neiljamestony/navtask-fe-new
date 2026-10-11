import {
  DeleteSubTaskDialogDialogStyle1,
  DeleteSubTaskTypographyTextStyle2,
  DeleteSubTaskTypographyTextStyle3,
  DeleteSubTaskButtonSurfaceStyle4,
  DeleteSubTaskButtonSurfaceStyle5
} from "../Styles/Todo/DeleteSubTask/DeleteSubTask.styles";
import { Dialog, DialogContent, DialogActions, Button, Typography, Box, Stack } from '@mui/material'
import Alert from '../../assets/Icons/Alert.svg';

export default function DeleteSubTask({ proceed, open, close, subtaskTitle, itemToDelete }: { proceed: (key: number) => void, open: boolean, close: () => void, subtaskTitle: string, itemToDelete: number }) {
    const handleProceed = () => {
        proceed(itemToDelete)
        close();
    }

    const handleClose = () => {
        close();
    }

    return (
        <Dialog fullWidth maxWidth="xl" open={open} sx={DeleteSubTaskDialogDialogStyle1}
        slotProps={{
            backdrop: {
                sx: {
                    height: '93.5vh',
                    bottom: 'auto',
                    top: 0,
                }
            }
        }}>
            <DialogContent>
                <Stack spacing={2}>
                    <Box><img src={Alert} alt="alert-icon" height={50} width="100%"/></Box>
                    <Typography sx={DeleteSubTaskTypographyTextStyle2}>Delete this subtask?</Typography>
                    <Typography sx={DeleteSubTaskTypographyTextStyle3}>{subtaskTitle}</Typography>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button type="button" variant="outlined" color="primary" fullWidth onClick={handleClose} sx={DeleteSubTaskButtonSurfaceStyle4}>Cancel</Button>
                <Button type="button" variant="contained" color="primary" fullWidth onClick={handleProceed} sx={DeleteSubTaskButtonSurfaceStyle5}>Delete</Button>
            </DialogActions>
        </Dialog>
    )
}