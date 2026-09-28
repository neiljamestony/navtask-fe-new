import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Divider, Typography } from "@mui/material";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { setAuthData } from "../../reducer/AuthSlice";
import { isAuthenticated } from "../../api/auth/auth";
import FacebookIcon from "../../assets/Icons/Facebook.svg";
import GoogleIcon from "../../assets/Icons/Google.svg";

const env = import.meta.env.VITE_NODE_ENV;
const apiUrl =
  env === "local"
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_PROD_API_URL;

export default function SocialMediaAuth() {
  const [loadingProvider, setLoadingProvider] = useState<"google" | "facebook" | null>(
    null
  );

  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const status = searchParams.get("status");

  const startLogin = (provider: "google" | "facebook") => {
    setLoadingProvider(provider);
    window.location.href = `${apiUrl}/auth/${provider}?state=${encodeURIComponent(pathname)}`;
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (status === "DATA_EXISTS") {
        toast.error("Email already exists. Please sign in to your account.", {
          id: "email-exists-error",
        });
        return;
      }

      if (status === "ACCOUNT_NOT_FOUND") {
        toast.error("Account not found. Please register first.", {
          id: "email-not-found-error",
        });
        return;
      }

      if (status !== "SUCCESS") return;

      const request = await isAuthenticated();

      if (request?.status === 200) {
        dispatch(setAuthData(request.data));
        navigate("/");
      } else if (request?.status === 401) {
        const message =
          request.msg === "TOKEN_EXPIRED"
            ? "Session expired. Redirecting to sign in."
            : "Unauthorized. Redirecting to sign in.";

        toast.error(message, {
          id:
            request.msg === "TOKEN_EXPIRED"
              ? "session-expired-error"
              : "unauthorized-expired-error",
        });
      } else if (!request?.status) {
        toast.error("Unauthorized. Redirecting to sign in.", {
          id: "unauthorized-expired-error",
        });
      }
    };

    void checkAuth();
  }, [status, dispatch, navigate]);

  const providers = [
    { name: "google" as const, label: "Google", icon: GoogleIcon },
    { name: "facebook" as const, label: "Facebook", icon: FacebookIcon },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
      <Divider sx={{ mb: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1,
            color: "text.secondary",
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        >
          OR CONTINUE WITH
        </Typography>
      </Divider>

      {providers.map((provider) => {
        const isLoading = loadingProvider === provider.name;

        return (
          <Button
            key={provider.name}
            type="button"
            variant="outlined"
            color="inherit"
            fullWidth
            disabled={loadingProvider !== null}
            onClick={() => startLogin(provider.name)}
            startIcon={
              isLoading ? (
                <CircularProgress size={17} color="inherit" />
              ) : (
                <Box
                  component="img"
                  src={provider.icon}
                  alt=""
                  sx={{ width: 18, height: 18, objectFit: "contain" }}
                />
              )
            }
            sx={{
              minHeight: 46,
              borderColor: "divider",
              borderRadius: 2,
              color: "text.primary",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                borderColor: "text.secondary",
                bgcolor: "action.hover",
              },
            }}
          >
            {isLoading ? `Connecting to ${provider.label}…` : `Continue with ${provider.label}`}
          </Button>
        );
      })}
    </Box>
  );
}