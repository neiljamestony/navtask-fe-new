import { Box, Typography, Button } from "@mui/material";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TaskNotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: { xs: "55vh", sm: "60vh" },
        display: "grid",
        placeItems: "center",
        px: { xs: 1.5, sm: 2 },
        py: { xs: 2, sm: 3 },
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          boxSizing: "border-box",
          p: { xs: 2.5, sm: 4 },
          textAlign: "center",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: { xs: 2.5, sm: 3 },
        }}
      >
        <Box
          sx={{
            width: { xs: 56, sm: 64 },
            height: { xs: 56, sm: 64 },
            mx: "auto",
            mb: { xs: 1.5, sm: 2 },
            display: "grid",
            placeItems: "center",
            borderRadius: 2,
            bgcolor: "grey.100",
            color: "text.secondary",
          }}
        >
          <FileQuestion size={26} />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Task not found
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.75, mb: 2.5, overflowWrap: "anywhere" }}
        >
          This task may have been deleted, or the URL may contain an invalid task ID.
        </Typography>

        <Button
          variant="contained"
          fullWidth
          startIcon={<ArrowLeft size={17} />}
          onClick={() => navigate("/")}
          sx={{
            minHeight: 44,
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Back to dashboard
        </Button>
      </Box>
    </Box>
  );
}