import {
  FilePreviewBoxSurfaceStyle1,
  FilePreviewBoxSurfaceStyle2,
  FilePreviewBoxSizeStyle3,
  FilePreviewBoxSizeStyle4,
  FilePreviewTypographyTextStyle5,
  FilePreviewIconButtonTextStyle6
} from "../Styles/Task/FilePreview/FilePreview.styles";
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
      sx={FilePreviewBoxSurfaceStyle1}
    >
      <Box
        component="a"
        href={fileUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Preview ${file.name}`}
        sx={FilePreviewBoxSurfaceStyle2}
      >
        {isImage ? (
          <Box
            component="img"
            src={fileUrl}
            alt={file.name}
            sx={FilePreviewBoxSizeStyle3}
          />
        ) : (
          <FileText size={21} />
        )}
      </Box>

      <Box sx={FilePreviewBoxSizeStyle4}>
        <Typography
          component="a"
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          variant="body2"
          title={file.name}
          sx={FilePreviewTypographyTextStyle5}
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
          sx={FilePreviewIconButtonTextStyle6}
        >
          <X size={17} />
        </IconButton>
      )}
    </Box>
  );
}