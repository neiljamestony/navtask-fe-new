import {
  NotFoundBoxTextStyle1,
  NotFoundBoxTextStyle2
} from "../Styles/NotFound/NotFound/NotFound.styles";
import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box sx={NotFoundBoxTextStyle1}>
      <Stack spacing={3}>
        <Box sx={NotFoundBoxTextStyle2}>404</Box>
        <Box>Page Not Found</Box>
        <Button type="button" variant="contained" color="primary" onClick={() => navigate("/")}>Return to home</Button>
      </Stack>
    </Box>
  );
};

export default NotFound;