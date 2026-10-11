export const DesktopIndexBoxTextStyle1 = {
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100vh",
          minHeight: 0,
          overflow: "hidden",
          bgcolor: "#f6f8fb",
} as const;

export const DesktopIndexBoxSurfaceStyle2 = {
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.5, sm: 3 },
            width: "100%",
            minHeight: 76,
            boxSizing: "border-box",
            px: { xs: 2, md: 3.5 },
            py: 1.25,
            bgcolor: "#fff",
            borderBottom: "1px solid",
            borderColor: "divider",
            zIndex: 1,
} as const;

export const DesktopIndexBoxLayoutStyle3 = { display: "flex", alignItems: "center", gap: 1.25, flexShrink: 0 };

export const DesktopIndexBoxSurfaceStyle4 = {
                width: 38,
                height: 38,
                display: "grid",
                placeItems: "center",
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
} as const;

export const DesktopIndexTypographyTextStyle5 = { fontWeight: 750, letterSpacing: -0.4, color: "text.primary" };

export const DesktopIndexBoxSizeStyle6 = { display: "flex", alignItems: "center", flex: 1, minWidth: 0, ml: { xs: 0, sm: 2 } };

export const DesktopIndexButtonBaseSurfaceStyle7 = (vars: Record<string, any>) => ({
                  minHeight: 42,
                  justifyContent: "flex-start",
                  gap: 1,
                  px: 1.5,
                  borderRadius: 2,
                  color: vars.item.selected ? "primary.main" : "text.secondary",
                  bgcolor: vars.item.selected ? "primary.50" : "transparent",
                  "&:hover": {
                    bgcolor: vars.item.selected ? "primary.50" : "action.hover",
                  },
                });

export const DesktopIndexTypographyTextStyle8 = (vars: Record<string, any>) => ({ fontWeight: vars.item.selected ? 700 : 500 });

export const DesktopIndexBoxLayoutStyle9 = { display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 }, flexShrink: 0 };

export const DesktopIndexBoxSizeStyle10 = { display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1, minWidth: 0 };

export const DesktopIndexAvatarTextStyle11 = { width: 36, height: 36, bgcolor: "grey.100" };

export const DesktopIndexBoxSizeStyle12 = { minWidth: 0 };

export const DesktopIndexTypographySizeStyle13 = { display: "block", lineHeight: 1.2 };

export const DesktopIndexTypographyTextStyle14 = { fontWeight: 700, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };

export const DesktopIndexButtonBaseSurfaceStyle15 = {
                minHeight: 40,
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.25,
                borderRadius: 2,
                color: "text.secondary",
                "&:hover": { bgcolor: "action.hover", color: "error.main" },
} as const;

export const DesktopIndexTypographyTextStyle16 = { fontWeight: 500, display: { xs: "none", sm: "block" } };

export const DesktopIndexBoxSizeStyle17 = {
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            width: "100%",
            overflowY: "auto",
            overscrollBehavior: "contain",
            p: { xs: 1.5, sm: 2.5, md: 3 },
            boxSizing: "border-box",
} as const;
