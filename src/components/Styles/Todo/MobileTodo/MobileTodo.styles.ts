export const MobileTodoMenuSurfaceStyle1 = {
                marginTop: 5,
                borderRadius: 20
} as const;

export const MobileTodoMenuItemTextStyle2 = { display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 14 };

export const MobileTodoBoxLayoutStyle3 = { flexGrow: 1 };

export const MobileTodoMenuSurfaceStyle4 = {
                marginTop: 5,
                borderRadius: 20,
                marginLeft: 20
} as const;

export const MobileTodoMenuItemTextStyle5 = { textAlign: 'left', fontSize: 14 };

export const MobileTodoBoxSurfaceStyle6 = {
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 1,
                py: 0.5,
                borderRadius: 10,
                bgcolor: "grey.100",
                color: "text.secondary",
} as const;

export const MobileTodoTypographyTextStyle7 = { fontWeight: 600, lineHeight: 1 };

export const MobileTodoChipTextStyle8 = (vars: Record<string, any>) => ({
                    bgcolor: vars.taskStatus?.bgColor,
                    color: vars.taskStatus?.color,
                    fontWeight: 600,
                });

export const MobileTodoChipTextStyle9 = (vars: Record<string, any>) => ({
                bgcolor: vars.p?.bgColor,
                color: vars.p?.color,
                fontWeight: 600,
            });

export const MobileTodoBoxLayoutStyle10 = { display: "flex", alignItems: 'center', gap: 1 };

export const MobileTodoTypographyTextStyle11 = { paddingLeft: 0, fontWeight: 'bold', textDecoration: 'underline', fontSize: 14 };

export const MobileTodoTypographyTextStyle12 = (vars: Record<string, any>) => ({ paddingLeft: 13.5, fontWeight: 'bold', paddingTop: vars.due_date === "" ? 2 : 0, fontSize: 14 });

export const MobileTodoTypographyTextStyle13 = { color: '#272D32', paddingTop: 1 };

export const MobileTodoBoxLayoutStyle14 = { display: "flex", alignItems: 'center', gap: 0.5 };

export const MobileTodoimgContainerStyle15 = (vars: Record<string, any>) => ({
                                filter: vars.getIconFilter(),
                                transition: 'filter 0.2s ease-in-out'
                            });

export const MobileTodoTypographyTextStyle16 = { color: '#CA0061' };

export const MobileTodoCircleTextStyle17 = { fontSize: 5 };

export const MobileTodoBoxLayoutStyle18 = { display: "flex", alignItems: 'center', gap: 0.5 };

export const MobileTodoimgContainerStyle19 = (vars: Record<string, any>) => ({
                                filter: vars.getIconFilter(),
                                transition: 'filter 0.2s ease-in-out'
                            });

export const MobileTodoTypographyTextStyle20 = { color: '#009292' };

export const MobileTodoCircleTextStyle21 = { fontSize: 5 };

export const MobileTodoBoxLayoutStyle22 = { display: "flex", alignItems: 'center', gap: 0.5 };

export const MobileTodoimgContainerStyle23 = (vars: Record<string, any>) => ({
                                filter: vars.getIconFilter(),
                                transition: 'filter 0.2s ease-in-out'
                            });

export const MobileTodoTypographyTextStyle24 = { color: '#009292' };

export const MobileTodoBoxLayoutStyle25 = { display: "flex", alignItems: 'center', gap: 0.5 };

export const MobileTodoTypographyTextStyle26 = { color: '#272D32' };

export const MobileTodoAppBarSurfaceStyle27 = {
                    top: 0,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    bgcolor: "rgba(255,255,255,0.96)",
                    backdropFilter: "blur(12px)",
} as const;

export const MobileTodoToolbarSizeStyle28 = { minHeight: 64, gap: 1 };

export const MobileTodoTypographyTextStyle29 = { fontWeight: 750, mr: "auto" };

export const MobileTodoIconButtonSurfaceStyle30 = { border: "1px solid", borderColor: "divider", borderRadius: 2 };

