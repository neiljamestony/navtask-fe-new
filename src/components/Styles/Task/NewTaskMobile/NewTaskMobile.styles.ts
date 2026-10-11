export const NewTaskMobileBoxTextStyle1 = { minHeight: "100dvh", bgcolor: "#f6f8fb", pb: 10 };

export const NewTaskMobileAppBarSurfaceStyle2 = {
                bgcolor: "rgba(255,255,255,0.96)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid",
                borderColor: "divider",
} as const;

export const NewTaskMobileToolbarSizeStyle3 = { minHeight: 58, gap: 1 };

export const NewTaskMobileIconButtonSurfaceStyle4 = { border: "1px solid", borderColor: "divider", borderRadius: 2 };

export const NewTaskMobileTypographyTextStyle5 = { fontWeight: 700, lineHeight: 1.2 };

export const NewTaskMobileBoxSizeStyle6 = {
                width: "100%",
                maxWidth: 640,
                boxSizing: "border-box",
                mx: "auto",
                px: 2,
                pt: 9,
                pb: 3,
} as const;

export const NewTaskMobileBoxLayoutStyle7 = { display: "flex", flexDirection: "column", gap: 1.75 };

export const NewTaskMobileBoxGridStyle8 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25 };

export const NewTaskMobileBoxSurfaceStyle9 = {
                            p: 1.5,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2.5,
                            bgcolor: "background.paper",
                            textAlign: "left",
                            cursor: "pointer",
} as const;

export const NewTaskMobileTypographyLayoutStyle10 = { display: "block", mb: 0.75 };

export const NewTaskMobileBoxSurfaceStyle11 = (vars: Record<string, any>) => ({
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.75,
                                px: 1,
                                py: 0.5,
                                borderRadius: 10,
                                bgcolor: vars.item.bgColor,
                                color: vars.item.color,
                            });

export const NewTaskMobileTypographyTextStyle12 = { fontWeight: 700, lineHeight: 1 };

export const NewTaskMobileTypographyTextStyle13 = { fontWeight: 700 };

export const NewTaskMobileBoxSurfaceStyle14 = {
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2.5,
                        bgcolor: "background.paper",
} as const;

export const NewTaskMobileTypographyTextStyle15 = { fontWeight: 700, mb: 1.25 };

export const NewTaskMobileBoxGridStyle16 = {
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1.4fr" },
                        gap: 1.25,
} as const;

export const NewTaskMobileBoxSurfaceStyle17 = {
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        p: 1.5,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2.5,
                        bgcolor: "background.paper",
} as const;

export const NewTaskMobileBoxSurfaceStyle18 = {
                            width: 36,
                            height: 36,
                            flexShrink: 0,
                            display: "grid",
                            placeItems: "center",
                            borderRadius: 1.5,
                            bgcolor: "grey.100",
                            color: "text.secondary",
} as const;

export const NewTaskMobileTypographyTextStyle19 = { fontWeight: 700 };

export const NewTaskMobileBoxSurfaceStyle20 = (vars: Record<string, any>) => ({
                        p: 1.25,
                        border: "1px solid",
                        borderColor: vars.errors.some((error: { key: string }) => error.key === "due_date")
                            ? "error.main"
                            : "primary.light",
                        borderRadius: 2.5,
                        bgcolor: "primary.50",
                        });

export const NewTaskMobileBoxLayoutStyle21 = { display: "flex", alignItems: "center", gap: 0.75, mb: 1 };

export const NewTaskMobileTypographyTextStyle22 = { color: "primary.dark", fontWeight: 700 };

export const NewTaskMobileBoxSurfaceStyle23 = {
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2.5,
                    bgcolor: "background.paper",
} as const;

export const NewTaskMobileTypographyTextStyle24 = { fontWeight: 700, mb: 1.25 };

export const NewTaskMobileTextFieldInputStyle25 = {
                        "& .MuiInputBase-input": {
                        fontSize: 14,
                        lineHeight: 1.5,
                        },
                        "& .MuiInputLabel-root": {
                        fontSize: 14,
                        },
                        "& .MuiFormHelperText-root": {
                        fontSize: 11,
                        },
} as const;

export const NewTaskMobileBoxSurfaceStyle26 = {
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2.5,
                    bgcolor: "background.paper",
} as const;

export const NewTaskMobileBoxLayoutStyle27 = { display: "flex", justifyContent: "space-between", gap: 1, mb: 1.5 };

