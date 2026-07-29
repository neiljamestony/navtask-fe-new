import WallPaper from '../../../assets/Wallpaper.svg';

export const DesktopContainer = {
    backgroundImage: `url(${WallPaper})`, 
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    backgroundRepeat: 'no-repeat', 
    height: "100vh", 
    width: '100%' 
}

export const DesktopLogoContainer = {
    display: "flex", 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: "100vh"
}

export const FormContainer = {
    display: "flex", 
    justifyContent: 'center', 
    alignItems: 'center', 
    textAlign: 'center', 
    height: "100vh"
}

export const FormContainerStatusText = {
    fontFamily: "Roboto", 
    fontSize: 34, 
    fontWeight: 'bold' 
}

export const ExistingAccountlabel =  {
   fontFamily: 'Roboto', 
   fontSize: 20, 
   fontWeight: 'medium',
   textAlign: 'center'
}

export const SpanLink = {
   fontFamily: "Roboto", 
   fontWeight: "bold", 
   color: "#1976d2" 
}

export const MobileForm = {
    height: '80%', 
    width: '100%', 
    margin: 30
}

export const MobileCreateAccountLabel = {
    fontFamily: "Roboto", 
    fontSize: 34, 
    fontWeight: 'bold', 
    textAlign: 'center'
}

export const PasswordRequirements = {
    fontSize: 15,
    fontFamily: 'Roboto'
}

export const MobileSignOutDialog = {
    '& .MuiDialog-paper': {
        borderRadius: '20px',
        boxShadow: 'none',
        marginTop: '64px',
        margin: 1,
        marginBox: 0,
        width: '100%',
        marginBottom: 10
    },
    '& .MuiDialog-container': {
        alignItems: 'flex-end',
    }
}

export const MobileSignOutHeaderContainer = {
    display: "flex", 
    justifyContent: 'space-between', 
    padding: 2 
}

export const MobileSignOutMessageContainer = {
    flexGrow: 1, 
    height: '100%'  
}

export const DesktopSignOutDialog = {
    '& .MuiDialog-paper': {
        borderRadius: '20px',
    },
}