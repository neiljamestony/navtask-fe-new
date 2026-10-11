export const DesktopTodoButtonSurfaceStyle1 = {
                        minHeight: 38,
                        px: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        "&.Mui-disabled": {
                        color: "text.disabled",
                        },
} as const;

export const DesktopTodoBoxLayoutStyle2 = { display: "flex", alignItems: "center", gap: 1 };

export const DesktopTodoTypographyTextStyle3 = (vars: Record<string, any>) => ({
                        pl: vars.dueDate === "" ? 10 : 0,
                        fontWeight: "bold",
                        pt: vars.dueDate === "" ? 2 : 0,
                    });

export const DesktopTodoBoxSizeStyle4 = { display: "flex", flexDirection: "column", justifyContent: "center", lineHeight: 1.3 };

export const DesktopTodoTypographyTextStyle5 = { color: "text.primary" };

export const DesktopTodoTypographySurfaceStyle6 = (vars: Record<string, any>) => ({
                        color: vars.color,
                        bgcolor: vars.backgroundColor,
                        fontWeight: 600,
                        borderRadius: 1,
                        px: 0.75,
                        py: 0.25,
                        mt: 0.25,
                        width: "fit-content",
                        });

export const DesktopTodoChipSurfaceStyle7 = (vars: Record<string, any>) => ({ backgroundColor: vars.p.bgColor, color: vars.p.color, fontSize: 12 });

export const DesktopTodoBoxLayoutStyle8 = { display: "flex", justifyContent: 'center', alignItems: 'center', gap: 1, paddingLeft: 5 };

export const DesktopTodoBoxLayoutStyle9 = { display: "flex", justifyContent: 'center', alignItems: 'center', gap: 1 };

export const DesktopTodoBoxLayoutStyle10 = { display: 'flex', alignItems: 'center' };

export const DesktopTodoBoxLayoutStyle11 = { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: 1 };

export const DesktopTodoTypographySizeStyle12 = { lineHeight: 1.2 };

export const DesktopTodoTypographyTextStyle13 = { lineHeight: 1.2, color: '#818D99' };

export const DesktopTodoChipSurfaceStyle14 = (vars: Record<string, any>) => ({ backgroundColor: vars.p.bgColor, color: vars.p.color, fontSize: 12 });

export const DesktopTodoBoxLayoutStyle15 = { display: "flex", justifyContent: "center", alignItems: 'center', paddingTop: 1 };

export const DesktopTodoCardSurfaceStyle16 = { padding: 2, borderRadius: 5, height: "83vh" };

export const DesktopTodoBoxLayoutStyle17 = { display: "flex", justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 };

export const DesktopTodoBoxLayoutStyle18 = { display: "flex", justifyContent: 'center', alignItems: 'start', gap: 1 };

export const DesktopTodoTypographyTextStyle19 = { fontSize: 14 };

export const DesktopTodoButtonSurfaceStyle20 = { textTransform: 'none', borderRadius: 3, backgroundColor: 'black' };

export const DesktopTodoDividerSpacingStyle21 = { marginBottom: 2};

export const DesktopTodoGridSizeStyle22 = { width: "100%", minWidth: 0 };

export const DesktopTodoBoxSpacingStyle23 = { mb: 1.5 };

export const DesktopTodoBoxLayoutStyle24 = (vars: Record<string, any>) => ({ display: "flex", alignItems: "center", gap: 1, mb: vars.openFilters ? 1 : 0 });

export const DesktopTodoButtonSurfaceStyle25 = (vars: Record<string, any>) => ({ textTransform: "none", border: '1px solid black', borderRadius: 2.5, backgroundColor: vars.openFilters ? "black" : "transparent", color: vars.openFilters ? "white" : "text.primary", "&:hover": { backgroundColor: vars.openFilters ? "black" : "transparent" } });

export const DesktopTodoPaperSurfaceStyle26 = { p: 1.5, borderRadius: 2.5, bgcolor: "#fbfcfe" };

export const DesktopTodoStackLayoutStyle27 = { flexWrap: "wrap" };

export const DesktopTodoBoxSizeStyle28 = { flex: "1 1 420px", minWidth: 0 };

