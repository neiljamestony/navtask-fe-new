import {
  MobileSignOutDialogDialogStyle1,
  MobileSignOutBoxLayoutStyle2,
  MobileSignOutDialogContentSpacingStyle3,
  MobileSignOutBoxLayoutStyle4,
  MobileSignOutBoxSurfaceStyle5,
  MobileSignOutTypographyTextStyle6,
  MobileSignOutBoxLayoutStyle7,
  MobileSignOutButtonSurfaceStyle8,
  MobileSignOutButtonSurfaceStyle9
} from "../Styles/Auth/MobileSignOut/MobileSignOut.styles";
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
      sx={MobileSignOutDialogDialogStyle1}
    >
      <Box sx={MobileSignOutBoxLayoutStyle2}>
        <IconButton
          aria-label="Close"
          onClick={handleCancel}
          disabled={loading}
          size="small"
        >
          <X size={19} />
        </IconButton>
      </Box>

      <DialogContent sx={MobileSignOutDialogContentSpacingStyle3}>
        <Box sx={MobileSignOutBoxLayoutStyle4}>
          <Box
            sx={MobileSignOutBoxSurfaceStyle5}
          >
            <LogOut size={21} />
          </Box>

          <Box>
            <Typography id="signout-title" variant="subtitle1" sx={MobileSignOutTypographyTextStyle6}>
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
        sx={MobileSignOutBoxLayoutStyle7}
      >
        <Button
          variant="outlined"
          fullWidth
          onClick={handleCancel}
          disabled={loading}
          sx={MobileSignOutButtonSurfaceStyle8}
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
          sx={MobileSignOutButtonSurfaceStyle9}
        >
          {loading ? "Signing out…" : "Sign out"}
        </Button>
      </Box>
    </Dialog>
  );
}