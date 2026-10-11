export const SortDropdownDialogDialogStyle1 = {
        "& .MuiDialog-container": { alignItems: "flex-end" },
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: 520,
          maxHeight: "75dvh",
          m: 1,
          mb: 0,
          borderRadius: "20px 20px 0 0",
          overflow: "hidden",
        },
} as const;

export const SortDropdownBoxLayoutStyle2 = { display: "flex", alignItems: "center", px: 2, py: 1.5 };

export const SortDropdownBoxLayoutStyle3 = { flex: 1 };

export const SortDropdownTypographyTextStyle4 = { fontWeight: 700 };

export const SortDropdownDialogContentSpacingStyle5 = { p: 2 };

export const SortDropdownFormLabelTextStyle6 = {
              mb: 1,
              color: "text.primary",
              fontSize: 14,
              fontWeight: 700,
              "&.Mui-focused": { color: "text.primary" },
} as const;

export const SortDropdownRadioGroupLayoutStyle7 = { gap: 0.5 };

export const SortDropdownFormControlLabelSurfaceStyle8 = (vars: Record<string, any>) => ({
                  mx: 0,
                  minHeight: 40,
                  px: 1,
                  borderRadius: 1.5,
                  bgcolor: vars.fieldValue === vars.option.value ? "action.selected" : "transparent",
                  "& .MuiFormControlLabel-label": { fontSize: 14 },
                });

export const SortDropdownDividerSpacingStyle9 = { my: 2 };

export const SortDropdownFormLabelTextStyle10 = {
              mb: 1,
              color: "text.primary",
              fontSize: 14,
              fontWeight: 700,
              "&.Mui-focused": { color: "text.primary" },
} as const;

export const SortDropdownRadioGroupLayoutStyle11 = { gap: 0.5 };

export const SortDropdownFormControlLabelSurfaceStyle12 = (vars: Record<string, any>) => ({
                  mx: 0,
                  minHeight: 40,
                  px: 1,
                  borderRadius: 1.5,
                  bgcolor: vars.sortValue === vars.option.value ? "action.selected" : "transparent",
                  "& .MuiFormControlLabel-label": { fontSize: 14 },
                });

export const SortDropdownDialogActionsSurfaceStyle13 = {
          p: 2,
          pt: 1.5,
          borderTop: "1px solid",
          borderColor: "divider",
} as const;

export const SortDropdownButtonSurfaceStyle14 = {
            minHeight: 44,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
} as const;
