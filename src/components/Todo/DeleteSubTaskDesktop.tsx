import {
  DeleteSubTaskDesktopDialogDialogStyle1,
  DeleteSubTaskDesktopTypographyTextStyle2,
  DeleteSubTaskDesktopTypographyTextStyle3,
  DeleteSubTaskDesktopButtonSurfaceStyle4,
  DeleteSubTaskDesktopButtonSurfaceStyle5
} from "../Styles/Todo/DeleteSubTaskDesktop/DeleteSubTaskDesktop.styles";
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
        <Dialog fullWidth maxWidth="xl" open={open} sx={DeleteSubTaskDesktopDialogDialogStyle1}>
            <DialogContent>
                <Stack spacing={2}>
                    <Box><img src={Alert} alt="alert-icon" height={50} width="100%"/></Box>
                    <Typography sx={DeleteSubTaskDesktopTypographyTextStyle2}>Delete this subtask?</Typography>
                    <Typography sx={DeleteSubTaskDesktopTypographyTextStyle3}>{subtaskTitle}</Typography>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button type="button" variant="outlined" color="primary" fullWidth onClick={handleClose} sx={DeleteSubTaskDesktopButtonSurfaceStyle4}>Cancel</Button>
                <Button type="button" variant="contained" color="primary" fullWidth onClick={handleProceed} sx={DeleteSubTaskDesktopButtonSurfaceStyle5}>Delete</Button>
            </DialogActions>
        </Dialog>
    )
}