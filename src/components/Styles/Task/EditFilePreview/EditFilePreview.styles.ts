export const EditFilePreviewBoxSurfaceStyle1 = {
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        minWidth: 0,
        p: 1,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
} as const;

export const EditFilePreviewBoxSurfaceStyle2 = {
          width: 48,
          height: 48,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          borderRadius: 1.5,
          bgcolor: "grey.100",
          color: "text.secondary",
} as const;

export const EditFilePreviewBoxSizeStyle3 = { width: "100%", height: "100%", objectFit: "cover" };

export const EditFilePreviewBoxSizeStyle4 = { flex: 1, minWidth: 0 };

export const EditFilePreviewTypographyTextStyle5 = (vars: Record<string, any>) => ({
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: vars.url ? "primary.main" : "text.primary",
            fontWeight: 600,
            textDecoration: vars.url ? "none" : "none",
          });

export const EditFilePreviewIconButtonTextStyle6 = { color: "text.secondary" };

export const EditFilePreviewIconButtonTextStyle7 = {
          color: "text.secondary",
          "&:hover": { color: "error.main", bgcolor: "error.50" },
} as const;
