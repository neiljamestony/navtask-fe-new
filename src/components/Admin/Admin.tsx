import { useTheme, useMediaQuery } from '@mui/material';
import DesktopIndex from './AdminDashboardDesktop';
import MobileIndex from './AdminDashboardMobile';

export default function AdminIndex() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  return isMobile || isTablet ? <MobileIndex/> : <DesktopIndex/>
}
