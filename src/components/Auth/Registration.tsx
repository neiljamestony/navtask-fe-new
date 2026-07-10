import { useTheme, useMediaQuery } from '@mui/material';
import DesktopRegistration from './DesktopRegistration'
import MobileRegistration from './MobileRegistration'

export default function Registration() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    return isMobile || isTablet ? <MobileRegistration/> : <DesktopRegistration/>
}
