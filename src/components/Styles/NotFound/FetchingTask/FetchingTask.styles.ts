export const FetchingTaskBoxSurfaceStyle1 = {
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        mx: "auto",
        minHeight: { xs: 180, sm: 220 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 1.5, sm: 2 },
        p: { xs: 2, sm: 3 },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: { xs: 2, sm: 3 },
        bgcolor: "background.paper",
} as const;

export const FetchingTaskBoxTextStyle2 = { textAlign: "center" };

export const FetchingTaskTypographyTextStyle3 = { fontWeight: 700 };

export const FetchingTaskBoxLayoutStyle4 = { display: "flex", gap: 0.75, mt: 0.25 };

export const FetchingTaskBoxSurfaceStyle5 = (vars: Record<string, any>) => ({
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
