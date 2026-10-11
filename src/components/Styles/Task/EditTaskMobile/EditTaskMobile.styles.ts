export const EditTaskMobileBoxTextStyle1 = { minHeight: "100dvh", bgcolor: "#f6f8fb", pb: 11 };

export const EditTaskMobileAppBarSurfaceStyle2 = {
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: "rgba(255,255,255,0.96)",
                backdropFilter: "blur(12px)",
} as const;

export const EditTaskMobileToolbarSizeStyle3 = { minHeight: 58, gap: 1 };

export const EditTaskMobileTypographyTextStyle4 = { fontWeight: 700, lineHeight: 1.2 };

export const EditTaskMobileBoxSizeStyle5 = {
                    width: "100%",
                    minHeight: "50dvh",
                    boxSizing: "border-box",
                    pt: "64px",
                    px: 2,
                    display: "flex",
                    alignItems: "center",
} as const;

export const EditTaskMobileBoxTextStyle6 = {
                minHeight: "100dvh",
                display: "grid",
                placeItems: "center",
                px: 3,
                pt: 8,
                textAlign: "center",
} as const;

export const EditTaskMobileTypographyTextStyle7 = { fontWeight: 700 };

export const EditTaskMobileTypographySpacingStyle8 = { mt: 0.75, mb: 2 };

export const EditTaskMobileButtonTextStyle9 = { textTransform: "none" };

export const EditTaskMobileBoxSizeStyle10 = {
                        maxWidth: 640,
                        mx: "auto",
                        px: 2,
                        pt: 10,
                        pb: 3,
} as const;

export const EditTaskMobileBoxLayoutStyle11 = { display: "flex", flexDirection: "column", gap: 2 };

export const EditTaskMobileBoxGridStyle12 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25 };

export const EditTaskMobileBoxSurfaceStyle13 = {
                                        p: 1.5,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 2.5,
                                        bgcolor: "background.paper",
                                        textAlign: "left",
                                        cursor: "pointer",
} as const;

export const EditTaskMobileTypographyLayoutStyle14 = { display: "block", mb: 0.75 };

export const EditTaskMobileBoxSurfaceStyle15 = (vars: Record<string, any>) => ({
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 0.75,
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 10,
                                            bgcolor: vars.item.bgColor,
                                            color: vars.item.color,
                                        });

export const EditTaskMobileTypographyTextStyle16 = { fontWeight: 700, lineHeight: 1 };

export const EditTaskMobileTypographyTextStyle17 = { fontWeight: 700 };

export const EditTaskMobileBoxSurfaceStyle18 = {
                                p: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2.5,
                                bgcolor: "background.paper",
} as const;

export const EditTaskMobileTypographyTextStyle19 = { fontWeight: 700, mb: 1.25 };

export const EditTaskMobileBoxSurfaceStyle20 = {
                                p: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2.5,
                                bgcolor: "background.paper",
} as const;

export const EditTaskMobileBoxLayoutStyle21 = { display: "flex", alignItems: "center", gap: 1, mb: 2 };

export const EditTaskMobileTypographyTextStyle22 = { fontWeight: 700 };

export const EditTaskMobileBoxGridStyle23 = {
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", sm: "1fr 1.4fr" },
                                alignItems: "stretch",
                                gap: 1.5,
} as const;

export const EditTaskMobileBoxSurfaceStyle24 = {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.25,
                                        p: 1.5,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 2,
                                        bgcolor: "grey.50",
} as const;

export const EditTaskMobileTypographyTextStyle25 = { fontWeight: 600 };

export const EditTaskMobileBoxSurfaceStyle26 = {
                                p: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2.5,
                                bgcolor: "background.paper",
} as const;

export const EditTaskMobileTypographyTextStyle27 = { fontWeight: 700, mb: 1.25 };

export const EditTaskMobileBoxSurfaceStyle28 = {
                                p: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2.5,
                                bgcolor: "background.paper",
} as const;

export const EditTaskMobileBoxLayoutStyle29 = {
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                gap: 1,
                                mb: 1.5,
} as const;

export const EditTaskMobileTypographyTextStyle30 = { fontWeight: 700 };

export const EditTaskMobileBoxSurfaceStyle31 = {
                                    px: 1,
                                    py: 0.4,
                                    borderRadius: 10,
                                    bgcolor: "grey.100",
                                    color: "text.secondary",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    whiteSpace: "nowrap",
} as const;

