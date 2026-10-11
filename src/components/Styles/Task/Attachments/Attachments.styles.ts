export const AttachmentsBoxSpacingStyle1 = { ml: 1, mt: 1 };

export const AttachmentsBoxGridStyle2 = {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 2,
} as const;

export const AttachmentsBoxSizeStyle3 = { minWidth: 0 };

export const AttachmentsBoxImageStyle4 = {
                    display: "block",
                    width: "100%",
                    p: 0,
                    border: 0,
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "grey.100",
                    cursor: "pointer",
                    "&:hover img": { transform: "scale(1.04)" },
                    "&:focus-visible": {
                      outline: "2px solid",
                      outlineColor: "primary.main",
                      outlineOffset: 2,
                    },
} as const;

export const AttachmentsBoxSizeStyle5 = {
                      display: "block",
                      width: "100%",
                      height: 140,
                      objectFit: "cover",
                      transition: "transform 160ms ease",
} as const;

export const AttachmentsBoxSurfaceStyle6 = {
                    height: 140,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 2,
                    bgcolor: "grey.100",
                    color: "text.secondary",
} as const;

export const AttachmentsTypographyTextStyle7 = {
                  mt: 0.75,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
} as const;

export const AttachmentsDialogDialogStyle8 = {
          "& .MuiDialog-paper": {
            position: "relative",
            m: 2,
            p: 1,
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "grey.900",
          },
} as const;

export const AttachmentsIconButtonTextStyle9 = {
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 1,
            color: "common.white",
            bgcolor: "rgba(0, 0, 0, 0.55)",
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.75)" },
} as const;

export const AttachmentsBoxSizeStyle10 = {
              display: "block",
              maxWidth: "min(90vw, 1100px)",
              maxHeight: "85vh",
              objectFit: "contain",
} as const;

export const AttachmentsEmptyStateContainerStyle = {
  py: 3,
  px: 2,
  textAlign: "center",
  border: "1px dashed",
  borderColor: "divider",
  borderRadius: 2,
  bgcolor: "grey.50",
} as const;
