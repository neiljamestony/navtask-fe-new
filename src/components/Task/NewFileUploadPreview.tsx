import { Box, Typography, IconButton } from "@mui/material";
import { HighlightOffRounded } from '@mui/icons-material'

interface FilePreviewProps {
    file: File,
    removeFile?: () => void;
}

export default function NewFileUploadFilePreview({ file, removeFile }: FilePreviewProps){
    const fileUrl = file ? URL.createObjectURL(file) : "";
    
    if(file?.type.startsWith("image/")){
        return (
            <Box sx={{ display: "block", justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                <Box sx={{  
                    position: "absolute",
                    top: 0,
                    left: 110,
                    backgroundColor: "transparent",
                    px: 1,
                    fontSize: 12,
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    color: "text.secondary"}}>
                    <IconButton type="button" sx={{ padding: 0 }} onClick={removeFile}><HighlightOffRounded sx={{ fontSize: 18 }}/></IconButton>
                </Box>
            <img 
                src={fileUrl}
                alt={file.name}
                style={{
                    width: 100,
                    height: 100,
                    objectFit: "contain"
                }}
            />
                <Typography sx={{ fontFamily: "Roboto", fontSize: 13 }}>{file.name}</Typography>
                <Typography variant="caption" sx={{ fontFamily: 'Roboto', fontSize: 12, color: 'grey.600' }}>{(file.size / 1024).toFixed(1)} KB</Typography>
            </Box>
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
            </video>
        )
    }

    if(file?.type.startsWith("audio/")){
        return (
            <audio controls>
                <source src={fileUrl} type={file.type}/>
            </audio>
        )
    }

    return (
        <Box sx={{ display: "block", justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
            <Box sx={{  
                position: "absolute",
                top: -9,
                right: 2,
                backgroundColor: "#fff",
                px: 1,
                fontSize: 12,
                fontFamily: "Roboto",
                fontWeight: "bold",
                color: "text.secondary"}}>
                <IconButton type="button" sx={{ padding: 0 }} onClick={removeFile}><HighlightOffRounded sx={{ fontSize: 18 }}/></IconButton>
            </Box>
            <Typography sx={{ fontFamily: "Roboto", fontSize: 13, marginTop: 2 }}>{file?.name}</Typography>
            <Typography variant="caption" sx={{ fontFamily: 'Roboto', fontSize: 12, color: 'grey.600' }}>{file ? (file.size / 1024).toFixed(1) : 0 } KB</Typography>
        </Box>
    )
}