import { useEffect, useMemo } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { FileText, X } from "lucide-react";

import type { AttachmentItem } from "../../typescript/interface";
import { limitText } from "../../utils/utils";
interface FilePreviewProps {
  file: AttachmentItem | null;
  removeFile?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function FilePreview({ file, removeFile }: FilePreviewProps) {
  const fileUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file]
  );

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  if (!file) return null;

  const isImage = file.type?.startsWith("image/");
  const sizeInKb = (file.size / 1024).toFixed(1);

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
        component="a"
        href={fileUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Preview ${file.name}`}
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
            src={fileUrl}
            alt={file.name}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <FileText size={21} />
        )}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          component="a"
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          variant="body2"
          title={file.name}
          sx={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "text.primary",
            fontWeight: 600,
            textDecoration: "none",
            "&:hover": { color: "primary.main" },
          }}
        >
          {limitText(file.name)}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {sizeInKb} KB
        </Typography>
      </Box>

      {removeFile && (
        <IconButton
          type="button"
          size="small"
          aria-label={`Remove ${file.name}`}
          onClick={removeFile}
          sx={{
            flexShrink: 0,
            color: "text.secondary",
            "&:hover": { color: "error.main", bgcolor: "error.50" },
          }}
        >
          <X size={17} />
        </IconButton>
      )}
    </Box>
  );
}