export const DesktopTodoBoxSizeStyle29 = { flex: "1 1 320px", minWidth: 0 };

export const DesktopTodoBoxSurfaceStyle30 = {
                                            width: "97%",
                                            mx: "auto",
                                            minHeight: 220,
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 2,
                                            p: { xs: 2, sm: 3 },
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: 3,
                                            bgcolor: "background.paper",
} as const;

export const DesktopTodoBoxTextStyle31 = { textAlign: "center" };

export const DesktopTodoTypographyTextStyle32 = { fontWeight: 700 };

export const DesktopTodoBoxLayoutStyle33 = { display: "flex", gap: 0.75, mt: 0.5 };

export const DesktopTodoBoxSurfaceStyle34 = (vars: Record<string, any>) => ({
                                                width: 7,
                                                height: 7,
                                                borderRadius: "50%",
                                                bgcolor: "primary.main",
                                                animation: "loadingDot 1s ease-in-out infinite",
                                                animationDelay: `${vars.dot * 150}ms`,
                                                "@keyframes loadingDot": {
                                                    "0%, 60%, 100%": { opacity: 0.3, transform: "scale(0.8)" },
                                                    "30%": { opacity: 1, transform: "scale(1)" },
                                                },
                                                });

export const DesktopTodoBoxSurfaceStyle35 = {
                                                        minHeight: 240,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        gap: 1.5,
                                                        px: 3,
                                                        py: 4,
                                                        border: "1px dashed",
                                                        borderColor: "divider",
                                                        borderRadius: 3,
                                                        bgcolor: "grey.50",
                                                        textAlign: "center",
} as const;

export const DesktopTodoBoxSurfaceStyle36 = {
                                                        width: 72,
                                                        height: 72,
                                                        display: "grid",
                                                        placeItems: "center",
                                                        borderRadius: "50%",
                                                        bgcolor: "common.white",
                                                        border: "1px solid",
                                                        borderColor: "divider",
} as const;

export const DesktopTodoTypographyTextStyle37 = { fontWeight: 700 };

export const DesktopTodoTypographySpacingStyle38 = { mt: 0.5 };

export const DesktopTodoPaperSurfaceStyle39 = {
                                                        height: "71vh",
                                                        width: "100%",
                                                        overflow: "hidden",
                                                        border: "1px solid",
                                                        borderColor: "divider",
                                                        borderRadius: 3,
                                                        bgcolor: "background.paper",
} as const;

export const DesktopTodoDataGridTitleStyle40 = {
                                                        height: "100%",
                                                        border: 0,
                                                        color: "text.primary",

                                                        "& .MuiDataGrid-columnHeaders": {
                                                            bgcolor: "#f8fafc",
                                                            borderBottom: "1px solid",
                                                            borderColor: "divider",
                                                        },
                                                        "& .MuiDataGrid-columnHeaderTitle": {
                                                            fontWeight: 700,
                                                            fontSize: 13,
                                                            color: "text.secondary",
                                                        },
                                                        "& .MuiDataGrid-cell": {
                                                            borderColor: "divider",
                                                            display: "flex",
                                                            alignItems: "center",
                                                        },
                                                        "& .MuiDataGrid-row": {
                                                            transition: "background-color 120ms ease",
                                                            "&:hover": { bgcolor: "#f8fafc" },
                                                            "&.Mui-selected": {
                                                            bgcolor: "rgba(25, 118, 210, 0.06)",
                                                            "&:hover": { bgcolor: "rgba(25, 118, 210, 0.1)" },
                                                            },
                                                        },
                                                        "& .MuiCheckbox-root.Mui-checked": {
                                                            color: "primary.main",
                                                        },
                                                        "& .MuiDataGrid-row .MuiDataGrid-cellCheckbox .Mui-disabled": {
                                                            visibility: "hidden",
                                                        },
                                                        "& .MuiDataGrid-columnSeparator": {
                                                            color: "divider",
                                                        },
                                                        "& .MuiDataGrid-overlay": {
                                                            bgcolor: "background.paper",
                                                        },
} as const;
