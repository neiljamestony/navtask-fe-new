export const EditTaskDesktopBoxTextStyle1 = {
                boxSizing: "border-box",
                minHeight: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "#f6f8fb",
                p: { xs: 1.5, md: 3 },
} as const;

export const EditTaskDesktopBoxSizeStyle2 = {
                    width: "100%",
                    maxWidth: 1000,
                    mx: "auto",
                    mb: 2,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
} as const;

export const EditTaskDesktopTypographyTextStyle3 = { fontWeight: 700, lineHeight: 1.2 };

export const EditTaskDesktopPaperSurfaceStyle4 = {
                    width: "100%",
                    maxWidth: 1000,
                    mx: "auto",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid",
                    borderColor: "#e3e8ef",
                    borderRadius: 3,
                    overflow: "hidden",
} as const;

export const EditTaskDesktopBoxLayoutStyle5 = {
                    flex: 1,
                    p: { xs: 2, sm: 3, md: 4 },
} as const;

export const EditTaskDesktopBoxLayoutStyle6 = { display: "flex", flexDirection: "column", gap: 3 };

export const EditTaskDesktopTypographyTextStyle7 = { fontWeight: 700 };

export const EditTaskDesktopTypographySpacingStyle8 = { mb: 2 };

export const EditTaskDesktopTextFieldInputStyle9 = {
                                    "& .MuiInputBase-input": {
                                    fontSize: 18,
                                    fontWeight: 600,
                                    },
} as const;

export const EditTaskDesktopTypographyTextStyle10 = { fontWeight: 700 };

export const EditTaskDesktopTypographySpacingStyle11 = { mb: 2 };

export const EditTaskDesktopTypographyTextStyle12 = { fontWeight: 700 };

export const EditTaskDesktopTypographySpacingStyle13 = { mb: 2 };

export const EditTaskDesktopTypographyTextStyle14 = { fontWeight: 700 };

export const EditTaskDesktopTypographySpacingStyle15 = { mb: 2 };

export const EditTaskDesktopBoxSurfaceStyle16 = (vars: Record<string, any>) => ({
                                p: 2,
                                border: "1.5px dashed",
                                borderColor: vars.fileError ? "error.main" : "#cbd5e1",
                                borderRadius: 2,
                                bgcolor: "#fafcff",
                                cursor: vars.uploading ? "default" : "pointer",
                                transition: "background-color 150ms ease, border-color 150ms ease",
                                "&:hover": {
                                borderColor: vars.fileError ? "error.main" : "primary.main",
                                bgcolor: "#f3f8ff",
                                },
                            });

export const EditTaskDesktopBoxSurfaceStyle17 = {
                                p: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 3,
                                bgcolor: "background.paper",
} as const;

export const EditTaskDesktopBoxLayoutStyle18 = { display: "flex", alignItems: "center", gap: 1.5 };

export const EditTaskDesktopBoxSurfaceStyle19 = {
                                    width: 44,
                                    height: 44,
                                    flexShrink: 0,
                                    display: "grid",
                                    placeItems: "center",
                                    borderRadius: 2.5,
                                    bgcolor: "primary.50",
                                    color: "primary.main",
} as const;

export const EditTaskDesktopBoxSizeStyle20 = { flex: 1, minWidth: 0 };

export const EditTaskDesktopTypographyTextStyle21 = { fontWeight: 700 };

export const EditTaskDesktopTypographyTextStyle22 = {
                                        display: "block",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        mt: 0.25,
} as const;

export const EditTaskDesktopTypographyTextStyle23 = { fontWeight: 700, fontVariantNumeric: "tabular-nums" };

export const EditTaskDesktopBoxSurfaceStyle24 = {
                                    mt: 1.75,
                                    height: 6,
                                    overflow: "hidden",
                                    borderRadius: 999,
                                    bgcolor: "action.hover",
} as const;

export const EditTaskDesktopBoxSurfaceStyle25 = (vars: Record<string, any>) => ({
                                    width: `${Math.min(100, Math.max(0, vars.progress))}%`,
                                    height: "100%",
                                    borderRadius: "inherit",
                                    bgcolor: "primary.main",
                                    transition: "width 250ms ease",
                                    });

