import {
  FilterDropdownFormLabelTextStyle1,
  FilterDropdownRadioGroupLayoutStyle2,
  FilterDropdownFormControlLabelSurfaceStyle3,
  FilterDropdownDialogDialogStyle4,
  FilterDropdownBoxLayoutStyle5,
  FilterDropdownBoxLayoutStyle6,
  FilterDropdownTypographyTextStyle7,
  FilterDropdownDialogContentSpacingStyle8,
  FilterDropdownBoxLayoutStyle9,
  FilterDropdownDialogActionsSurfaceStyle10,
  FilterDropdownButtonSurfaceStyle11,
  FilterDropdownButtonSurfaceStyle12
} from "../../Styles/Dialog/Mobile/FilterDropdown/FilterDropdown.styles";
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
        sx={FilterDropdownFormLabelTextStyle1}
      >
        {title}
      </FormLabel>

      <RadioGroup
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        sx={FilterDropdownRadioGroupLayoutStyle2}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.label}
            control={<Radio size="small" />}
            label={option.label}
            sx={FilterDropdownFormControlLabelSurfaceStyle3({ value: value, option: option })}
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
      sx={FilterDropdownDialogDialogStyle4}
    >
      <Box sx={FilterDropdownBoxLayoutStyle5}>
        <Box sx={FilterDropdownBoxLayoutStyle6}>
          <Typography id="task-filter-title" variant="subtitle1" sx={FilterDropdownTypographyTextStyle7}>
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

      <DialogContent sx={FilterDropdownDialogContentSpacingStyle8}>
        <Box sx={FilterDropdownBoxLayoutStyle9}>
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
        sx={FilterDropdownDialogActionsSurfaceStyle10}
      >
        <Button
          variant="outlined"
          onClick={handleClear}
          sx={FilterDropdownButtonSurfaceStyle11}
        >
          Clear
        </Button>

        <Button
          variant="contained"
          fullWidth
          onClick={handleApply}
          sx={FilterDropdownButtonSurfaceStyle12}
        >
          Apply filters
        </Button>
      </DialogActions>
    </Dialog>
  );
}