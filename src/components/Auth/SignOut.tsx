import { useTheme, useMediaQuery } from '@mui/material'
import DesktopSignOut from './DesktopSignOut'
import MobileSignOut from './MobileSignOut'

export default function SignOut({ open, handleCancel }: { open: boolean, handleCancel: () => void }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    return isMobile || isTablet ? <MobileSignOut open={open} handleCancel={handleCancel}/> : <DesktopSignOut open={open} handleCancel={handleCancel}/>
}