export const EditTaskMobileBoxSurfaceStyle32 = (vars: Record<string, any>) => ({
                                    p: 2.5,
                                    border: "1px dashed",
                                    borderColor: vars.fileError ? "error.main" : "primary.light",
                                    borderRadius: 2,
                                    bgcolor: vars.fileError ? "error.50" : "primary.50",
                                    textAlign: "center",
                                    cursor: vars.uploading ? "default" : "pointer",
                                    transition: "background-color 150ms ease, border-color 150ms ease",
                                    "&:active": {
                                        bgcolor: vars.fileError ? "error.100" : "primary.100",
                                    },
                                });

export const EditTaskMobileTypographyTextStyle33 = { mb: 1.25, fontWeight: 600, overflowWrap: "anywhere" };

export const EditTaskMobileLinearProgressSurfaceStyle34 = { borderRadius: 5, height: 6 };

export const EditTaskMobileBoxLayoutStyle35 = { display: "flex", flexDirection: "column", alignItems: "center", gap: 1 };

export const EditTaskMobileBoxSurfaceStyle36 = {
                                        width: 42,
                                        height: 42,
                                        display: "grid",
                                        placeItems: "center",
                                        borderRadius: 2,
                                        bgcolor: "background.paper",
} as const;

export const EditTaskMobileBoxSizeStyle37 = { width: 23, height: 23, objectFit: "contain" };

export const EditTaskMobileTypographyTextStyle38 = { fontWeight: 600 };

export const EditTaskMobileTypographyLayoutStyle39 = { display: "block", mt: 1 };

export const EditTaskMobileBoxLayoutStyle40 = { mt: 1.5, display: "flex", flexDirection: "column", gap: 1 };

export const EditTaskMobileBoxSurfaceStyle41 = {
                                p: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2.5,
                                bgcolor: "background.paper",
} as const;

export const EditTaskMobileBoxLayoutStyle42 = {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                                mb: 1.5,
} as const;

export const EditTaskMobileTypographyTextStyle43 = { fontWeight: 700 };

export const EditTaskMobileButtonSurfaceStyle44 = { textTransform: "none", borderRadius: 2 };

export const EditTaskMobileBoxLayoutStyle45 = { display: "flex", flexDirection: "column", gap: 1.25 };

export const EditTaskMobileBoxSurfaceStyle46 = (vars: Record<string, any>) => ({
                                            p: 1.5,
                                            border: "1px solid",
                                            borderColor: vars.isDone ? "success.200" : "divider",
                                            borderRadius: 2.5,
                                            bgcolor: vars.isDone ? "success.50" : "background.paper",
                                            transition: "background-color 150ms ease, border-color 150ms ease",
                                            });

export const EditTaskMobileBoxLayoutStyle47 = {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    gap: 1,
                                                    mb: 1.25,
} as const;

export const EditTaskMobileBoxLayoutStyle48 = { display: "flex", alignItems: "center", gap: 1 };

export const EditTaskMobileBoxSurfaceStyle49 = (vars: Record<string, any>) => ({
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

export const EditTaskMobileChipIconStyle50 = (vars: Record<string, any>) => ({
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

export const EditTaskMobileBoxLayoutStyle51 = { display: "flex", alignItems: "center", gap: 0.5 };

export const EditTaskMobileIconButtonTextStyle52 = {
                                                            color: "text.secondary",
                                                            "&:hover": {
                                                            color: "error.main",
                                                            bgcolor: "error.50",
                                                            },
} as const;

export const EditTaskMobileTextFieldInputStyle53 = {
                                                    "& .MuiOutlinedInput-root": {
                                                    bgcolor: "background.paper",
                                                    },
} as const;

export const EditTaskMobileBoxSurfaceStyle54 = {
                                    p: 2,
                                    borderRadius: 2.5,
                                    bgcolor: "success.50",
                                    border: "1px solid",
                                    borderColor: "success.100",
} as const;

export const EditTaskMobileTypographyTextStyle55 = { fontWeight: 600, mb: 1 };

export const EditTaskMobileButtonTextStyle56 = { textTransform: "none" };

export const EditTaskMobileBoxSurfaceStyle57 = {
                        display: "flex",
                        width: "100%",
                        gap: 1.25,
                        p: 1,
                        bgcolor: "background.paper",
                        borderTop: "1px solid",
                        borderColor: "divider",
} as const;

export const EditTaskMobileButtonSurfaceStyle58 = {
                                minHeight: 46,
                                px: 2,
                                borderRadius: 2,
                                borderColor: "divider",
                                color: "text.secondary",
                                textTransform: "none",
                                fontWeight: 600,
} as const;

export const EditTaskMobileButtonSurfaceStyle59 = {
                            minHeight: 46,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 700,
                            boxShadow: "none",
} as const;
