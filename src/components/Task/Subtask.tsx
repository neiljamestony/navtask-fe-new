import type { SubTask } from "../../typescript/interface";
import { Avatar, Box, Chip, Typography } from "@mui/material";
import { ListTodo } from "lucide-react";
import { subTaskStatusIcons } from "../Todo/DesktopTodo";

export default function Subtask({ subtasks }: { subtasks: SubTask[] }) {
  return (
    <Box sx={{ mt: 1, ml: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Subtasks
        </Typography>

        <Chip
          label={subtasks.length}
          size="small"
          sx={{
            height: 22,
            fontSize: 12,
            fontWeight: 600,
            bgcolor: "grey.100",
            color: "text.secondary",
          }}
        />
      </Box>

      {subtasks.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {subtasks.map((item, index) => {
            const status =
              subTaskStatusIcons[
                item.status as keyof typeof subTaskStatusIcons
              ];

            return (
              <Box
                key={`${item.title}-${index}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.25,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  bgcolor: "background.paper",
                }}
              >
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "rgba(148, 0, 211, 0.10)",
                    color: "#9400D3",
                  }}
                >
                  <ListTodo size={18} />
                </Avatar>

                <Typography
                  variant="body2"
                  sx={{ flex: 1, minWidth: 0, overflowWrap: "anywhere" }}
                >
                  {item.title}
                </Typography>

                {status && (
                  <Chip
                    size="small"
                    icon={status.icon}
                    label={status.label}
                    sx={{
                      flexShrink: 0,
                      bgcolor: status.bgColor,
                      color: status.color,
                      fontSize: 11,
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box
          sx={{
            py: 3,
            px: 2,
            textAlign: "center",
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "grey.50",
          }}
        >
          <ListTodo size={22} color="#9e9e9e" />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            No subtasks yet
          </Typography>
        </Box>
      )}
    </Box>
  );
}