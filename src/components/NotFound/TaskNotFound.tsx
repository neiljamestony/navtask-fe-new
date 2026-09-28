import { Box, Typography, Button } from '@mui/material'
import { ArrowLeft, FileQuestion } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function TaskNotFound() {
    const navigate = useNavigate();
  return (
    <Box
        sx={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        }}
    >
        <Box
        sx={{
            width: "100%",
            maxWidth: 420,
            p: { xs: 3, sm: 4 },
            textAlign: "center",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
        }}
        >
        <Box
            sx={{
            width: 64,
            height: 64,
            mx: "auto",
            mb: 2,
            display: "grid",
            placeItems: "center",
            borderRadius: 2,
            bgcolor: "grey.100",
            color: "text.secondary",
            }}
        >
            <FileQuestion size={30} />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Task not found
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, mb: 2.5 }}>
            This task may have been deleted, or the URL may contain an invalid task ID.
        </Typography>

        <Button
            variant="contained"
            startIcon={<ArrowLeft size={17} />}
            onClick={() => navigate("/")}
            sx={{ textTransform: "none", borderRadius: 2 }}
        >
            Back to dashboard
        </Button>
        </Box>
    </Box>
  )
}
