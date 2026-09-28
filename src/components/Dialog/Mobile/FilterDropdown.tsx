import { useEffect, useState } from "react";
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

type FilterOption = {
  value: string;
  label: string;
};

type Props = {
  open: boolean;
  proceed: (priority: string, status: string) => void;
  priorities: FilterOption[];
  status: FilterOption[];
  close: () => void;
  selectedStatus: string;
  selectedPriority: string;
};

export default function FilterDropdownDialog({
  open,
  proceed,
  priorities,
  status,
  close,
  selectedStatus,
  selectedPriority,
}: Props) {
  const [priorityValue, setPriorityValue] = useState(selectedPriority);
  const [statusValue, setStatusValue] = useState(selectedStatus);

  useEffect(() => {
    setPriorityValue(selectedPriority);
    setStatusValue(selectedStatus);
  }, [selectedPriority, selectedStatus, open]);

  const handleApply = () => {
    proceed(priorityValue, statusValue);
    close();
  };

  const handleClear = () => {
    setPriorityValue("");
    setStatusValue("");
  };

  const renderOptions = (
    title: string,
    name: string,
    options: FilterOption[],
    value: string,
    onChange: (value: string) => void
  ) => (
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
        {title}
      </FormLabel>

      <RadioGroup
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        sx={{ gap: 0.5 }}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.label}
            control={<Radio size="small" />}
            label={option.label}
            sx={{
              mx: 0,
              px: 1,
              minHeight: 40,
              borderRadius: 1.5,
              bgcolor: value === option.label ? "action.selected" : "transparent",
              "& .MuiFormControlLabel-label": { fontSize: 14 },
            }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={close}
      aria-labelledby="task-filter-title"
      sx={{
        "& .MuiDialog-container": { alignItems: "flex-end" },
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: 520,
          maxHeight: "78dvh",
          m: 1,
          mb: 0,
          borderRadius: "20px 20px 0 0",
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", px: 2, py: 1.5 }}>
        <Box sx={{ flex: 1 }}>
          <Typography id="task-filter-title" variant="subtitle1" sx={{ fontWeight: 700 }}>
            Filter tasks
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Choose a priority or status
          </Typography>
        </Box>

        <IconButton aria-label="Close filters" onClick={close} size="small">
          <X size={19} />
        </IconButton>
      </Box>

      <Divider />

      <DialogContent sx={{ p: 2, overflowY: "auto" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {renderOptions(
            "Priority",
            "filter-priority",
            priorities,
            priorityValue,
            setPriorityValue
          )}

          <Divider />

          {renderOptions(
            "Status",
            "filter-status",
            status,
            statusValue,
            setStatusValue
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          pt: 1.5,
          borderTop: "1px solid",
          borderColor: "divider",
          gap: 1,
        }}
      >
        <Button
          variant="outlined"
          onClick={handleClear}
          sx={{ minHeight: 42, borderRadius: 2, textTransform: "none" }}
        >
          Clear
        </Button>

        <Button
          variant="contained"
          fullWidth
          onClick={handleApply}
          sx={{ minHeight: 42, borderRadius: 2, textTransform: "none", fontWeight: 700 }}
        >
          Apply filters
        </Button>
      </DialogActions>
    </Dialog>
  );
}