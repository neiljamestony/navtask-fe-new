import { useTheme, useMediaQuery } from '@mui/material'

import DesktopLogin from './DesktopLogin'
import MobileLogin from './MobileLogin'

export default function Login() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    return isMobile || isTablet ? <MobileLogin/> : <DesktopLogin/>
}
