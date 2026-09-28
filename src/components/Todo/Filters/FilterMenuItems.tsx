import { useState } from "react";
import {
  Box,
  Collapse,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { CircleCheckBig, ChevronDown, ChevronUp, Flag } from "lucide-react";
import type { IFilterMenuItems } from "../../../typescript/interface";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilteredPriorityItems,
  setFilteredStatusItems,
} from "../../../reducer/DashboardSlice";

export default function FilterMenuItem({ filterMenuItems, name }: { filterMenuItems: IFilterMenuItems[]; name: string }) {
  const [openFilter, setOpenFilter] = useState(false);
  const { filteredPriorityItems, filteredStatusItems } = useSelector(
    (state: any) => state.dashboard
  );
  const selectedItem =
    name === "Priority" ? filteredPriorityItems : filteredStatusItems;
  const dispatch = useDispatch();

  const isPriority = name === "Priority";

  const clearFilter = () => {
    dispatch(
      isPriority
        ? setFilteredPriorityItems("")
        : setFilteredStatusItems("")
    );
  };

  const updateFilter = (value: string) => {
    dispatch(
      isPriority
        ? setFilteredPriorityItems(value)
        : setFilteredStatusItems(value)
    );
  };

  return (
    <Box
      sx={{
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        bgcolor: "background.paper",
        transition: "border-color 150ms ease",
      }}
    >
      <Box
        component="button"
        type="button"
        aria-expanded={openFilter}
        onClick={() => setOpenFilter((open) => !open)}
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          px: 1.75,
          py: 1.5,
          border: 0,
          bgcolor: "transparent",
          color: "text.primary",
          textAlign: "left",
          cursor: "pointer",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            mr: 1.25,
            display: "grid",
            placeItems: "center",
            borderRadius: 1.5,
            bgcolor: "primary.50",
            color: "primary.main",
          }}
        >
          {isPriority ? <Flag size={18} /> : <CircleCheckBig size={18} />}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedItem || "All"}
          </Typography>
        </Box>

        {openFilter ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </Box>

      <Collapse in={openFilter} timeout="auto">
        <Box sx={{ px: 2, pb: 1.5, pt: 0.5, borderTop: "1px solid", borderColor: "divider" }}>
          <FormControl fullWidth>
            <RadioGroup
              value={selectedItem}
              onChange={(_, value) => updateFilter(value)}
            >
              {filterMenuItems.map((item) => {
                const value = item.name;
                const selected = selectedItem === value;

                return (
                  <FormControlLabel
                    key={item.value}
                    value={value}
                    control={
                      <Radio
                        size="small"
                        onClick={(event) => {
                          if (selected) {
                            event.preventDefault();
                            clearFilter();
                          }
                        }}
                      />
                    }
                    label={item.name}
                    sx={{
                      mx: 0,
                      minHeight: 38,
                      borderRadius: 1.5,
                      "&:hover": { bgcolor: "action.hover" },
                      "& .MuiFormControlLabel-label": {
                        fontSize: 14,
                        fontWeight: selected ? 600 : 400,
                      },
                    }}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
        </Box>
      </Collapse>
    </Box>
  );
}