import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress, IconButton, Box } from '@mui/material'
import { logout } from '../../api/auth/auth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Close from '../../assets/Icons/Close.svg'
import { MobileSignOutDialog, MobileSignOutHeaderContainer, MobileSignOutMessageContainer } from '../Styles/Auth/Auth'

export default function MobileSignOut({ open, handleCancel }: { open: boolean, handleCancel: () => void }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const handleSignOut = async () => {
        setLoading(true)
        const result = await logout();
        if(result?.status === 200){
            setLoading(false)
            navigate('/login');
        }
    }

    return (
        <Dialog fullWidth maxWidth="xl" open={open} sx={MobileSignOutDialog}
        slotProps={{
            backdrop: {
                sx: {
                    height: '94.5vh',
                    bottom: 'auto',
                    top: 0,
                }
            }
        }}>
            <Box sx={MobileSignOutHeaderContainer}>
                <DialogTitle sx={{ m: 0, p: 2 }}>Sign out</DialogTitle>
                <IconButton onClick={handleCancel}><img src={Close} alt="close-model" height={15} width={15}/></IconButton>
            </Box>
            <DialogContent sx={MobileSignOutMessageContainer}>
                <Typography sx={{ fontFamily: "Roboto" }}>Are you sure you want to sign out? All unsaved changes will be lost</Typography>
            </DialogContent>
            <DialogActions>
                <Button type="button" variant="text" onClick={handleCancel} sx={{ textTransform: 'none', color: 'black' }} disabled={loading}>Cancel</Button>
                <Button type="button" variant="text" onClick={handleSignOut} sx={{ textTransform: 'none', color: 'black' }} disabled={loading}>{loading ? <CircularProgress color="inherit" size={30}/> : "Sign out"}</Button>
            </DialogActions>
        </Dialog>
    )
}