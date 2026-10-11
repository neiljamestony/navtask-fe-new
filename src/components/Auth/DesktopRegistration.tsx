import {
  DesktopRegistrationBoxImageStyle1,
  DesktopRegistrationCardSurfaceStyle2,
  DesktopRegistrationCardContentSpacingStyle3,
  DesktopRegistrationBoxSpacingStyle4,
  DesktopRegistrationTypographyTextStyle5,
  DesktopRegistrationTypographySpacingStyle6,
  DesktopRegistrationBoxLayoutStyle7,
  DesktopRegistrationBoxSizeStyle8,
  DesktopRegistrationBoxSurfaceStyle9,
  DesktopRegistrationBoxLayoutStyle10,
  DesktopRegistrationTypographyTextStyle11,
  DesktopRegistrationTypographyTextStyle12,
  DesktopRegistrationBoxLayoutStyle13,
  DesktopRegistrationBoxLayoutStyle14,
  DesktopRegistrationCheckTextStyle15,
  DesktopRegistrationCircleTextStyle16,
  DesktopRegistrationButtonSurfaceStyle17,
  DesktopRegistrationTypographyTextStyle18,
  DesktopRegistrationBoxTextStyle19
} from "../Styles/Auth/DesktopRegistration/DesktopRegistration.styles";
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
      sx={DesktopRegistrationBoxImageStyle1}
    >
      <Card
        elevation={0}
        sx={DesktopRegistrationCardSurfaceStyle2}
      >
        <CardContent sx={DesktopRegistrationCardContentSpacingStyle3}>
          <Box sx={DesktopRegistrationBoxSpacingStyle4}>
            <Typography variant="h4" sx={DesktopRegistrationTypographyTextStyle5}>
              Create account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={DesktopRegistrationTypographySpacingStyle6}>
              Sign up to get started.
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              void handleSubmit(formData);
            }}
            sx={DesktopRegistrationBoxLayoutStyle7}
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
                            sx={DesktopRegistrationBoxSizeStyle8}
                            />
                        </IconButton>
                        </InputAdornment>
                    ),
                    },
                }}
            />

            {formData.username && formData.password && (
              <Box
                sx={DesktopRegistrationBoxSurfaceStyle9}
              >
                <Box
                  sx={DesktopRegistrationBoxLayoutStyle10}
                >
                  <Typography variant="body2" sx={DesktopRegistrationTypographyTextStyle11}>
                    Password requirements
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={DesktopRegistrationTypographyTextStyle12({ isPasswordStrong: isPasswordStrong })}
                  >
                    {isPasswordStrong ? "Looks good" : "In progress"}
                  </Typography>
                </Box>

                <Box sx={DesktopRegistrationBoxLayoutStyle13}>
                  {requirements.map((requirement) => (
                    <Box
                      key={requirement.text}
                      sx={DesktopRegistrationBoxLayoutStyle14}
                    >
                      {requirement.met ? (
                        <Check sx={DesktopRegistrationCheckTextStyle15} />
                      ) : (
                        <Circle sx={DesktopRegistrationCircleTextStyle16} />
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
              sx={DesktopRegistrationButtonSurfaceStyle17}
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
            sx={DesktopRegistrationTypographyTextStyle18}
          >
            Already have an account?{" "}
            <Box
              component={Link}
              to="/login"
              sx={DesktopRegistrationBoxTextStyle19}
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