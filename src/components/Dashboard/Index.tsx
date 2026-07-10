import { useTheme, useMediaQuery } from '@mui/material';
import DesktopIndex from './DesktopIndex';
import MobileIndex from './MobileIndex';

export default function Index() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  return isMobile || isTablet ? <MobileIndex/> : <DesktopIndex/>
}
