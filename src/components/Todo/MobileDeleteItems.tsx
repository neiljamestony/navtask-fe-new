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
        sx={{
            "& .MuiDialog-container": { alignItems: "flex-end" },
            "& .MuiDialog-paper": {
            width: "100%",
            maxWidth: 520,
            m: 1,
            mb: 5,
            borderRadius: 5,
            },
        }}
        >
        <Box sx={{ display: "flex", justifyContent: "flex-end", px: 1, pt: 1 }}>
            <IconButton onClick={close} disabled={loading} size="small" aria-label="Close">
            <X size={18} />
            </IconButton>
        </Box>

        <DialogContent sx={{ px: 2.5, pt: 0, pb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
                sx={{
                width: 44,
                height: 44,
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                borderRadius: 2,
                bgcolor: "error.50",
                color: "error.main",
                }}
            >
                <TriangleAlert size={22} />
            </Box>

            <Box>
                <Typography id="delete-tasks-title" variant="subtitle1" sx={{ fontWeight: 700 }}>
                Delete {itemLabel}?
                </Typography>
                <Typography id="delete-tasks-description" variant="body2" color="text.secondary">
                {count} {itemLabel} will be permanently deleted.
                </Typography>
            </Box>
            </Box>
        </DialogContent>

        <Box sx={{ display: "flex", gap: 1, px: 2, pb: "calc(12px + env(safe-area-inset-bottom))" }}>
            <Button
            variant="outlined"
            fullWidth
            onClick={close}
            disabled={loading}
            sx={{ minHeight: 40, borderRadius: 2, textTransform: "none" }}
            >
            Cancel
            </Button>

            <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={() => proceed(ids)}
            disabled={loading || count === 0}
            sx={{ minHeight: 40, borderRadius: 2, textTransform: "none", boxShadow: "none" }}
            >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Delete"}
            </Button>
        </Box>
        </Dialog>
  );
}