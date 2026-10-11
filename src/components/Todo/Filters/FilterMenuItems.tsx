import {
  FilterMenuItemsBoxSurfaceStyle1,
  FilterMenuItemsBoxSurfaceStyle2,
  FilterMenuItemsBoxSurfaceStyle3,
  FilterMenuItemsBoxSizeStyle4,
  FilterMenuItemsTypographyTextStyle5,
  FilterMenuItemsBoxSurfaceStyle6,
  FilterMenuItemsFormControlLabelSurfaceStyle7
} from "../../Styles/Todo/Filters/FilterMenuItems/FilterMenuItems.styles";
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
      sx={FilterMenuItemsBoxSurfaceStyle1}
    >
      <Box
        component="button"
        type="button"
        aria-expanded={openFilter}
        onClick={() => setOpenFilter((open) => !open)}
        sx={FilterMenuItemsBoxSurfaceStyle2}
      >
        <Box
          sx={FilterMenuItemsBoxSurfaceStyle3}
        >
          {isPriority ? <Flag size={18} /> : <CircleCheckBig size={18} />}
        </Box>

        <Box sx={FilterMenuItemsBoxSizeStyle4}>
          <Typography variant="body2" sx={FilterMenuItemsTypographyTextStyle5}>
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedItem || "All"}
          </Typography>
        </Box>

        {openFilter ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </Box>

      <Collapse in={openFilter} timeout="auto">
        <Box sx={FilterMenuItemsBoxSurfaceStyle6}>
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
                    sx={FilterMenuItemsFormControlLabelSurfaceStyle7({ selected: selected })}
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