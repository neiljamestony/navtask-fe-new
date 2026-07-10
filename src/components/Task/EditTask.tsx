import { useTheme, useMediaQuery } from '@mui/material';
import EditTaskDesktop from './EditTaskDesktop';
import EditTaskMobile from './EditTaskMobile';

export default function EditTask() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    return isMobile || isTablet ? <EditTaskMobile/> : <EditTaskDesktop/>
}