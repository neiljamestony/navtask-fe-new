export const FilePreviewBoxSurfaceStyle1 = {
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

export const FilePreviewBoxSurfaceStyle2 = {
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

export const FilePreviewBoxSizeStyle3 = { width: "100%", height: "100%", objectFit: "cover" };

export const FilePreviewBoxSizeStyle4 = { flex: 1, minWidth: 0 };

export const FilePreviewTypographyTextStyle5 = {
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "text.primary",
            fontWeight: 600,
            textDecoration: "none",
            "&:hover": { color: "primary.main" },
} as const;

export const FilePreviewIconButtonTextStyle6 = {
            flexShrink: 0,
            color: "text.secondary",
            "&:hover": { color: "error.main", bgcolor: "error.50" },
} as const;
