import {
  DesktopDeleteItemsDialogDialogStyle1,
  DesktopDeleteItemsBoxLayoutStyle2,
  DesktopDeleteItemsDialogContentSpacingStyle3,
  DesktopDeleteItemsBoxTextStyle4,
  DesktopDeleteItemsBoxSurfaceStyle5,
  DesktopDeleteItemsTypographyTextStyle6,
  DesktopDeleteItemsBoxTextStyle7,
  DesktopDeleteItemsDialogActionsLayoutStyle8,
  DesktopDeleteItemsButtonSurfaceStyle9,
  DesktopDeleteItemsButtonSurfaceStyle10
} from "../Styles/Todo/DesktopDeleteItems/DesktopDeleteItems.styles";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography
} from "@mui/material";
import { TriangleAlert, X } from "lucide-react";

type Props = {
  proceed: (ids: string[]) => void;
  open: boolean;
  close: () => void;
  ids: string[];
  loading: boolean;
};

export default function DesktopDeleteItems({
  proceed,
  open,
  close,
  ids,
  loading,
}: Props) {
  const count = ids.length;
  const itemLabel = count === 1 ? "task" : "tasks";

  return (
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      maxWidth={false}
      sx={DesktopDeleteItemsDialogDialogStyle1}
    >
      <Box sx={DesktopDeleteItemsBoxLayoutStyle2}>
        <IconButton
          onClick={close}
          disabled={loading}
          aria-label="Close dialog"
          size="small"
        >
          <X size={20} />
        </IconButton>
      </Box>

      <DialogContent sx={DesktopDeleteItemsDialogContentSpacingStyle3}>
        <Box sx={DesktopDeleteItemsBoxTextStyle4}>
          <Box
            sx={DesktopDeleteItemsBoxSurfaceStyle5}
          >
            <TriangleAlert size={30} />
          </Box>

          <Box>
            <Typography
              id="delete-dialog-title"
              variant="h6"
              sx={DesktopDeleteItemsTypographyTextStyle6}
            >
              Delete {itemLabel}?
            </Typography>

            <Typography
              id="delete-dialog-description"
              variant="body2"
              color="text.secondary"
            >
              You’re about to delete{" "}
              <Box component="span" sx={DesktopDeleteItemsBoxTextStyle7}>
                {count} {itemLabel}
              </Box>
              . This action can’t be undone.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={DesktopDeleteItemsDialogActionsLayoutStyle8}>
        <Button
          variant="outlined"
          fullWidth
          onClick={close}
          disabled={loading}
          sx={DesktopDeleteItemsButtonSurfaceStyle9}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={() => proceed(ids)}
          disabled={loading || count === 0}
          sx={DesktopDeleteItemsButtonSurfaceStyle10}
        >
          {loading ? <CircularProgress color="inherit" size={22} /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}