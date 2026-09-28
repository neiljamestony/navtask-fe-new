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
      sx={{
        minHeight: "100dvh",
        boxSizing: "border-box",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 2,
        bgcolor: "#f4f7fb",
        backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(25,118,210,0.10), transparent 30%), radial-gradient(circle at 85% 85%, rgba(25,118,210,0.08), transparent 32%)",
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          border: "1px solid",
          borderColor: "rgba(15, 23, 42, 0.08)",
          borderRadius: 4,
          boxShadow: "0 18px 55px rgba(15, 23, 42, 0.08)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ mb: 3 }}>
            {authStatus === "Success!" ? (
              <Box
                sx={{
                  mb: 2.5,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "success.50",
                  color: "success.dark",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Account created successfully. Sign in to continue.
                </Typography>
              </Box>
            ) : null}

            <Typography variant="h4" sx={{ fontWeight: 750, letterSpacing: -0.5 }}>
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              Sign in to continue to your account.
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              handleSubmit(formData);
            }}
            sx={{ display: "flex", flexDirection: "column" }}
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
              sx={{
                minHeight: 48,
                mt: 0.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                fontSize: 15,
                boxShadow: "none",
              }}
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
            sx={{ mt: 2.5, textAlign: "center", color: "text.secondary" }}
          >
            Don’t have an account?{" "}
            <Box
              component={Link}
              to="/register"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
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