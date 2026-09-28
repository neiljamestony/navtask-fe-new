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
import { Check, Circle } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import type { IAuth } from "../../typescript/interface";
import { registration } from "../../api/auth/auth";
import { setAuthStatus } from "../../reducer/AuthSlice";
import SocialMediaAuth from "./SocialMediaAuth";
import ShowIcon from "../../assets/Icons/Show.svg";
import HideIcon from "../../assets/Icons/Hide.svg";

export default function DesktopRegistration() {
  const [formData, setFormData] = useState<IAuth>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ key: string; error: string }[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const passwordHasUsername =
    formData.password !== "" && formData.password.includes(formData.username);
  const hasMinLength = formData.password.length >= 8;
  const hasNumberOrSymbol = /^[A-Za-z0-9 !#()_-]+$/.test(formData.password);
  const isPasswordStrong =
    !passwordHasUsername && hasMinLength && hasNumberOrSymbol;

  const usernameError = errors.find((error) => error.key === "username");
  const passwordError = errors.find((error) => error.key === "password");

  const requirements = [
    {
      met: !passwordHasUsername,
      text: "Must not contain your username",
    },
    {
      met: hasMinLength,
      text: "At least 8 characters",
    },
    {
      met: hasNumberOrSymbol,
      text: "Use letters, numbers, or supported symbols",
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (data: IAuth) => {
    if (!isPasswordStrong) return;

    setLoading(true);

    try {
      const result = await registration(data);

      if (result?.status === 422) {
        setErrors(result.errors ?? []);
      } else if (result?.status === 200) {
        dispatch(setAuthStatus(result.msg));
        navigate("/login");
      } else if (result?.status === 500) {
        toast.error("Something went wrong. Please try again later.");
      } else {
        toast.error(result?.msg);
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
          maxWidth: 440,
          border: "1px solid",
          borderColor: "rgba(15, 23, 42, 0.08)",
          borderRadius: 4,
          boxShadow: "0 18px 55px rgba(15, 23, 42, 0.08)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 750, letterSpacing: -0.5 }}>
              Create account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              Sign up to get started.
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              void handleSubmit(formData);
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
                autoComplete="new-password"
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
                            <Box
                            component="img"
                            src={showPassword ? HideIcon : ShowIcon}
                            alt=""
                            sx={{ width: 20, height: 20, objectFit: "contain" }}
                            />
                        </IconButton>
                        </InputAdornment>
                    ),
                    },
                }}
            />

            {formData.username && formData.password && (
              <Box
                sx={{
                  mt: -0.5,
                  p: 1.5,
                  mb: 1,
                  borderRadius: 2,
                  bgcolor: "#f8fafc",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Password requirements
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: isPasswordStrong ? "success.main" : "text.secondary",
                    }}
                  >
                    {isPasswordStrong ? "Looks good" : "In progress"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                  {requirements.map((requirement) => (
                    <Box
                      key={requirement.text}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      {requirement.met ? (
                        <Check sx={{ fontSize: 16, color: "success.main" }} />
                      ) : (
                        <Circle sx={{ fontSize: 8, color: "text.disabled" }} />
                      )}
                      <Typography
                        variant="caption"
                        color={requirement.met ? "text.primary" : "text.secondary"}
                      >
                        {requirement.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            <Button
              variant="contained"
              type="submit"
              disabled={loading || !isPasswordStrong}
              fullWidth
              sx={{
                minHeight: 48,
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
                "Create account"
              )}
            </Button>
          </Box>

          <Typography
            variant="body2"
            sx={{ mt: 2.5, mb: 2, textAlign: "center", color: "text.secondary" }}
          >
            Already have an account?{" "}
            <Box
              component={Link}
              to="/login"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign in
            </Box>
          </Typography>

          <SocialMediaAuth />
        </CardContent>
      </Card>
    </Box>
  );
}