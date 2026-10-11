export const DesktopRegistrationBoxImageStyle1 = {
        minHeight: "100dvh",
        boxSizing: "border-box",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 2,
        bgcolor: "#f4f7fb",
        backgroundImage:
          "radial-gradient(circle at 15% 15%, rgba(25,118,210,0.10), transparent 30%), radial-gradient(circle at 85% 85%, rgba(25,118,210,0.08), transparent 32%)",
} as const;

export const DesktopRegistrationCardSurfaceStyle2 = {
          width: "100%",
          maxWidth: 440,
          border: "1px solid",
          borderColor: "rgba(15, 23, 42, 0.08)",
          borderRadius: 4,
          boxShadow: "0 18px 55px rgba(15, 23, 42, 0.08)",
} as const;

export const DesktopRegistrationCardContentSpacingStyle3 = { p: { xs: 3, sm: 4 } };

export const DesktopRegistrationBoxSpacingStyle4 = { mb: 3 };

export const DesktopRegistrationTypographyTextStyle5 = { fontWeight: 750, letterSpacing: -0.5 };

export const DesktopRegistrationTypographySpacingStyle6 = { mt: 0.75 };

export const DesktopRegistrationBoxLayoutStyle7 = { display: "flex", flexDirection: "column" };

export const DesktopRegistrationBoxSizeStyle8 = { width: 20, height: 20, objectFit: "contain" };

export const DesktopRegistrationBoxSurfaceStyle9 = {
                  mt: -0.5,
                  p: 1.5,
                  mb: 1,
                  borderRadius: 2,
                  bgcolor: "#f8fafc",
                  border: "1px solid",
                  borderColor: "divider",
} as const;

export const DesktopRegistrationBoxLayoutStyle10 = {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
} as const;

export const DesktopRegistrationTypographyTextStyle11 = { fontWeight: 600 };

export const DesktopRegistrationTypographyTextStyle12 = (vars: Record<string, any>) => ({
                      fontWeight: 700,
                      color: vars.isPasswordStrong ? "success.main" : "text.secondary",
                    });

export const DesktopRegistrationBoxLayoutStyle13 = { display: "flex", flexDirection: "column", gap: 0.75 };

export const DesktopRegistrationBoxLayoutStyle14 = { display: "flex", alignItems: "center", gap: 1 };

export const DesktopRegistrationCheckTextStyle15 = { fontSize: 16, color: "success.main" };

export const DesktopRegistrationCircleTextStyle16 = { fontSize: 8, color: "text.disabled" };

export const DesktopRegistrationButtonSurfaceStyle17 = {
                minHeight: 48,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                fontSize: 15,
                boxShadow: "none",
} as const;

export const DesktopRegistrationTypographyTextStyle18 = { mt: 2.5, mb: 2, textAlign: "center", color: "text.secondary" };

export const DesktopRegistrationBoxTextStyle19 = {
                color: "primary.main",
                fontWeight: 700,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
} as const;
