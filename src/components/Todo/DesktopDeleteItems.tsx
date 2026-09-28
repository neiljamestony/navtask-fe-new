import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
  Stack
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
      sx={{
        "& .MuiDialog-paper": {
          width: 400,
          maxWidth: "calc(100% - 32px)",
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.18)",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", px: 1.5, pt: 1.5 }}>
        <IconButton
          onClick={close}
          disabled={loading}
          aria-label="Close dialog"
          size="small"
        >
          <X size={20} />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 4, pt: 0, pb: 3 }}>
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            textAlign: "center",
        }}>
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 64,
              height: 64,
              borderRadius: "50%",
              color: "error.main",
              bgcolor: "error.50",
            }}
          >
            <TriangleAlert size={30} />
          </Box>

          <Box>
            <Typography
              id="delete-dialog-title"
              variant="h6"
              sx={{ mb: 0.75, fontWeight: 700 }}
            >
              Delete {itemLabel}?
            </Typography>

            <Typography
              id="delete-dialog-description"
              variant="body2"
              color="text.secondary"
            >
              You’re about to delete{" "}
              <Box component="span" sx={{ color: "text.primary", fontWeight: 700 }}>
                {count} {itemLabel}
              </Box>
              . This action can’t be undone.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 0, gap: 1.5 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={close}
          disabled={loading}
          sx={{ textTransform: "none", borderRadius: 2, py: 1 }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={() => proceed(ids)}
          disabled={loading || count === 0}
          sx={{ textTransform: "none", borderRadius: 2, py: 1 }}
        >
          {loading ? <CircularProgress color="inherit" size={22} /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}