export const FilterMenuItemsBoxSurfaceStyle1 = {
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        bgcolor: "background.paper",
        transition: "border-color 150ms ease",
} as const;

export const FilterMenuItemsBoxSurfaceStyle2 = {
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
} as const;

export const FilterMenuItemsBoxSurfaceStyle3 = {
            width: 34,
            height: 34,
            mr: 1.25,
            display: "grid",
            placeItems: "center",
            borderRadius: 1.5,
            bgcolor: "primary.50",
            color: "primary.main",
} as const;

export const FilterMenuItemsBoxSizeStyle4 = { flex: 1, minWidth: 0 };

export const FilterMenuItemsTypographyTextStyle5 = { fontWeight: 700 };

export const FilterMenuItemsBoxSurfaceStyle6 = { px: 2, pb: 1.5, pt: 0.5, borderTop: "1px solid", borderColor: "divider" };

export const FilterMenuItemsFormControlLabelSurfaceStyle7 = (vars: Record<string, any>) => ({
                      mx: 0,
                      minHeight: 38,
                      borderRadius: 1.5,
                      "&:hover": { bgcolor: "action.hover" },
                      "& .MuiFormControlLabel-label": {
                        fontSize: 14,
                        fontWeight: vars.selected ? 600 : 400,
                      },
                    });
