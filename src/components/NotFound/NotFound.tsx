import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', textAlign: 'center', height: "100vh" }}>
      <Stack spacing={3}>
        <Box sx={{ fontFamily: "Roboto", fontWeight: 'bold', fontSize: 200 }}>404</Box>
        <Box>Page Not Found</Box>
        <Button type="button" variant="contained" color="primary" onClick={() => navigate("/")}>Return to home</Button>
      </Stack>
    </Box>
  );
};

export default NotFound;