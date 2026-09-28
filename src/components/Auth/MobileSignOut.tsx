import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/auth/auth";

export default function MobileSignOut({
  open,
  handleCancel,
}: {
  open: boolean;
  handleCancel: () => void;
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);

    try {
      const result = await logout();
      if (result?.status === 200) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={loading ? undefined : handleCancel}
      aria-labelledby="signout-title"
      aria-describedby="signout-description"
      sx={{
        "& .MuiDialog-container": { alignItems: "flex-end" },
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: 520,
          m: 1,
          mb: 5,
          borderRadius: 5,
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", px: 1, pt: 1 }}>
        <IconButton
          aria-label="Close"
          onClick={handleCancel}
          disabled={loading}
          size="small"
        >
          <X size={19} />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 2.5, pt: 0.5, pb: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: 2,
              bgcolor: "grey.100",
              color: "text.secondary",
            }}
          >
            <LogOut size={21} />
          </Box>

          <Box>
            <Typography id="signout-title" variant="subtitle1" sx={{ fontWeight: 700 }}>
              Sign out?
            </Typography>
            <Typography
              id="signout-description"
              variant="body2"
              color="text.secondary"
            >
              Any unsaved changes will be lost.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <Box
        sx={{
          display: "flex",
          gap: 1.25,
          px: 2,
          pb: "calc(12px + env(safe-area-inset-bottom))",
        }}
      >
        <Button
          variant="outlined"
          fullWidth
          onClick={handleCancel}
          disabled={loading}
          sx={{ minHeight: 42, borderRadius: 2, textTransform: "none" }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleSignOut}
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={18} color="inherit" /> : <LogOut size={17} />
          }
          sx={{
            minHeight: 42,
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "none",
          }}
        >
          {loading ? "Signing out…" : "Sign out"}
        </Button>
      </Box>
    </Dialog>
  );
}