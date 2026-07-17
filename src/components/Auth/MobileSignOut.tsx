import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress, IconButton, Box } from '@mui/material'
import { logout } from '../../api/auth/auth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Close from '../../assets/Icons/Close.svg'

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
            <Box sx={{ display: "flex", justifyContent: 'space-between', padding: 2 }}>
                <DialogTitle sx={{ m: 0, p: 2 }}>Sign out</DialogTitle>
                <IconButton onClick={handleCancel}><img src={Close} alt="close-model" height={15} width={15}/></IconButton>
            </Box>
            <DialogContent sx={{ flexGrow: 1, height: '100%' }}>
                <Typography sx={{ fontFamily: "Roboto" }}>Are you sure you want to sign out? All unsaved changes will be lost</Typography>
            </DialogContent>
            <DialogActions>
                <Button type="button" variant="text" onClick={handleCancel} sx={{ textTransform: 'none', color: 'black' }} disabled={loading}>Cancel</Button>
                <Button type="button" variant="text" onClick={handleSignOut} sx={{ textTransform: 'none', color: 'black' }} disabled={loading}>{loading ? <CircularProgress color="inherit" size={30}/> : "Sign out"}</Button>
            </DialogActions>
        </Dialog>
    )
}