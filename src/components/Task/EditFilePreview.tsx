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
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        minWidth: 0,
        p: 1,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          borderRadius: 1.5,
          bgcolor: "grey.100",
          color: "text.secondary",
        }}
      >
        {isImage ? (
          <Box
            component="img"
            src={url}
            alt={attachment.name}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <FileText size={21} />
        )}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          component={url ? "a" : "span"}
          href={url || undefined}
          target={url ? "_blank" : undefined}
          rel={url ? "noreferrer" : undefined}
          variant="body2"
          title={attachment.name}
          sx={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: url ? "primary.main" : "text.primary",
            fontWeight: 600,
            textDecoration: url ? "none" : "none",
          }}
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
          sx={{ color: "text.secondary" }}
        >
          <Download size={17} />
        </IconButton>
      )}

      <IconButton
        type="button"
        size="small"
        aria-label={`Remove ${attachment.name}`}
        onClick={removeFile}
        sx={{
          color: "text.secondary",
          "&:hover": { color: "error.main", bgcolor: "error.50" },
        }}
      >
        <Trash2 size={17} />
      </IconButton>
    </Box>
  );
}