import { Box, Typography, IconButton } from "@mui/material";
import { HighlightOffRounded } from '@mui/icons-material'

import type { AttachmentItem } from "../../typescript/interface";
import { limitText } from "../../utils/utils";
interface FilePreviewProps {
    file: AttachmentItem | null,
    removeFile?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function FilePreview({ file, removeFile }: FilePreviewProps){
    const fileUrl = file ? URL.createObjectURL(file) : "";

    const handleViewFile = (url: string) => window.location.href = url;

    return (
        <Box sx={{ position: 'relative', display: "block", paddingLeft: 3, paddingBottom: 2, paddingTop: 2 }}>
        <IconButton 
            type="button" 
            sx={{ 
                position: "absolute",
                top: 4,
                right: 4,
                padding: 0, 
                color: "text.secondary",
                zIndex: 1
            }} 
            onClick={removeFile}
        >
            <HighlightOffRounded sx={{ fontSize: 18 }} />
        </IconButton>
        {file?.type?.startsWith("image/") && (
            <Box sx={{ display: "block", marginBottom: 1 }}>
                <img 
                    src={fileUrl} 
                    alt={file.name} 
                    style={{
                        width: 100,
                        height: 100,
                        objectFit: "contain"
                    }}
                />
            </Box>
        )}
        <Typography sx={{ fontFamily: "Roboto", fontSize: 13, textDecoration: "underline", color: "#62C6FF", cursor: "pointer" }}
            onClick={() => handleViewFile(fileUrl)}
        >
            {limitText(file?.name ?? "")}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', fontFamily: 'Roboto', fontSize: 12, color: 'grey.600' }}>
            {(Number(file?.size) / 1024).toFixed(1)} KB
        </Typography>
    </Box>
    )
}