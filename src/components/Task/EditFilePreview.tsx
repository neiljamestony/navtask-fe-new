import {
  EditFilePreviewBoxSurfaceStyle1,
  EditFilePreviewBoxSurfaceStyle2,
  EditFilePreviewBoxSizeStyle3,
  EditFilePreviewBoxSizeStyle4,
  EditFilePreviewTypographyTextStyle5,
  EditFilePreviewIconButtonTextStyle6,
  EditFilePreviewIconButtonTextStyle7
} from "../Styles/Task/EditFilePreview/EditFilePreview.styles";
import { Box, IconButton, Typography } from "@mui/material";
import { Download, FileText, Trash2 } from "lucide-react";

import FilePreview from "./FilePreview";
import type { AttachmentItem } from "../../typescript/interface";
import { limitText } from "../../utils/utils";

interface AttachmentProps {
  attachment: AttachmentItem | null;
  removeFile: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function EditFilePreview({
  attachment,
  removeFile,
}: AttachmentProps) {
  if (!attachment) return null;

  if (!Object.hasOwn(attachment, "url")) {
    return <FilePreview file={attachment} removeFile={removeFile} />;
  }

  const url = attachment.url ?? "";
  const isImage = attachment.type?.startsWith("image/") && Boolean(url);
  const fileSizeKb = (Number(attachment.size) / 1024).toFixed(1);

  return (
    <Box
      sx={EditFilePreviewBoxSurfaceStyle1}
    >
      <Box
        sx={EditFilePreviewBoxSurfaceStyle2}
      >
        {isImage ? (
          <Box
            component="img"
            src={url}
            alt={attachment.name}
            sx={EditFilePreviewBoxSizeStyle3}
          />
        ) : (
          <FileText size={21} />
        )}
      </Box>

      <Box sx={EditFilePreviewBoxSizeStyle4}>
        <Typography
          component={url ? "a" : "span"}
          href={url || undefined}
          target={url ? "_blank" : undefined}
          rel={url ? "noreferrer" : undefined}
          variant="body2"
          title={attachment.name}
          sx={EditFilePreviewTypographyTextStyle5({ url: url })}
        >
          {limitText(attachment.name)}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {fileSizeKb} KB
        </Typography>
      </Box>

      {url && (
        <IconButton
          component="a"
          href={url}
          target="_blank"
          rel="noreferrer"
          size="small"
          aria-label={`Download ${attachment.name}`}
          sx={EditFilePreviewIconButtonTextStyle6}
        >
          <Download size={17} />
        </IconButton>
      )}

      <IconButton
        type="button"
        size="small"
        aria-label={`Remove ${attachment.name}`}
        onClick={removeFile}
        sx={EditFilePreviewIconButtonTextStyle7}
      >
        <Trash2 size={17} />
      </IconButton>
    </Box>
  );
}