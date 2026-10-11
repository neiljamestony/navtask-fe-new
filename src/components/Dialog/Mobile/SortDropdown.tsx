import {
  SortDropdownDialogDialogStyle1,
  SortDropdownBoxLayoutStyle2,
  SortDropdownBoxLayoutStyle3,
  SortDropdownTypographyTextStyle4,
  SortDropdownDialogContentSpacingStyle5,
  SortDropdownFormLabelTextStyle6,
  SortDropdownRadioGroupLayoutStyle7,
  SortDropdownFormControlLabelSurfaceStyle8,
  SortDropdownDividerSpacingStyle9,
  SortDropdownFormLabelTextStyle10,
  SortDropdownRadioGroupLayoutStyle11,
  SortDropdownFormControlLabelSurfaceStyle12,
  SortDropdownDialogActionsSurfaceStyle13,
  SortDropdownButtonSurfaceStyle14
} from "../../Styles/Dialog/Mobile/SortDropdown/SortDropdown.styles";
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
      sx={SortDropdownDialogDialogStyle1}
    >
      <Box sx={SortDropdownBoxLayoutStyle2}>
        <Box sx={SortDropdownBoxLayoutStyle3}>
          <Typography id="sort-dialog-title" variant="subtitle1" sx={SortDropdownTypographyTextStyle4}>
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

      <DialogContent sx={SortDropdownDialogContentSpacingStyle5}>
        <FormControl fullWidth>
          <FormLabel
            sx={SortDropdownFormLabelTextStyle6}
          >
            Sort by
          </FormLabel>

          <RadioGroup
            value={fieldValue}
            onChange={(event) => {
              setFieldValue(event.target.value);
              if (event.target.value === "none") setSortValue("");
            }}
            sx={SortDropdownRadioGroupLayoutStyle7}
          >
            {items.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio size="small" />}
                label={option.name}
                sx={SortDropdownFormControlLabelSurfaceStyle8({ fieldValue: fieldValue, option: option })}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Divider sx={SortDropdownDividerSpacingStyle9} />

        <FormControl fullWidth disabled={fieldValue === "none"}>
          <FormLabel
            sx={SortDropdownFormLabelTextStyle10}
          >
            Order
          </FormLabel>

          <RadioGroup
            value={sortValue}
            onChange={(event) => setSortValue(event.target.value)}
            sx={SortDropdownRadioGroupLayoutStyle11}
          >
            {sortDirections.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio size="small" />}
                label={option.name}
                sx={SortDropdownFormControlLabelSurfaceStyle12({ sortValue: sortValue, option: option })}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </DialogContent>

      <DialogActions
        sx={SortDropdownDialogActionsSurfaceStyle13}
      >
        <Button
          variant="contained"
          fullWidth
          onClick={handleApply}
          sx={SortDropdownButtonSurfaceStyle14}
        >
          Apply sort
        </Button>
      </DialogActions>
    </Dialog>
  );
}