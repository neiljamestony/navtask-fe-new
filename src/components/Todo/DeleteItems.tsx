import { useTheme, useMediaQuery } from '@mui/material';
import DesktopDeleteItems from './DesktopDeleteItems';
import MobileDeleteItems from './MobileDeleteItems';

export default function DeleteItems({ proceed, open, close, ids, loading }: { proceed: (params: string[] | []) => void, open: boolean, close: () => void, ids: string[] | [], loading: boolean }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return isMobile ? <MobileDeleteItems proceed={proceed} open={open} close={close} ids={ids} loading={loading}/> : <DesktopDeleteItems proceed={proceed} open={open} close={close} ids={ids} loading={loading}/>
}