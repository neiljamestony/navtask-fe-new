import {
  MobileRegistrationCircleTextStyle1,
  MobileRegistrationCheckTextStyle2,
  MobileRegistrationCheckTextStyle3,
  MobileRegistrationCircleTextStyle4,
  MobileRegistrationCheckTextStyle5,
  MobileRegistrationCircleTextStyle6,
  MobileRegistrationBoxTextStyle7,
  MobileRegistrationformSizeStyle8,
  MobileRegistrationBoxTextStyle9,
  MobileRegistrationListSpacingStyle10,
  MobileRegistrationListItemSpacingStyle11,
  MobileRegistrationButtonTextStyle12,
  MobileRegistrationTypographyTextStyle13,
  MobileRegistrationspanTextStyle14
} from "../Styles/Auth/MobileRegistration/MobileRegistration.styles";
import { useState } from 'react'
import { Box, TextField, Button, Stack, ListItem, ListItemText, ListItemIcon, List, CircularProgress, Typography, Grid, InputAdornment, IconButton } from '@mui/material'
import { Circle, Check } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import type { IAuth } from '../../typescript/interface'
import toast from 'react-hot-toast'
import { registration } from '../../api/auth/auth';
import SocialMediaAuth from './SocialMediaAuth'
import { setAuthStatus } from '../../reducer/AuthSlice'
import { useDispatch } from 'react-redux'
import ShowIcon from '../../assets/Icons/Show.svg';
import HideIcon from '../../assets/Icons/Hide.svg';
import { MobileCreateAccountLabel, PasswordRequirements } from '../Styles/Auth/Auth'

export default function MobileRegistration() {
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
            icon: containsNameOrEmail ? <Circle sx={MobileRegistrationCircleTextStyle1}/> : <Check sx={MobileRegistrationCheckTextStyle2} color="primary"/>,
            text: "Cannot contain your name or email address",
        },
        {
            icon: hasMinLength ? <Check sx={MobileRegistrationCheckTextStyle3} color="primary"/> : <Circle sx={MobileRegistrationCircleTextStyle4}/>,
            text: "Atleast 8 characters",
        },
        {
            icon: hasNumberOrSymbol ? <Check sx={MobileRegistrationCheckTextStyle5} color="primary"/> : <Circle sx={MobileRegistrationCircleTextStyle6}/>,
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
            <Grid size={12}>
                <Box sx={MobileRegistrationBoxTextStyle7}>
                    <form style={MobileRegistrationformSizeStyle8} onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(formData)
                        }}>
                       
                        <Stack spacing={2}>
                            <Typography sx={MobileCreateAccountLabel}>Create an account</Typography>
                            <TextField 
                                name="username"
                                error={errors.length > 0 && errors.filter((error) => error.key === "username").length > 0} 
                                helperText={errors.length > 0 && errors.filter((error) => error.key === "username").length > 0 ? errors.filter((error) => error.key === "username")[0].error : ""} 
                                value={formData.username} 
                                type="text" 
                                size="small" 
                                label="Username"
                                fullWidth
                                onChange={handleChange}/>
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
                            <Box sx={MobileRegistrationBoxTextStyle9({ passwordStrength: passwordStrength, formData: formData })}>
                                    Password Strength: {passwordStrength}
                                </Box>
                            <Box>
                                {
                                    passwordRequirements.map((value, key) => {
                                        return <List key={key} sx={MobileRegistrationListSpacingStyle10}>
                                                <ListItem sx={MobileRegistrationListItemSpacingStyle11}>
                                                <ListItemIcon>
                                                    {value.icon}
                                                </ListItemIcon>
                                                <ListItemText>
                                                    <Box sx={PasswordRequirements}>{value.text}</Box>
                                                </ListItemText>
                                            </ListItem>
                                        </List>
                                    })
                                }
                            </Box>
                            <Button variant="contained" type="submit" color="primary" disabled={loading} sx={MobileRegistrationButtonTextStyle12}>{loading ? <CircularProgress size={30} color="inherit"/> : "Sign In"}</Button>
                            <Typography variant="caption" sx={MobileRegistrationTypographyTextStyle13}>Already have an account? <Link to='/login'><span style={MobileRegistrationspanTextStyle14}>Sign in</span></Link></Typography>
                            <SocialMediaAuth/>
                        </Stack>     
                    </form>  
                </Box>
            </Grid>
        </Grid>
    )
}
