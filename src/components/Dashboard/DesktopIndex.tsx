import { useState, useEffect } from 'react';
import { Grid, Box, Divider, Typography, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useNavigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { getUserData } from '../../api/auth/auth';
import { setAuthData } from '../../reducer/AuthSlice';

// icons
import LogoHeader from '../../assets/Logo Header.svg';
import Avatar from '../../assets/Icons/Avatar.svg';
import Home from '../../assets/Icons/Home.svg';
import SignOut from '../../assets/Icons/SignOut.svg';


// Component
import SignOutComponent from '../Auth/SignOut';

export default function DesktopIndex() {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { authData } = useSelector((state: RootState) => state.auth)
    
    const handleSignOutComponent = () => setOpen(true);

    const items = [
      {
        text: "Home",
        icon: <img src={Home} alt="home-icon" height={20} width={20}/>,
        selected: true,
        action: () => navigate("/"),
      },
      {
        text: "Sign out",
        icon: <img src={SignOut} alt="sign-out-icon" height={20} width={20}/>,
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
          <Grid size={2}>
            <Box sx={{ height: '100vh'}}>
              <Box>
                <img src={LogoHeader} alt="logo" height={50} width="100%"/>
              </Box>
              <Divider/>
              <Box sx={{ marginTop: 5 }}>
                  <Box sx={{ textAlign: 'center'}}>
                    <img src={Avatar} alt="avatar" height={50} width="100%"/>
                    <Typography variant="body2">{authData.username}</Typography>
                  </Box>
              </Box>
              <Box>
                <List>
                  {
                    items.map((item, key) => {
                      return <ListItemButton key={key} selected={item.selected} onClick={item.action}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText>{item.text}</ListItemText>
                      </ListItemButton>
                    })
                  }
                </List>
              </Box>
              
            </Box>
          </Grid>
          <Grid size={10}>
            <Box sx={{ height: "100vh", padding: 2, boxSizing: "border-box"}}>
              <Box sx={{ backgroundColor: "#F2F8FD", height: "100%", overflowY: "auto", borderRadius: 5}}>
                <Outlet/>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
      </>
    )
}