export const NewTaskMobileTypographyTextStyle28 = { fontWeight: 700 };

export const NewTaskMobileBoxSurfaceStyle29 = (vars: Record<string, any>) => ({
                    p: 2.5,
                    border: "1px dashed",
                    borderColor: vars.fileError ? "error.main" : "primary.light",
                    borderRadius: 2,
                    bgcolor: vars.fileError ? "error.50" : "primary.50",
                    textAlign: "center",
                    cursor: vars.uploading ? "default" : "pointer",
                    });

export const NewTaskMobileTypographySpacingStyle30 = { mb: 1, overflowWrap: "anywhere" };

export const NewTaskMobileLinearProgressSurfaceStyle31 = { borderRadius: 5, height: 6 };

export const NewTaskMobileBoxLayoutStyle32 = { display: "flex", flexDirection: "column", alignItems: "center", gap: 1 };

export const NewTaskMobileBoxSizeStyle33 = { width: 28, height: 28, objectFit: "contain" };

export const NewTaskMobileBoxTextStyle34 = { color: "primary.main", fontWeight: 700 };

export const NewTaskMobileTypographyLayoutStyle35 = { display: "block", mt: 1 };

export const NewTaskMobileBoxLayoutStyle36 = { display: "flex", flexDirection: "column", gap: 1, mt: 1.5 };

export const NewTaskMobileBoxSurfaceStyle37 = {
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2.5,
                        bgcolor: "background.paper",
} as const;

export const NewTaskMobileBoxLayoutStyle38 = {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    mb: 1.5,
} as const;

export const NewTaskMobileTypographyTextStyle39 = { fontWeight: 700 };

export const NewTaskMobileButtonSurfaceStyle40 = { textTransform: "none", borderRadius: 2 };

export const NewTaskMobileBoxLayoutStyle41 = { display: "flex", flexDirection: "column", gap: 1.25 };

export const NewTaskMobileBoxSurfaceStyle42 = (vars: Record<string, any>) => ({
                                    p: 1.5,
                                    border: "1px solid",
                                    borderColor: vars.isDone ? "success.200" : "divider",
                                    borderRadius: 2.5,
                                    bgcolor: vars.isDone ? "success.50" : "background.paper",
                                    transition: "background-color 150ms ease, border-color 150ms ease",
                                });

export const NewTaskMobileBoxLayoutStyle43 = {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        mb: 1.25,
} as const;

export const NewTaskMobileBoxSurfaceStyle44 = (vars: Record<string, any>) => ({
                                        width: 26,
                                        height: 26,
                                        flexShrink: 0,
                                        display: "grid",
                                        placeItems: "center",
                                        borderRadius: "50%",
                                        bgcolor: vars.isDone ? "success.main" : "grey.200",
                                        color: vars.isDone ? "common.white" : "text.secondary",
                                        fontSize: 12,
                                        fontWeight: 700,
                                        });

export const NewTaskMobileChipIconStyle45 = (vars: Record<string, any>) => ({
                                            height: 28,
                                            borderRadius: 10,
                                            fontSize: 11,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            bgcolor: vars.isDone ? "success.50" : "grey.100",
                                            color: vars.isDone ? "success.dark" : "text.secondary",
                                            border: "1px solid",
                                            borderColor: vars.isDone ? "success.200" : "divider",
                                            "& .MuiChip-icon": { color: "inherit", ml: 0.75 },
                                            "&:hover": { bgcolor: vars.isDone ? "success.100" : "grey.200" },
                                        });

export const NewTaskMobileBoxLayoutStyle46 = { flex: 1 };

export const NewTaskMobileIconButtonTextStyle47 = {
                                        color: "text.secondary",
} as const;

export const NewTaskMobileTextFieldInputStyle48 = {
                                        mt: 2,
                                        mb: -3,
                                        "& .MuiOutlinedInput-root": {
                                        bgcolor: "background.paper",
                                        },
                                        "& .MuiInputBase-input": {
                                        fontSize: 14,
                                        },
                                        "& .MuiInputLabel-root": {
                                        fontSize: 14,
                                        },
                                        "& .MuiFormHelperText-root": {
                                        fontSize: 11,
                                        },
} as const;

export const NewTaskMobileButtonSurfaceStyle49 = { minHeight: 44, borderRadius: 2, textTransform: "none", fontWeight: 700 };
