import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/auth/auth";

export default function DesktopSignOut({
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
      open={open}
      onClose={loading ? undefined : handleCancel}
      aria-labelledby="signout-title"
      aria-describedby="signout-description"
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle id="signout-title" sx={{ pb: 1 }}>
        Sign out?
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: 2,
              bgcolor: "grey.100",
              color: "text.secondary",
            }}
          >
            <LogOut size={20} />
          </Box>

          <Box>
            <Typography id="signout-description" variant="body2">
              Are you sure you want to sign out?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Any unsaved changes will be lost.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
        <Button
          type="button"
          variant="outlined"
          onClick={handleCancel}
          disabled={loading}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Cancel
        </Button>

        <Button
          type="button"
          variant="contained"
          color="error"
          onClick={handleSignOut}
          disabled={loading}
          sx={{ textTransform: "none", borderRadius: 2, minWidth: 100 }}
        >
          {loading ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            "Sign out"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}