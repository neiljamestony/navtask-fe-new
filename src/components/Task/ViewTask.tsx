import { useTheme, useMediaQuery } from "@mui/material";
import ViewTaskDesktop from "./ViewTaskDesktop";
import ViewTaskMobile from "./ViewTaskMobile";

export default function ViewTask(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    return isMobile || isTablet ? <ViewTaskMobile/> : <ViewTaskDesktop/>
}