import {
  NewFileUploadPreviewBoxPositionStyle1,
  NewFileUploadPreviewBoxSurfaceStyle2,
  NewFileUploadPreviewIconButtonSpacingStyle3,
  NewFileUploadPreviewHighlightOffRoundedTextStyle4,
  NewFileUploadPreviewimgSizeStyle5,
  NewFileUploadPreviewTypographyTextStyle6,
  NewFileUploadPreviewTypographyTextStyle7,
  NewFileUploadPreviewBoxPositionStyle8,
  NewFileUploadPreviewBoxSurfaceStyle9,
  NewFileUploadPreviewIconButtonSpacingStyle10,
  NewFileUploadPreviewHighlightOffRoundedTextStyle11,
  NewFileUploadPreviewTypographyTextStyle12,
  NewFileUploadPreviewTypographyTextStyle13,
  NewFileUploadPreviewBoxPositionStyle14,
  NewFileUploadPreviewBoxSurfaceStyle15,
  NewFileUploadPreviewIconButtonSpacingStyle16,
  NewFileUploadPreviewHighlightOffRoundedTextStyle17,
  NewFileUploadPreviewTypographyTextStyle18,
  NewFileUploadPreviewTypographyTextStyle19
} from "../Styles/Task/NewFileUploadPreview/NewFileUploadPreview.styles";
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
            <Box sx={NewFileUploadPreviewBoxPositionStyle1}>
                <Box sx={NewFileUploadPreviewBoxSurfaceStyle2}>
                    <IconButton type="button" sx={NewFileUploadPreviewIconButtonSpacingStyle3} onClick={removeFile}><HighlightOffRounded sx={NewFileUploadPreviewHighlightOffRoundedTextStyle4}/></IconButton>
                </Box>
            <img 
                src={fileUrl}
                alt={file.name}
                style={NewFileUploadPreviewimgSizeStyle5}
            />
                <Typography sx={NewFileUploadPreviewTypographyTextStyle6}>{file.name}</Typography>
                <Typography variant="caption" sx={NewFileUploadPreviewTypographyTextStyle7}>{(file.size / 1024).toFixed(1)} KB</Typography>
            </Box>
        )
    }

    if(file?.type === "application/pdf"){
        return <Box sx={NewFileUploadPreviewBoxPositionStyle8}>
            <Box sx={NewFileUploadPreviewBoxSurfaceStyle9}>
                <IconButton type="button" sx={NewFileUploadPreviewIconButtonSpacingStyle10} onClick={removeFile}><HighlightOffRounded sx={NewFileUploadPreviewHighlightOffRoundedTextStyle11}/></IconButton>
            </Box>
                <iframe
                    src={fileUrl}
                    title={file.name}
                    width="200"
                    height="250"
                />
            <Typography sx={NewFileUploadPreviewTypographyTextStyle12}>{file.name}</Typography>
            <Typography variant="caption" sx={NewFileUploadPreviewTypographyTextStyle13}>{(file.size / 1024).toFixed(1)} KB</Typography>
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
        <Box sx={NewFileUploadPreviewBoxPositionStyle14}>
            <Box sx={NewFileUploadPreviewBoxSurfaceStyle15}>
                <IconButton type="button" sx={NewFileUploadPreviewIconButtonSpacingStyle16} onClick={removeFile}><HighlightOffRounded sx={NewFileUploadPreviewHighlightOffRoundedTextStyle17}/></IconButton>
            </Box>
            <Typography sx={NewFileUploadPreviewTypographyTextStyle18}>{file?.name}</Typography>
            <Typography variant="caption" sx={NewFileUploadPreviewTypographyTextStyle19}>{file ? (file.size / 1024).toFixed(1) : 0 } KB</Typography>
        </Box>
    )
}