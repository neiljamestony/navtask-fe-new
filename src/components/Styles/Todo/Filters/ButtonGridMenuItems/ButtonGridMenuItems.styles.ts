export const ButtonGridMenuItemsBoxSizeStyle1 = { display: "flex", alignItems: "center", gap: 1, minWidth: 0 };

export const ButtonGridMenuItemsTypographyTextStyle2 = {
          fontWeight: 700,
          color: "text.secondary",
          whiteSpace: "nowrap",
} as const;

export const ButtonGridMenuItemsToggleButtonGroupButtonStyle3 = {
          p: 0.5,
          gap: 0.5,
          borderRadius: 2,
          bgcolor: "#f1f3f5",
          "&::before, &::after": { display: "none" },
          "& .MuiToggleButtonGroup-grouped": {
            m: 0,
            border: 0,
            borderRadius: "6px !important",
          },
          "& .MuiToggleButton-root": {
            minHeight: 32,
            px: 1.25,
            gap: 0.75,
            color: "text.secondary",
            border: 0,
            borderRadius: "6px !important",
            textTransform: "none",
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: "nowrap",
            "&:hover": { bgcolor: "rgba(255,255,255,0.7)" },
            "&.Mui-selected": {
              color: "text.primary",
              bgcolor: "#fff",
              boxShadow: "0 1px 3px rgba(15, 23, 42, 0.12)",
              "&:hover": { bgcolor: "#fff" },
            },
          },
} as const;
