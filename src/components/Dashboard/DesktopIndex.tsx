import { useState, useEffect } from 'react';
import { Grid, Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Icon, Avatar } from '@mui/material'
import { useNavigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { getUserData } from '../../api/auth/auth';
import { setAuthData } from '../../reducer/AuthSlice';

// icons
import LogoHeader from '../../assets/Logo Header.svg';
import AvatarIcon from '../../assets/Icons/Avatar.svg';


// Component
import SignOutComponent from '../Auth/SignOut';
import { LogOut, LayoutDashboard } from 'lucide-react';

export default function DesktopIndex() {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { authData } = useSelector((state: RootState) => state.auth)
    
    const handleSignOutComponent = () => setOpen(true);

    const items = [
      {
        text: "Dashboard",
        icon: <LayoutDashboard size={20}/>,
        selected: true,
        action: () => navigate("/"),
      },
      {
        text: "Sign out",
        icon: <LogOut size={20}/>,
        selected: false,
        action: handleSignOutComponent
      }
    ];

    const fetch = async () => {
      const result = await getUserData();
      if(result.status === 200){
        dispatch(setAuthData(result?.data))
      }
    }

    useEffect(() => {
      fetch();
    }, [])

    return (
      <>
        <SignOutComponent open={open} handleCancel={() => setOpen(false)}/>
        <Grid container>
          <Grid size={1.5}>
            <Box sx={{ minHeight: '100vh', display: "flex", flexDirection: 'column', borderRadius: 5 }}>
              <Box>
                <img src={LogoHeader} alt="logo" height={50} width="100%"/>
              </Box>
              <List sx={{ padding: 2 }}>
                {
                  items.map((item, key) => {
                    return <ListItemButton
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: 'black',
                          color: '#fff',
                          borderRadius: 3
                        },
                        '&.Mui-selected:hover': {
                            backgroundColor: 'black',
                            color: '#fff',
                        },
                        margin: 0.5
                      }}
                      key={key} 
                      selected={item.selected} 
                      onClick={item.action}>
                      <ListItemIcon>
                        <Icon sx={{ color: item.selected ? '#fff' : 'black' }}>{item.icon}</Icon>
                      </ListItemIcon>
                      <ListItemText>
                        <Typography sx={{ fontSize: 14, fontWeight: 'thin' }} variant="body1">{item.text}</Typography>
                      </ListItemText>
                    </ListItemButton>
                  })
                }
              </List>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 'auto', marginBottom: 5 }}>
                <Avatar src={AvatarIcon} alt="avatar" sx={{ width: 30, height: 30, marginRight: 1 }}/>
                <Typography variant="body2">{authData.username}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={10.5}>
            <Box sx={{ height: "100vh", boxSizing: "border-box", padding: 2, overflowY: 'auto' }}>
              <Outlet/>
            </Box>
          </Grid>
        </Grid>
      </>
    )
}
