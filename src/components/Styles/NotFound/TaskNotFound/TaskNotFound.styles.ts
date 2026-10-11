export const TaskNotFoundBoxSizeStyle1 = {
        minHeight: { xs: "55vh", sm: "60vh" },
        display: "grid",
        placeItems: "center",
        px: { xs: 1.5, sm: 2 },
        py: { xs: 2, sm: 3 },
        boxSizing: "border-box",
} as const;

export const TaskNotFoundBoxSurfaceStyle2 = {
          width: "100%",
          maxWidth: 420,
          boxSizing: "border-box",
          p: { xs: 2.5, sm: 4 },
          textAlign: "center",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: { xs: 2.5, sm: 3 },
} as const;

export const TaskNotFoundBoxSurfaceStyle3 = {
            width: { xs: 56, sm: 64 },
            height: { xs: 56, sm: 64 },
            mx: "auto",
            mb: { xs: 1.5, sm: 2 },
            display: "grid",
            placeItems: "center",
            borderRadius: 2,
            bgcolor: "grey.100",
            color: "text.secondary",
} as const;

export const TaskNotFoundTypographyTextStyle4 = { fontWeight: 700 };

export const TaskNotFoundTypographySpacingStyle5 = { mt: 0.75, mb: 2.5, overflowWrap: "anywhere" };

export const TaskNotFoundButtonSurfaceStyle6 = {
            minHeight: 44,
            textTransform: "none",
            borderRadius: 2,
} as const;