export const EditTaskDesktopBoxLayoutStyle26 = {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1.5,
                                py: 1,
} as const;

export const EditTaskDesktopBoxTextStyle27 = { color: "primary.main", fontWeight: 700 };

export const EditTaskDesktopBoxLayoutStyle28 = {
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1.5,
                                mt: 2,
} as const;

export const EditTaskDesktopTypographyLayoutStyle29 = { display: "block", mt: 1 };

export const EditTaskDesktopBoxLayoutStyle30 = {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                                mb: 2,
} as const;

export const EditTaskDesktopTypographyTextStyle31 = { fontWeight: 700 };

export const EditTaskDesktopButtonSurfaceStyle32 = { textTransform: "none", borderRadius: 2, flexShrink: 0 };

export const EditTaskDesktopBoxSurfaceStyle33 = {
                                p: 2.5,
                                border: "1px dashed",
                                borderColor: "divider",
                                borderRadius: 2,
                                bgcolor: "#fafcff",
                                textAlign: "center",
} as const;

export const EditTaskDesktopBoxLayoutStyle34 = { display: "flex", flexDirection: "column", gap: 1 };

export const EditTaskDesktopBoxGridStyle35 = (vars: Record<string, any>) => ({
                                            display: "grid",
                                            gridTemplateColumns: {
                                                xs: "32px minmax(0, 1fr) 36px",
                                                sm: "36px minmax(0, 1fr) 150px 36px",
                                            },
                                            gap: 1.25,
                                            alignItems: "center",
                                            p: 1.25,
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: 2,
                                            bgcolor: vars.isDone ? "rgba(46, 125, 50, 0.035)" : "background.paper",
                                            transition: "border-color 150ms ease, background-color 150ms ease",
                                            "&:hover": { borderColor: "primary.light" },
                                        });

export const EditTaskDesktopBoxSurfaceStyle36 = (vars: Record<string, any>) => ({
                                                width: 30,
                                                height: 30,
                                                display: "grid",
                                                placeItems: "center",
                                                borderRadius: "50%",
                                                bgcolor: vars.isDone ? "success.light" : "grey.100",
                                                color: vars.isDone ? "success.dark" : "text.secondary",
                                                fontSize: 13,
                                                fontWeight: 700,
                                            });

export const EditTaskDesktopTextFieldInputStyle37 = {
                                                "& .MuiInputBase-root": {
                                                px: 1.25,
                                                py: 0.75,
                                                borderRadius: 1.5,
                                                bgcolor: "grey.50",
                                                },
                                                "& .MuiInputLabel-root": { display: "none" },
} as const;

export const EditTaskDesktopTextFieldGridStyle38 = {
                                                gridColumn: { xs: "2", sm: "auto" },
                                                gridRow: { xs: "2", sm: "auto" },
} as const;

export const EditTaskDesktopTypographyTextStyle39 = { fontSize: 13 };

export const EditTaskDesktopIconButtonGridStyle40 = {
                                                gridColumn: { xs: "3", sm: "4" },
                                                gridRow: { xs: "1", sm: "auto" },
                                                color: "text.secondary",
                                                "&:hover": {
                                                color: "error.main",
                                                bgcolor: "error.lighter",
                                                },
} as const;

export const EditTaskDesktopBoxSurfaceStyle41 = {
                        flexShrink: 0,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1.5,
                        px: { xs: 2, sm: 3, md: 4 },
                        py: 2,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        bgcolor: "#fff",
} as const;

export const EditTaskDesktopButtonSurfaceStyle42 = { textTransform: "none", borderRadius: 2, px: 3 };

export const EditTaskDesktopButtonSurfaceStyle43 = { textTransform: "none", borderRadius: 2, px: 3, fontWeight: 700 };

export const EditTaskDesktopButtonSurfaceStyle44 = { textTransform: "none", borderRadius: 2, px: 3, fontWeight: 700 };