export const MobileTodoIconButtonSurfaceStyle31 = (vars: Record<string, any>) => ({
                            border: "1px solid",
                            borderColor:
                            vars.selectedSortOption.sortTitle !== "none" ? "primary.main" : "divider",
                            borderRadius: 2,
                            bgcolor:
                            vars.selectedSortOption.sortTitle !== "none" ? "primary.50" : "background.paper",
                            color:
                            vars.selectedSortOption.sortTitle !== "none" ? "primary.main" : "text.secondary",
                            "&:hover": {
                            bgcolor:
                                vars.selectedSortOption.sortTitle !== "none" ? "primary.100" : "action.hover",
                            },
                        });

export const MobileTodoBadgeSpacingStyle32 = {
                            "& .MuiBadge-badge": {
                                bgcolor: "primary.main",
                                boxShadow: "0 0 0 2px white",
                            },
} as const;

export const MobileTodoBoxLayoutStyle33 = {
                        display: "flex",
                        gap: 1,
                        px: 2,
                        pb: 1.25,
                        overflowX: "auto",
} as const;

export const MobileTodoBoxSpacingStyle34 = (vars: Record<string, any>) => ({
                    px: 2,
                    pt: vars.filteredPriorityItems || vars.filteredStatusItems ? 13 : 10,
                    pb: 12,
                });

export const MobileTodoBoxSizeStyle35 = {
                    width: "100%",
                    minHeight: "50dvh",
                    boxSizing: "border-box",
                    pt: "64px",
                    px: 2,
                    display: "flex",
                    alignItems: "center",
} as const;

export const MobileTodoBoxTextStyle36 = {
                        minHeight: "55vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        px: 3,
                        textAlign: "center",
} as const;

export const MobileTodoBoxSurfaceStyle37 = {
                    width: 64,
                    height: 64,
                    mb: 2,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 3,
                    bgcolor: "grey.100",
                    color: "text.secondary",
} as const;

export const MobileTodoCircleTextStyle38 = { fontSize: 18 };

export const MobileTodoTypographyTextStyle39 = { fontWeight: 700 };

export const MobileTodoTypographySpacingStyle40 = { mt: 0.5 };

export const MobileTodoBoxLayoutStyle41 = { display: "flex", flexDirection: "column", gap: 1.5 };

export const MobileTodoBoxSurfaceStyle42 = (vars: Record<string, any>) => ({
                                p: 1.75,
                                border: "1px solid",
                                borderColor: vars.isSelected ? "primary.light" : "divider",
                                borderRadius: 2.5,
                                bgcolor: vars.isSelected ? "rgba(25,118,210,0.035)" : "background.paper",
                                boxShadow: "0 2px 8px rgba(15,23,42,0.035)",
                                });

export const MobileTodoBoxLayoutStyle43 = {
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                    gap: 1,
} as const;

export const MobileTodoBoxSizeStyle44 = { minWidth: 0, flex: 1 };

export const MobileTodoBoxLayoutStyle45 = { display: "flex", alignItems: "center", gap: 1.25, mb: 1 };

export const MobileTodoBoxLayoutStyle46 = { display: "flex", alignItems: "center" };

export const MobileTodoBoxSizeStyle47 = { minWidth: 0 };

export const MobileTodoBoxSpacingStyle48 = { "& .MuiTypography-root": { fontSize: 15 } };

export const MobileTodoBoxSpacingStyle49 = { mt: 1 };

export const MobileTodoCheckboxSpacingStyle50 = { p: 0.5, mt: -0.5 };

export const MobileTodoIconButtonSurfaceStyle51 = (vars: Record<string, any>) => ({
                            borderRadius: 2,
                            color: vars.ids.length ? "error.main" : "text.disabled",
                        });

export const MobileTodoIconButtonTextStyle52 = {
                    width: 44,
                    height: 44,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": { bgcolor: "primary.dark" },
} as const;
