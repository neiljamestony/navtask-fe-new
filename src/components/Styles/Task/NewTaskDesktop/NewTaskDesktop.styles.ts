export const NewTaskDesktopBoxTextStyle1 = { minHeight: "100vh", bgcolor: "#f6f8fb", pb: 12 };

export const NewTaskDesktopBoxSizeStyle2 = {
            width: "100%",
            maxWidth: 1180,
            boxSizing: "border-box",
            mx: "auto",
            px: { xs: 2, sm: 3, lg: 4 },
            pt: { xs: 2, sm: 3, md: 3 },
} as const;

export const NewTaskDesktopBoxLayoutStyle3 = { display: "flex", alignItems: "center", gap: 2, mb: 3 };

export const NewTaskDesktopIconButtonSurfaceStyle4 = { bgcolor: "white", border: "1px solid", borderColor: "divider" };

export const NewTaskDesktopTypographyTextStyle5 = { fontWeight: 700, color: "#17212b" };

export const NewTaskDesktopPaperSurfaceStyle6 = {
              border: "1px solid",
              borderColor: "#e6eaf0",
              borderRadius: 3,
              overflow: "hidden",
} as const;

export const NewTaskDesktopBoxSpacingStyle7 = { p: { xs: 2, sm: 3, lg: 4 } };

export const NewTaskDesktopTypographyTextStyle8 = { fontWeight: 700 };

export const NewTaskDesktopTypographySpacingStyle9 = { mb: 1 };

export const NewTaskDesktopTextFieldInputStyle10 = {
                      "& .MuiInputBase-input": {
                        fontSize: 18,
                        fontWeight: 600,
                      },
} as const;

export const NewTaskDesktopGridLayoutStyle11 = { alignItems: "flex-start" };

export const NewTaskDesktopGridSpacingStyle12 = { mt: 1 };

export const NewTaskDesktopTypographyTextStyle13 = { fontWeight: 700 };

export const NewTaskDesktopTypographySpacingStyle14 = { mb: 1 };

export const NewTaskDesktopGridSpacingStyle15 = { mt: 1 };

export const NewTaskDesktopBoxSpacingStyle16 = { mb: 1 };

export const NewTaskDesktopTypographyTextStyle17 = { fontWeight: 700 };

export const NewTaskDesktopBoxSurfaceStyle18 = (vars: Record<string, any>) => ({
                              position: "relative",
                              p: 2,
                              border: "1.5px dashed",
                              borderColor: vars.fileError ? "error.main" : "#cbd5e1",
                              borderRadius: 2,
                              bgcolor: "#fafcff",
                              cursor: vars.uploading ? "default" : "pointer",
                              transition: "border-color 150ms ease, background-color 150ms ease",
                              "&:hover": {
                                borderColor: vars.fileError ? "error.main" : "primary.main",
                                bgcolor: "#f3f8ff",
                              },
                            });

export const NewTaskDesktopBoxSurfaceStyle19 = {
                                  width: "100%",
                                  maxWidth: 480,
                                  mx: "auto",
                                  p: 2,
                                  border: "1px solid",
                                  borderColor: "primary.light",
                                  borderRadius: 2.5,
                                  bgcolor: "background.paper",
                                  textAlign: "left",
} as const;

export const NewTaskDesktopBoxSurfaceStyle20 = {
                                    p: 2,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 3,
                                    bgcolor: "background.paper",
} as const;

export const NewTaskDesktopBoxLayoutStyle21 = { display: "flex", alignItems: "center", gap: 1.5 };

export const NewTaskDesktopBoxSurfaceStyle22 = {
                                        width: 44,
                                        height: 44,
                                        flexShrink: 0,
                                        display: "grid",
                                        placeItems: "center",
                                        borderRadius: 2.5,
                                        bgcolor: "primary.50",
                                        color: "primary.main",
} as const;

export const NewTaskDesktopBoxSizeStyle23 = { flex: 1, minWidth: 0 };

export const NewTaskDesktopTypographyTextStyle24 = { fontWeight: 700 };

export const NewTaskDesktopTypographyTextStyle25 = {
                                          display: "block",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                          mt: 0.25,
} as const;

export const NewTaskDesktopTypographyTextStyle26 = { fontWeight: 700, fontVariantNumeric: "tabular-nums" };

