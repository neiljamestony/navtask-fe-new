export const SubtaskBoxSpacingStyle1 = { mt: 1, ml: 1 };

export const SubtaskBoxLayoutStyle2 = {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
} as const;

export const SubtaskTypographyTextStyle3 = { fontWeight: 700 };

export const SubtaskChipTextStyle4 = {
            height: 22,
            fontSize: 12,
            fontWeight: 600,
            bgcolor: "grey.100",
            color: "text.secondary",
} as const;

export const SubtaskBoxLayoutStyle5 = { display: "flex", flexDirection: "column", gap: 1 };

export const SubtaskBoxSurfaceStyle6 = {
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.25,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  bgcolor: "background.paper",
} as const;

export const SubtaskAvatarTextStyle7 = {
                    width: 36,
                    height: 36,
                    bgcolor: "rgba(148, 0, 211, 0.10)",
                    color: "#9400D3",
} as const;

export const SubtaskTypographySizeStyle8 = { flex: 1, minWidth: 0, overflowWrap: "anywhere" };

export const SubtaskChipTextStyle9 = (vars: Record<string, any>) => ({
                      flexShrink: 0,
                      bgcolor: vars.status.bgColor,
                      color: vars.status.color,
                      fontSize: 11,
                    });

export const SubtaskTypographySpacingStyle10 = { mt: 0.75 };

export const SubtaskEmptyStateContainerStyle = {
  py: 3,
  px: 2,
  textAlign: "center",
  border: "1px dashed",
  borderColor: "divider",
  borderRadius: 2,
  bgcolor: "grey.50",
} as const;
