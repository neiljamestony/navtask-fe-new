import {
  DesktopSignOutDialogDialogStyle1,
  DesktopSignOutDialogTitleSpacingStyle2,
  DesktopSignOutBoxLayoutStyle3,
  DesktopSignOutBoxSurfaceStyle4,
  DesktopSignOutTypographySpacingStyle5,
  DesktopSignOutDialogActionsLayoutStyle6,
  DesktopSignOutButtonSurfaceStyle7,
  DesktopSignOutButtonSurfaceStyle8
} from "../Styles/Auth/DesktopSignOut/DesktopSignOut.styles";
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
      sx={DesktopSignOutDialogDialogStyle1}
    >
      <DialogTitle id="signout-title" sx={DesktopSignOutDialogTitleSpacingStyle2}>
        Sign out?
      </DialogTitle>

      <DialogContent>
        <Box sx={DesktopSignOutBoxLayoutStyle3}>
          <Box
            sx={DesktopSignOutBoxSurfaceStyle4}
          >
            <LogOut size={20} />
          </Box>

          <Box>
            <Typography id="signout-description" variant="body2">
              Are you sure you want to sign out?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={DesktopSignOutTypographySpacingStyle5}>
              Any unsaved changes will be lost.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={DesktopSignOutDialogActionsLayoutStyle6}>
        <Button
          type="button"
          variant="outlined"
          onClick={handleCancel}
          disabled={loading}
          sx={DesktopSignOutButtonSurfaceStyle7}
        >
          Cancel
        </Button>

        <Button
          type="button"
          variant="contained"
          color="error"
          onClick={handleSignOut}
          disabled={loading}
          sx={DesktopSignOutButtonSurfaceStyle8}
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