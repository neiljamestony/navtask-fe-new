import {
  MobileDeleteItemsDialogDialogStyle1,
  MobileDeleteItemsBoxLayoutStyle2,
  MobileDeleteItemsDialogContentSpacingStyle3,
  MobileDeleteItemsBoxLayoutStyle4,
  MobileDeleteItemsBoxSurfaceStyle5,
  MobileDeleteItemsTypographyTextStyle6,
  MobileDeleteItemsBoxLayoutStyle7,
  MobileDeleteItemsButtonSurfaceStyle8,
  MobileDeleteItemsButtonSurfaceStyle9
} from "../Styles/Todo/MobileDeleteItems/MobileDeleteItems.styles";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { TriangleAlert, X } from "lucide-react";

type Props = {
  proceed: (ids: string[]) => void;
  open: boolean;
  close: () => void;
  ids: string[];
  loading: boolean;
};

export default function MobileDeleteItems({
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
        fullWidth
        maxWidth={false}
        open={open}
        onClose={loading ? undefined : close}
        sx={MobileDeleteItemsDialogDialogStyle1}
        >
        <Box sx={MobileDeleteItemsBoxLayoutStyle2}>
            <IconButton onClick={close} disabled={loading} size="small" aria-label="Close">
            <X size={18} />
            </IconButton>
        </Box>

        <DialogContent sx={MobileDeleteItemsDialogContentSpacingStyle3}>
            <Box sx={MobileDeleteItemsBoxLayoutStyle4}>
            <Box
                sx={MobileDeleteItemsBoxSurfaceStyle5}
            >
                <TriangleAlert size={22} />
            </Box>

            <Box>
                <Typography id="delete-tasks-title" variant="subtitle1" sx={MobileDeleteItemsTypographyTextStyle6}>
                Delete {itemLabel}?
                </Typography>
                <Typography id="delete-tasks-description" variant="body2" color="text.secondary">
                {count} {itemLabel} will be permanently deleted.
                </Typography>
            </Box>
            </Box>
        </DialogContent>

        <Box sx={MobileDeleteItemsBoxLayoutStyle7}>
            <Button
            variant="outlined"
            fullWidth
            onClick={close}
            disabled={loading}
            sx={MobileDeleteItemsButtonSurfaceStyle8}
            >
            Cancel
            </Button>

            <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={() => proceed(ids)}
            disabled={loading || count === 0}
            sx={MobileDeleteItemsButtonSurfaceStyle9}
            >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Delete"}
            </Button>
        </Box>
        </Dialog>
  );
}