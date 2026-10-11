import {
  SubtaskBoxSpacingStyle1,
  SubtaskBoxLayoutStyle2,
  SubtaskTypographyTextStyle3,
  SubtaskChipTextStyle4,
  SubtaskBoxLayoutStyle5,
  SubtaskBoxSurfaceStyle6,
  SubtaskAvatarTextStyle7,
  SubtaskTypographySizeStyle8,
  SubtaskChipTextStyle9,
  SubtaskTypographySpacingStyle10,
  SubtaskEmptyStateContainerStyle
} from "../Styles/Task/Subtask/Subtask.styles";
import type { SubTask } from "../../typescript/interface";
import { Avatar, Box, Chip, Typography } from "@mui/material";
import { ListTodo } from "lucide-react";
import { subTaskStatusIcons } from "../Todo/DesktopTodo";

export default function Subtask({ subtasks }: { subtasks: SubTask[] }) {
  return (
    <Box sx={SubtaskBoxSpacingStyle1}>
      <Box
        sx={SubtaskBoxLayoutStyle2}
      >
        <Typography variant="subtitle2" sx={SubtaskTypographyTextStyle3}>
          Subtasks
        </Typography>

        <Chip
          label={subtasks.length}
          size="small"
          sx={SubtaskChipTextStyle4}
        />
      </Box>

      {subtasks.length > 0 ? (
        <Box sx={SubtaskBoxLayoutStyle5}>
          {subtasks.map((item, index) => {
            const status =
              subTaskStatusIcons[
                item.status as keyof typeof subTaskStatusIcons
              ];

            return (
              <Box
                key={`${item.title}-${index}`}
                sx={SubtaskBoxSurfaceStyle6}
              >
                <Avatar
                  variant="rounded"
                  sx={SubtaskAvatarTextStyle7}
                >
                  <ListTodo size={18} />
                </Avatar>

                <Typography
                  variant="body2"
                  sx={SubtaskTypographySizeStyle8}
                >
                  {item.title}
                </Typography>

                {status && (
                  <Chip
                    size="small"
                    icon={status.icon}
                    label={status.label}
                    sx={SubtaskChipTextStyle9({ status: status })}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box sx={SubtaskEmptyStateContainerStyle}>
          <ListTodo size={22} color="#9e9e9e" />
          <Typography variant="body2" color="text.secondary" sx={SubtaskTypographySpacingStyle10}>
            No subtasks yet
          </Typography>
        </Box>
      )}
    </Box>
  );
}
