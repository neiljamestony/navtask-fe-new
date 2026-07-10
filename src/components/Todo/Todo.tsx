import { useMediaQuery, useTheme } from "@mui/material";
import DesktopTodo from "./DesktopTodo";
import MobileTodo from "./MobileTodo";

export default function Todo() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    return isMobile || isTablet ? <MobileTodo/> : <DesktopTodo/>
}