import {
  AttachmentsBoxSpacingStyle1,
  AttachmentsBoxGridStyle2,
  AttachmentsBoxSizeStyle3,
  AttachmentsBoxImageStyle4,
  AttachmentsBoxSizeStyle5,
  AttachmentsBoxSurfaceStyle6,
  AttachmentsTypographyTextStyle7,
  AttachmentsDialogDialogStyle8,
  AttachmentsIconButtonTextStyle9,
  AttachmentsBoxSizeStyle10,
  AttachmentsEmptyStateContainerStyle
} from "../Styles/Task/Attachments/Attachments.styles";
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
    <Box sx={AttachmentsBoxSpacingStyle1}>
      {attachments.length > 0 ? (
        <Box
          sx={AttachmentsBoxGridStyle2}
        >
          {attachments.map((item, index) => (
            <Box key={`${item.name}-${index}`} sx={AttachmentsBoxSizeStyle3}>
              {item.url ? (
                <Box
                  component="button"
                  type="button"
                  onClick={() => setPreview(item)}
                  aria-label={`Preview ${item.name}`}
                  sx={AttachmentsBoxImageStyle4}
                >
                  <Box
                    component="img"
                    src={item.url}
                    alt={item.name}
                    sx={AttachmentsBoxSizeStyle5}
                  />
                </Box>
              ) : (
                <Box
                  sx={AttachmentsBoxSurfaceStyle6}
                >
                  <Typography variant="caption">
                    Preview unavailable
                  </Typography>
                </Box>
              )}

              <Typography
                variant="body2"
                title={item.name}
                sx={AttachmentsTypographyTextStyle7}
              >
                {item.name}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={AttachmentsEmptyStateContainerStyle}>
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
        sx={AttachmentsDialogDialogStyle8}
      >
        <IconButton
          aria-label="Close preview"
          onClick={() => setPreview(null)}
          sx={AttachmentsIconButtonTextStyle9}
        >
          <CloseIcon />
        </IconButton>

        {preview?.url && (
          <Box
            component="img"
            src={preview.url}
            alt={preview.name}
            sx={AttachmentsBoxSizeStyle10}
          />
        )}
      </Dialog>
    </Box>
  );
}
