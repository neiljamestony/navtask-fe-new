import {
  ButtonGridMenuItemsBoxSizeStyle1,
  ButtonGridMenuItemsTypographyTextStyle2,
  ButtonGridMenuItemsToggleButtonGroupButtonStyle3
} from "../../Styles/Todo/Filters/ButtonGridMenuItems/ButtonGridMenuItems.styles";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  ArrowDown,
  Ban,
  Check,
  Circle,
  CircleCheckBig,
  CircleDashed,
  Clock3,
  Flame,
  Flag,
  ListFilter,
} from "lucide-react";
import type { IFilterMenuItems } from "../../../typescript/interface";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilteredPriorityItems,
  setFilteredStatusItems,
} from "../../../reducer/DashboardSlice";

function getOptionIcon(name: string) {
  switch (name.toLowerCase()) {
    case "all":
      return <ListFilter size={15} />;
    case "not started":
      return <CircleDashed size={15} />;
    case "in progress":
      return <Clock3 size={15} />;
    case "completed":
    case "done":
      return <CircleCheckBig size={15} />;
    case "cancelled":
    case "canceled":
      return <Ban size={15} />;
    case "low":
      return <ArrowDown size={15} />;
    case "high":
      return <Flag size={15} />;
    case "critical":
      return <Flame size={15} />;
    default:
      return <Circle size={15} />;
  }
}

export default function ButtonGridFilterMenuItems({
  filterMenuItems,
  name,
}: {
  filterMenuItems: IFilterMenuItems[];
  name: string;
}) {
  const { filteredPriorityItems, filteredStatusItems } = useSelector(
    (state: any) => state.dashboard
  );
  const dispatch = useDispatch();
  const isPriority = name === "Priority";
  const selectedItem = isPriority
    ? filteredPriorityItems
    : filteredStatusItems;

  const handleChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    const action = isPriority
      ? setFilteredPriorityItems(value ?? "")
      : setFilteredStatusItems(value ?? "");

    dispatch(action);
  };

  return (
    <Box sx={ButtonGridMenuItemsBoxSizeStyle1}>
      <Typography
        variant="caption"
        sx={ButtonGridMenuItemsTypographyTextStyle2}
      >
        {name}
      </Typography>

      <ToggleButtonGroup
        exclusive
        size="small"
        value={selectedItem || null}
        onChange={handleChange}
        aria-label={`${name} filters`}
        sx={ButtonGridMenuItemsToggleButtonGroupButtonStyle3}
      >
        {filterMenuItems.map((item) => {
          const selected = selectedItem === item.name;

          return (
            <ToggleButton
              key={item.name}
              value={item.name}
              aria-label={item.name}
            >
              {selected ? <Check size={15} /> : getOptionIcon(item.name)}
              {item.name}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Box>
  );
}