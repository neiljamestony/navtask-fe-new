import { Box, Typography, IconButton } from "@mui/material"
import { HighlightOffRounded } from '@mui/icons-material'
import FilePreview from "./FilePreview";

import type { AttachmentItem } from "../../typescript/interface";
import { limitText } from "../../utils/utils";

interface Attachment {
    attachment: AttachmentItem | null;
    removeFile: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function EditFilePreview({ attachment, removeFile } : Attachment){
    const handleFileDownload = async (url: string) => window.location.href = url
    

    if(attachment){
        if(Object.hasOwn(attachment, 'url')){
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
                    {attachment?.type?.startsWith("image/") && (
                        <Box sx={{ display: "block", marginBottom: 1 }}>
                            <img src={attachment?.url} alt={attachment.name} 
                                style={{
                                    width: 100,
                                    height: 100,
                                    objectFit: "contain"
                                }}
                            />
                        </Box>
                    )}

                    <Typography sx={{ fontFamily: "Roboto", fontSize: 13, textDecoration: "underline", color: "#62C6FF", cursor: "pointer" }} onClick={() => handleFileDownload(attachment?.url ?? "")}>
                        {limitText(attachment?.name)}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', fontFamily: 'Roboto', fontSize: 12, color: 'grey.600' }}>
                        {(Number(attachment?.size) / 1024).toFixed(1)} KB
                    </Typography>
                </Box>
            )
        }else{
            return <FilePreview file={attachment} removeFile={removeFile}/>
        }
    }
}