export const NewTaskDesktopBoxSurfaceStyle27 = {
                                      mt: 1.75,
                                      height: 6,
                                      overflow: "hidden",
                                      borderRadius: 999,
                                      bgcolor: "action.hover",
} as const;

export const NewTaskDesktopBoxSurfaceStyle28 = (vars: Record<string, any>) => ({
                                        width: `${Math.min(100, Math.max(0, vars.progress))}%`,
                                        height: "100%",
                                        borderRadius: "inherit",
                                        bgcolor: "primary.main",
                                        transition: "width 250ms ease",
                                      });

export const NewTaskDesktopLinearProgressSurfaceStyle29 = { height: 7, borderRadius: 999 };

export const NewTaskDesktopBoxLayoutStyle30 = {
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: 1,
                                  py: 1,
} as const;

export const NewTaskDesktopBoxSizeStyle31 = { width: 34, height: 34, objectFit: "contain" };

export const NewTaskDesktopTypographyTextStyle32 = { textAlign: "center" };

export const NewTaskDesktopBoxTextStyle33 = { color: "primary.main", fontWeight: 700 };

export const NewTaskDesktopBoxLayoutStyle34 = {
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1.5,
                                  mt: 2,
} as const;

export const NewTaskDesktopTypographyLayoutStyle35 = { display: "block", mt: 1 };

export const NewTaskDesktopPaperSurfaceStyle36 = { p: { xs: 2, sm: 2.5 }, borderRadius: 2.5, bgcolor: "#fbfcfe" };

export const NewTaskDesktopTypographyTextStyle37 = { fontWeight: 700, mb: 0.5 };

export const NewTaskDesktopTypographySpacingStyle38 = { mb: 2 };

export const NewTaskDesktopGridSpacingStyle39 = { mt: 1 };

export const NewTaskDesktopTypographyTextStyle40 = { fontWeight: 700 };

export const NewTaskDesktopGridSpacingStyle41 = { mt: 1 };

export const NewTaskDesktopBoxLayoutStyle42 = {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
} as const;

export const NewTaskDesktopTypographyTextStyle43 = { fontWeight: 700 };

export const NewTaskDesktopButtonSurfaceStyle44 = { textTransform: "none", borderRadius: 2, flexShrink: 0 };

export const NewTaskDesktopBoxSurfaceStyle45 = {
                          p: 2,
                          border: "1px dashed",
                          borderColor: "divider",
                          borderRadius: 2,
                          textAlign: "center",
                          bgcolor: "#fafcff",
} as const;

export const NewTaskDesktopBoxSizeStyle46 = { display: "flex", flexDirection: "column", gap: 1, width: '100%' };

export const NewTaskDesktopBoxSizeStyle47 = { width: "100%", boxSizing: "border-box" };

export const NewTaskDesktopBoxSizeStyle48 = {
                              width: "100%",
                              boxSizing: "border-box" };

export const NewTaskDesktopBoxGridStyle49 = (vars: Record<string, any>) => ({
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

export const NewTaskDesktopBoxSurfaceStyle50 = (vars: Record<string, any>) => ({
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

export const NewTaskDesktopTextFieldInputStyle51 = {
                                  "& .MuiInputBase-root": {
                                    px: 1.25,
                                    py: 0.75,
                                    borderRadius: 1.5,
                                    bgcolor: "grey.50",
                                  },
                                  "& .MuiInputLabel-root": { display: "none" },
} as const;

export const NewTaskDesktopTextFieldGridStyle52 = {
                                  gridColumn: { xs: "2", sm: "auto" },
                                  gridRow: { xs: "2", sm: "auto" },
} as const;

export const NewTaskDesktopTypographyTextStyle53 = { fontSize: 13 };

export const NewTaskDesktopBoxSurfaceStyle54 = {
                display: "flex",
                justifyContent: "flex-end",
                gap: 1.5,
                px: { xs: 2, sm: 3, lg: 4 },
                py: { xs: 1.5, sm: 2 },
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: "#fcfdff",
} as const;

export const NewTaskDesktopButtonSurfaceStyle55 = { textTransform: "none", borderRadius: 2, px: 3 };

export const NewTaskDesktopButtonSurfaceStyle56 = { textTransform: "none", borderRadius: 2, px: 3, fontWeight: 700 };
