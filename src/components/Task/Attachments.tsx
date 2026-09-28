import { useState } from "react";
import { Box, Dialog, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Paperclip } from "lucide-react";

type Attachment = {
  name: string;
  url?: string;
};

export default function Attachments({
  attachments,
}: {
  attachments: Attachment[];
}) {
  const [preview, setPreview] = useState<Attachment | null>(null);

  return (
    <Box sx={{ ml: 1, mt: 1 }}>
      {attachments.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 2,
          }}
        >
          {attachments.map((item, index) => (
            <Box key={`${item.name}-${index}`} sx={{ minWidth: 0 }}>
              {item.url ? (
                <Box
                  component="button"
                  type="button"
                  onClick={() => setPreview(item)}
                  aria-label={`Preview ${item.name}`}
                  sx={{
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
                  }}
                >
                  <Box
                    component="img"
                    src={item.url}
                    alt={item.name}
                    sx={{
                      display: "block",
                      width: "100%",
                      height: 140,
                      objectFit: "cover",
                      transition: "transform 160ms ease",
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    height: 140,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 2,
                    bgcolor: "grey.100",
                    color: "text.secondary",
                  }}
                >
                  <Typography variant="caption">
                    Preview unavailable
                  </Typography>
                </Box>
              )}

              <Typography
                variant="body2"
                title={item.name}
                sx={{
                  mt: 0.75,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.name}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Box
           sx={{
            py: 3,
            px: 2,
            textAlign: "center",
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "grey.50",
          }}
        >
          <Paperclip size={22} color="#9e9e9e" />
          <Typography variant="body2" color="text.secondary">
            No attachments yet
          </Typography>
        </Box>
      )}

      <Dialog
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        maxWidth="lg"
        sx={{
          "& .MuiDialog-paper": {
            position: "relative",
            m: 2,
            p: 1,
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "grey.900",
          },
        }}
      >
        <IconButton
          aria-label="Close preview"
          onClick={() => setPreview(null)}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 1,
            color: "common.white",
            bgcolor: "rgba(0, 0, 0, 0.55)",
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.75)" },
          }}
        >
          <CloseIcon />
        </IconButton>

        {preview?.url && (
          <Box
            component="img"
            src={preview.url}
            alt={preview.name}
            sx={{
              display: "block",
              maxWidth: "min(90vw, 1100px)",
              maxHeight: "85vh",
              objectFit: "contain",
            }}
          />
        )}
      </Dialog>
    </Box>
  );
}