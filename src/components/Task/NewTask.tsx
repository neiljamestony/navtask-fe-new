import { useTheme, useMediaQuery } from '@mui/material';
import NewTaskDesktop from './NewTaskDesktop';
import NewTaskMobile from './NewTaskMobile';

export default function NewTask() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    return isMobile || isTablet ? <NewTaskMobile/> : <NewTaskDesktop/>
}