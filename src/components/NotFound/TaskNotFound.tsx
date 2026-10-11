import {
  TaskNotFoundBoxSizeStyle1,
  TaskNotFoundBoxSurfaceStyle2,
  TaskNotFoundBoxSurfaceStyle3,
  TaskNotFoundTypographyTextStyle4,
  TaskNotFoundTypographySpacingStyle5,
  TaskNotFoundButtonSurfaceStyle6
} from "../Styles/NotFound/TaskNotFound/TaskNotFound.styles";
import { Box, Typography, Button } from "@mui/material";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TaskNotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={TaskNotFoundBoxSizeStyle1}
    >
      <Box
        sx={TaskNotFoundBoxSurfaceStyle2}
      >
        <Box
          sx={TaskNotFoundBoxSurfaceStyle3}
        >
          <FileQuestion size={26} />
        </Box>

        <Typography variant="h6" sx={TaskNotFoundTypographyTextStyle4}>
          Task not found
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={TaskNotFoundTypographySpacingStyle5}
        >
          This task may have been deleted, or the URL may contain an invalid task ID.
        </Typography>

        <Button
          variant="contained"
          fullWidth
          startIcon={<ArrowLeft size={17} />}
          onClick={() => navigate("/")}
          sx={TaskNotFoundButtonSurfaceStyle6}
        >
          Back to dashboard
        </Button>
      </Box>
    </Box>
  );
}