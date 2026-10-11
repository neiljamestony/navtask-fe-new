export const DesktopLoginBoxImageStyle1 = {
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

export const DesktopLoginCardSurfaceStyle2 = {
          width: "100%",
          maxWidth: 420,
          border: "1px solid",
          borderColor: "rgba(15, 23, 42, 0.08)",
          borderRadius: 4,
          boxShadow: "0 18px 55px rgba(15, 23, 42, 0.08)",
} as const;

export const DesktopLoginCardContentSpacingStyle3 = { p: { xs: 3, sm: 4 } };

export const DesktopLoginBoxSpacingStyle4 = { mb: 3 };

export const DesktopLoginBoxSurfaceStyle5 = {
                  mb: 2.5,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "success.50",
                  color: "success.dark",
} as const;

export const DesktopLoginTypographyTextStyle6 = { fontWeight: 600 };

export const DesktopLoginTypographyTextStyle7 = { fontWeight: 750, letterSpacing: -0.5 };

export const DesktopLoginTypographySpacingStyle8 = { mt: 0.75 };

export const DesktopLoginBoxLayoutStyle9 = { display: "flex", flexDirection: "column" };

export const DesktopLoginButtonSurfaceStyle10 = {
                minHeight: 48,
                mt: 0.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                fontSize: 15,
                boxShadow: "none",
} as const;

export const DesktopLoginTypographyTextStyle11 = { mt: 2.5, textAlign: "center", color: "text.secondary" };

export const DesktopLoginBoxTextStyle12 = {
                color: "primary.main",
                fontWeight: 700,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
} as const;
