export const FilterDropdownFormLabelTextStyle1 = {
          mb: 1,
          color: "text.primary",
          fontSize: 14,
          fontWeight: 700,
          "&.Mui-focused": { color: "text.primary" },
} as const;

export const FilterDropdownRadioGroupLayoutStyle2 = { gap: 0.5 };

export const FilterDropdownFormControlLabelSurfaceStyle3 = (vars: Record<string, any>) => ({
              mx: 0,
              px: 1,
              minHeight: 40,
              borderRadius: 1.5,
              bgcolor: vars.value === vars.option.label ? "action.selected" : "transparent",
              "& .MuiFormControlLabel-label": { fontSize: 14 },
            });

export const FilterDropdownDialogDialogStyle4 = {
        "& .MuiDialog-container": { alignItems: "flex-end" },
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: 520,
          maxHeight: "78dvh",
          m: 1,
          mb: 0,
          borderRadius: "20px 20px 0 0",
          overflow: "hidden",
        },
} as const;

export const FilterDropdownBoxLayoutStyle5 = { display: "flex", alignItems: "center", px: 2, py: 1.5 };

export const FilterDropdownBoxLayoutStyle6 = { flex: 1 };

export const FilterDropdownTypographyTextStyle7 = { fontWeight: 700 };

export const FilterDropdownDialogContentSpacingStyle8 = { p: 2, overflowY: "auto" };

export const FilterDropdownBoxLayoutStyle9 = { display: "flex", flexDirection: "column", gap: 2.5 };

export const FilterDropdownDialogActionsSurfaceStyle10 = {
          p: 2,
          pt: 1.5,
          borderTop: "1px solid",
          borderColor: "divider",
          gap: 1,
} as const;

export const FilterDropdownButtonSurfaceStyle11 = { minHeight: 42, borderRadius: 2, textTransform: "none" };

export const FilterDropdownButtonSurfaceStyle12 = { minHeight: 42, borderRadius: 2, textTransform: "none", fontWeight: 700 };
