import { Box, CircularProgress, Typography } from '@mui/material'

export default function FetchingTask() {
  return (
    <Box
        role="status"
        aria-live="polite"
        sx={{
            width: "97%",
            mx: "auto",
            minHeight: 220,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            p: { xs: 2, sm: 3 },
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            bgcolor: "background.paper",
        }}
        >
        <CircularProgress size={28} />
        <Box sx={{ textAlign: "center" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Loading your tasks</Typography>
            <Typography variant="body2" color="text.secondary">
            This should only take a moment.
            </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 0.75, mt: 0.5 }}>
            {[0, 1, 2].map((dot) => (
            <Box
                key={dot}
                sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: "primary.main",
                animation: "loadingDot 1s ease-in-out infinite",
                animationDelay: `${dot * 150}ms`,
                "@keyframes loadingDot": {
                    "0%, 60%, 100%": { opacity: 0.3, transform: "scale(0.8)" },
                    "30%": { opacity: 1, transform: "scale(1)" },
                },
                }}
            />
            ))}
        </Box>
    </Box>
  )
}
