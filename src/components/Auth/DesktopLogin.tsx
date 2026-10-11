import {
  DesktopLoginBoxImageStyle1,
  DesktopLoginCardSurfaceStyle2,
  DesktopLoginCardContentSpacingStyle3,
  DesktopLoginBoxSpacingStyle4,
  DesktopLoginBoxSurfaceStyle5,
  DesktopLoginTypographyTextStyle6,
  DesktopLoginTypographyTextStyle7,
  DesktopLoginTypographySpacingStyle8,
  DesktopLoginBoxLayoutStyle9,
  DesktopLoginButtonSurfaceStyle10,
  DesktopLoginTypographyTextStyle11,
  DesktopLoginBoxTextStyle12
} from "../Styles/Auth/DesktopLogin/DesktopLogin.styles";
import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { login } from "../../api/auth/auth";
import type { IAuth } from "../../typescript/interface";
import type { RootState } from "../../store/store";
import { setAuthStatus, setAuthData } from "../../reducer/AuthSlice";
import SocialMediaAuth from "./SocialMediaAuth";
import { Eye, EyeOff } from "lucide-react";

export default function DesktopLogin() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<{ key: string; error: string }[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authStatus } = useSelector((state: RootState) => state.auth);

  const usernameError = errors.find((error) => error.key === "username");
  const passwordError = errors.find((error) => error.key === "password");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (data: IAuth) => {
    setLoading(true);

    try {
      const result = await login(data);

      if (result?.status === 200) {
        dispatch(setAuthData({ ...result.data }));
        dispatch(setAuthStatus(""));
        navigate("/");
      } else if (result?.status === 422) {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          toast.error(result.msg);
        }
      } else if (result?.status === 500 || result?.msg === "Network Error") {
        toast.error("Can't connect to the server. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={DesktopLoginBoxImageStyle1}
    >
      <Card
        elevation={0}
        sx={DesktopLoginCardSurfaceStyle2}
      >
        <CardContent sx={DesktopLoginCardContentSpacingStyle3}>
          <Box sx={DesktopLoginBoxSpacingStyle4}>
            {authStatus === "Success!" ? (
              <Box
                sx={DesktopLoginBoxSurfaceStyle5}
              >
                <Typography variant="body2" sx={DesktopLoginTypographyTextStyle6}>
                  Account created successfully. Sign in to continue.
                </Typography>
              </Box>
            ) : null}

            <Typography variant="h4" sx={DesktopLoginTypographyTextStyle7}>
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={DesktopLoginTypographySpacingStyle8}>
              Sign in to continue to your account.
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              handleSubmit(formData);
            }}
            sx={DesktopLoginBoxLayoutStyle9}
          >
            <TextField
                size="small"
                name="username"
                label="Username"
                value={formData.username}
                onChange={handleChange}
                error={Boolean(usernameError)}
                helperText={usernameError?.error ?? " "}
                autoComplete="username"
                fullWidth
            />

            <TextField
                size="small"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                error={Boolean(passwordError)}
                helperText={passwordError?.error ?? " "}
                autoComplete="current-password"
                fullWidth
                slotProps={{
                    input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={() => setShowPassword((prev) => !prev)}
                                edge="end"
                            >
                                { showPassword ? <EyeOff size={20}/> : <Eye size={20}/> }
                            </IconButton>
                        </InputAdornment>
                    ),
                    },
                }}
            />

            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              fullWidth
              sx={DesktopLoginButtonSurfaceStyle10}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Sign in"
              )}
            </Button>
          </Box>

          <Typography
            variant="body2"
            sx={DesktopLoginTypographyTextStyle11}
          >
            Don’t have an account?{" "}
            <Box
              component={Link}
              to="/register"
              sx={DesktopLoginBoxTextStyle12}
            >
              Sign up
            </Box>
          </Typography>
          <SocialMediaAuth />
        </CardContent>
      </Card>
    </Box>
  );
}