import {
  FetchingTaskBoxSurfaceStyle1,
  FetchingTaskBoxTextStyle2,
  FetchingTaskTypographyTextStyle3,
  FetchingTaskBoxLayoutStyle4,
  FetchingTaskBoxSurfaceStyle5
} from "../Styles/NotFound/FetchingTask/FetchingTask.styles";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function FetchingTask() {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={FetchingTaskBoxSurfaceStyle1}
    >
      <CircularProgress size={26} />

      <Box sx={FetchingTaskBoxTextStyle2}>
        <Typography variant="subtitle2" sx={FetchingTaskTypographyTextStyle3}>
          Loading your tasks
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This should only take a moment.
        </Typography>
      </Box>

      <Box sx={FetchingTaskBoxLayoutStyle4}>
        {[0, 1, 2].map((dot) => (
          <Box
            key={dot}
            sx={FetchingTaskBoxSurfaceStyle5({ dot: dot })}
          />
        ))}
      </Box>
    </Box>
  );
}