import { useMediaQuery, useTheme } from "@mui/material";
import DesktopTodo from "./DesktopTodo";
import MobileTodo from "./MobileTodo";
import { useSelector } from 'react-redux'
import type {RootState} from '../../store/store'
import AdminDashboard from "../Admin/Index";

export default function Todo() {
    const { authData } = useSelector((state: RootState) => state.auth)
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    return authData.userType === "admin" ? <AdminDashboard /> : isMobile || isTablet ? <MobileTodo/> : <DesktopTodo/>
}