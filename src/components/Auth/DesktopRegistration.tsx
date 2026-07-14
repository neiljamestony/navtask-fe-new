import { useState } from 'react'
import { Box, Card, CardHeader, CardContent, TextField, Button, Stack, ListItem, ListItemText, ListItemIcon, List, CircularProgress, Typography, Grid, InputAdornment, IconButton } from '@mui/material'
import { Circle, Check } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import type { IAuth } from '../../typescript/interface'
import toast from 'react-hot-toast'
import { registration } from '../../api/auth/auth';
import SocialMediaAuth from './SocialMediaAuth'
import { setAuthStatus } from '../../reducer/AuthSlice'
import { useDispatch } from 'react-redux'

import WallPaper from '../../assets/Wallpaper.svg';
import BrandAndLogo from '../../assets/Brand and logo.svg';
import ShowIcon from '../../assets/Icons/Show.svg';
import HideIcon from '../../assets/Icons/Hide.svg';

export default function DesktopRegistration() {
    const [formData, setFormData] = useState<IAuth>({
        username: "",
        password: ""
    })
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{key: string, error: string}[] | []>([]);
    const [showPassword, setShowPassword] = useState(false);
    const regex = /^[A-Za-z0-9 !#()_-]+$/;

    const containsNameOrEmail = formData.password === "" || formData.password.includes(formData.username);
    const hasMinLength = formData.password.length >= 8;
    const hasNumberOrSymbol = regex.test(formData.password);
    const passwordStrength = !containsNameOrEmail && hasMinLength && hasNumberOrSymbol ? "Strong" : "Weak";
    const passwordRequirements = [
        {
            icon: containsNameOrEmail ? <Circle sx={{ fontSize: 11, color: 'black' }}/> : <Check sx={{ fontSize: 15 }} color="primary"/>,
            text: "Cannot contain your name or email address",
        },
        {
            icon: hasMinLength ? <Check sx={{ fontSize: 15 }} color="primary"/> : <Circle sx={{ fontSize: 11, color: 'black' }}/>,
            text: "Atleast 8 characters",
        },
        {
            icon: hasNumberOrSymbol ? <Check sx={{ fontSize: 15 }} color="primary"/> : <Circle sx={{ fontSize: 11, color: 'black' }}/>,
            text: "Contains a number or symbol",
        }
    ]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (formData: IAuth): Promise<void> => {
        setLoading(true)
        if(passwordStrength === "Strong"){
            const result = await registration(formData);
            if(result?.status === 422){
                 setErrors(result?.errors)
                setLoading(false)
            }else if(result?.status === 200){
                dispatch(setAuthStatus(result?.msg))
                navigate("/login");
                setErrors(result?.errors)
                setLoading(false)
            }else if(result?.status === 500){
                toast.error("Something went wrong, please try again later.");
                setLoading(false);
            }else{
                toast.error(result?.msg);
                setLoading(false)
            }
        }else{
            setLoading(false)
        }
    }

    return (
        <Grid container>
            <Grid size={6}>
                <Box sx={{ backgroundImage: `url(${WallPaper})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', height: "100vh", width: '100%' }}>
                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', height: "100vh"}}>
                        <img src={BrandAndLogo} alt="brand-and-logo" height={100} width="100%"/>
                    </Box>
                </Box>
            </Grid>
            <Grid size={6}>
                <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', textAlign: 'center', height: "100vh" }}>
                    <Card variant="outlined" sx={{ height: 600, width: 400}}>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(formData)
                        }}>
                            <CardHeader title={<Box sx={{ fontFamily: "Roboto", fontSize: 34, fontWeight: 'bold' }}>Create an account</Box>}/>
                            <CardContent>
                                <Stack spacing={2}>
                                    <TextField name="username" error={errors.length > 0 && errors.filter((error) => error.key === "username").length > 0} helperText={errors.length > 0 && errors.filter((error) => error.key === "username").length > 0 ? errors.filter((error) => error.key === "username")[0].error : ""} value={formData.username} type="text" size="small" label="Username" onChange={handleChange}/>
                                    <TextField 
                                        name="password"
                                        value={formData.password} 
                                        type={showPassword ? "text" : "password"} 
                                        size="small" 
                                        label="Password"
                                        error={errors.length > 0 && errors.filter((error) => error.key === "password").length > 0}
                                        helperText={errors.length > 0 && errors?.filter((error) => error.key === "password").length > 0 ? errors?.filter((error) => error.key === "password")[0].error : ""}
                                        onChange={handleChange}
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label={
                                                        showPassword ? 'hide the password' : 'display the password'
                                                        }
                                                        onClick={() => setShowPassword((prev) => !prev)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <img src={HideIcon} alt="hide-password" height={20} width="100%"/> : <img src={ShowIcon} alt="show-password" height={15} width="100%"/> }
                                                    </IconButton>
                                                </InputAdornment>,
                                            },
                                        }}
                                    />
                                    <Box sx={{ 
                                            textAlign: "left", 
                                            color: passwordStrength === "Weak" ? '#d32f2f' : '#1976d2', 
                                            fontSize: 13, 
                                            fontFamily: 'Roboto',
                                            display: formData.username === "" || formData.password === "" ? "none" : "block"
                                        }}>
                                            Password Strength: {passwordStrength}
                                        </Box>
                                    <Box>
                                        {
                                            passwordRequirements.map((value, key) => {
                                                return <List key={key} sx={{ margin: 0, padding: 0 }}>
                                                        <ListItem sx={{ margin: 0, padding: 0 }}>
                                                        <ListItemIcon>
                                                            {value.icon}
                                                        </ListItemIcon>
                                                        <ListItemText>
                                                            <Box sx={{ fontSize: 12, fontFamily: "Roboto" }}>{value.text}</Box>
                                                        </ListItemText>
                                                    </ListItem>
                                                </List>
                                            })
                                        }
                                    </Box>
                                    <Button variant="contained" type="submit" color="primary" disabled={loading}>{loading ? <CircularProgress size={30} color="inherit"/> : "Submit"}</Button>
                                        <Typography variant="caption" sx={{ fontFamily: 'Roboto', fontSize: 20, fontWeight: 'medium' }}>Already have an account? <Link to='/login'><span style={{ fontFamily: "Roboto", fontWeight: "bold", color: "#1976d2"}}>Sign in</span></Link></Typography>
                                    <SocialMediaAuth/>
                                </Stack>
                            </CardContent>      
                        </form>  
                    </Card>
                </Box>
            </Grid>
        </Grid>
    )
}
