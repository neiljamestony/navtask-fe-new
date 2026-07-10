import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from '@mui/material'
import { logout } from '../../api/auth/auth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function DesktopSignOut({ open, handleCancel }: { open: boolean, handleCancel: () => void }) {
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
        <Dialog open={open} sx={{
            '& .MuiDialog-paper': {
            borderRadius: '20px',
            },
        }}>
            <DialogTitle>Sign out</DialogTitle>
            <DialogContent>
                <Typography sx={{ fontFamily: "Roboto" }}>Are you sure you want to sign out?</Typography>
                <Typography sx={{ fontFamily: "Roboto" }}>All unsaved changes will be lost.</Typography>
            </DialogContent>
            <DialogActions>
                <Button type="button" variant="text" onClick={handleCancel} sx={{ textTransform: 'none', color: 'black' }} disabled={loading}>Cancel</Button>
                <Button type="button" variant="text" onClick={handleSignOut} sx={{ textTransform: 'none', color: 'black' }} disabled={loading}>{loading ? <CircularProgress color="inherit" size={30}/> : "Sign out"}</Button>
            </DialogActions>
        </Dialog>
    )
}