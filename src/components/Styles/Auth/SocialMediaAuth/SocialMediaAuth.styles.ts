export const SocialMediaAuthBoxLayoutStyle1 = { display: "flex", flexDirection: "column", gap: 1.25 };

export const SocialMediaAuthDividerSpacingStyle2 = { mb: 0.5 };

export const SocialMediaAuthTypographyTextStyle3 = {
            px: 1,
            color: "text.secondary",
            fontWeight: 600,
            letterSpacing: 0.5,
} as const;

export const SocialMediaAuthBoxSizeStyle4 = { width: 18, height: 18, objectFit: "contain" };

export const SocialMediaAuthButtonSurfaceStyle5 = {
              minHeight: 46,
              borderColor: "divider",
              borderRadius: 2,
              color: "text.primary",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                borderColor: "text.secondary",
                bgcolor: "action.hover",
              },
} as const;
