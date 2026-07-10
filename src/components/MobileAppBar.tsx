import { useState } from "react"

import { AppBar, Toolbar, IconButton } from "@mui/material"
import Avatar from '../assets/Icons/Avatar.svg'
import SignOutComponent from "./Auth/SignOut"

export function MobileAppBar({ children }: { children : React.ReactNode }) {
    const [openSignOut, setOpenSignOut] = useState(false)
    return (
        <>
            <SignOutComponent open={openSignOut} handleCancel={() => setOpenSignOut(false)}/>
            <AppBar position="fixed" color="inherit" sx={{ top: 'auto', bottom: 0 }}>
                <Toolbar sx={{ display: "flex", justifyContent: 'space-evenly', alignItems: 'center'}}>
                    {children}
                    <IconButton color="inherit" aria-label="new-task" onClick={() => setOpenSignOut(true)}>
                        <img src={Avatar} alt="sign-out-icon" height={20} width={20}/>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </>
    )
}