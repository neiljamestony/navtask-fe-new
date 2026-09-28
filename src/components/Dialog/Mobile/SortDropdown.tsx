import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { X } from "lucide-react";

type SortOption = {
  value: string;
  name: string;
};

type Props = {
  open: boolean;
  proceed: (field: string, order: string) => void;
  close: () => void;
  items: SortOption[];
};

export default function SortDropdownDialog({
  open,
  proceed,
  items,
  close,
}: Props) {
  const [fieldValue, setFieldValue] = useState("none");
  const [sortValue, setSortValue] = useState("");

  const sortDirections = [
    { value: "asc", name: "Ascending" },
    { value: "desc", name: "Descending" },
  ];

  const handleClose = () => {
    close();
    setFieldValue("none");
    setSortValue("");
  };

  const handleApply = () => {
    proceed(fieldValue, fieldValue === "none" ? "" : sortValue);
    close();
  };

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={handleClose}
      aria-labelledby="sort-dialog-title"
      sx={{
        "& .MuiDialog-container": { alignItems: "flex-end" },
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: 520,
          maxHeight: "75dvh",
          m: 1,
          mb: 0,
          borderRadius: "20px 20px 0 0",
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", px: 2, py: 1.5 }}>
        <Box sx={{ flex: 1 }}>
          <Typography id="sort-dialog-title" variant="subtitle1" sx={{ fontWeight: 700 }}>
            Sort tasks
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Choose a field and sort order
          </Typography>
        </Box>

        <IconButton aria-label="Close sort options" onClick={handleClose} size="small">
          <X size={19} />
        </IconButton>
      </Box>

      <Divider />

      <DialogContent sx={{ p: 2 }}>
        <FormControl fullWidth>
          <FormLabel
            sx={{
              mb: 1,
              color: "text.primary",
              fontSize: 14,
              fontWeight: 700,
              "&.Mui-focused": { color: "text.primary" },
            }}
          >
            Sort by
          </FormLabel>

          <RadioGroup
            value={fieldValue}
            onChange={(event) => {
              setFieldValue(event.target.value);
              if (event.target.value === "none") setSortValue("");
            }}
            sx={{ gap: 0.5 }}
          >
            {items.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio size="small" />}
                label={option.name}
                sx={{
                  mx: 0,
                  minHeight: 40,
                  px: 1,
                  borderRadius: 1.5,
                  bgcolor: fieldValue === option.value ? "action.selected" : "transparent",
                  "& .MuiFormControlLabel-label": { fontSize: 14 },
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        <FormControl fullWidth disabled={fieldValue === "none"}>
          <FormLabel
            sx={{
              mb: 1,
              color: "text.primary",
              fontSize: 14,
              fontWeight: 700,
              "&.Mui-focused": { color: "text.primary" },
            }}
          >
            Order
          </FormLabel>

          <RadioGroup
            value={sortValue}
            onChange={(event) => setSortValue(event.target.value)}
            sx={{ gap: 0.5 }}
          >
            {sortDirections.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio size="small" />}
                label={option.name}
                sx={{
                  mx: 0,
                  minHeight: 40,
                  px: 1,
                  borderRadius: 1.5,
                  bgcolor: sortValue === option.value ? "action.selected" : "transparent",
                  "& .MuiFormControlLabel-label": { fontSize: 14 },
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          pt: 1.5,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button
          variant="contained"
          fullWidth
          onClick={handleApply}
          sx={{
            minHeight: 44,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Apply sort
        </Button>
      </DialogActions>
    </Dialog>
  );
}