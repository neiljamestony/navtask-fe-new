import { Box, Typography, IconButton } from "@mui/material";
import { HighlightOffRounded } from '@mui/icons-material'

import type { AttachmentItem } from "../../typescript/interface";
interface FilePreviewProps {
    file: AttachmentItem | null,
    removeFile?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function FilePreview({ file, removeFile }: FilePreviewProps){
    const fileUrl = file ? URL.createObjectURL(file) : "";

    const handleViewFile = (url: string) => window.location.href = url;
    
    if(file?.type.startsWith("image/")){
        return (
            <>
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
                        {file?.name}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', fontFamily: 'Roboto', fontSize: 12, color: 'grey.600' }}>
                        {(Number(file?.size) / 1024).toFixed(1)} KB
                    </Typography>
                </Box>
            </>
        )
    }

    if(file?.type === "application/pdf"){
        return <Box sx={{ display: "block", justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
            <Box sx={{  
                position: "absolute",
                top: -9,
                right: 12,
                backgroundColor: "#fff",
                px: 1,
                fontSize: 12,
                fontFamily: "Roboto",
                fontWeight: "bold",
                color: "text.secondary"}}>
                <IconButton type="button" sx={{ padding: 0 }} onClick={removeFile}><HighlightOffRounded sx={{ fontSize: 18 }}/></IconButton>
            </Box>
                <iframe
                    src={fileUrl}
                    title={file.name}
                    width="200"
                    height="250"
                />
            <Typography sx={{ fontFamily: "Roboto", fontSize: 13 }}>{file.name}</Typography>
            <Typography variant="caption" sx={{ fontFamily: 'Roboto', fontSize: 12, color: 'grey.600' }}>{(file.size / 1024).toFixed(1)} KB</Typography>
        </Box>
    }

    if(file?.type.startsWith("video/")){
        return (
            <video width="200" controls>
                <source src={fileUrl} type={file.type}/>
                <Typography sx={{ fontFamily: "Roboto", fontSize: 13 }}>{file.name}</Typography>
                <Typography variant="caption" sx={{ fontFamily: 'Roboto', fontSize: 12, color: 'grey.600' }}>{(file.size / 1024).toFixed(1)} KB</Typography>
            </video>
        )
    }

    if(file?.type.startsWith("audio/")){
        return (
            <audio controls>
                <source src={fileUrl} type={file.type}/>
                <Typography sx={{ fontFamily: "Roboto", fontSize: 13 }}>{file.name}</Typography>
                <Typography variant="caption" sx={{ fontFamily: 'Roboto', fontSize: 12, color: 'grey.600' }}>{(file.size / 1024).toFixed(1)} KB</Typography>
            </audio>
        )
    }

    return (
        <Box sx={{ display: "flex", alignItems: 'center', gap: 2, paddingLeft: 5, paddingBottom: 5, width: '40%' }}>
            
            <Box sx={{ display: 'block' }}>
                <Typography sx={{ fontFamily: "Roboto", fontSize: 13, marginTop: 2 }}>{file?.name}</Typography>
                <Typography variant="caption" sx={{ fontFamily: 'Roboto', fontSize: 12, color: 'grey.600' }}>{file ? (file.size / 1024).toFixed(1) : 0 } KB</Typography>
            </Box>
            <Box sx={{  
                backgroundColor: "#fff",
                fontSize: 12,
                fontFamily: "Roboto",
                fontWeight: "bold",
                color: "text.secondary"}}>
                <IconButton type="button" sx={{ marginRight: 30, marginTop: -10 }} onClick={removeFile}><HighlightOffRounded sx={{ fontSize: 18 }}/></IconButton>
            </Box>
        </Box>
    )
}