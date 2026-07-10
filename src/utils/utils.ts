export const validFileTypes = {
    // Standard formats
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    // 'image/bmp': ['.bmp'],
    
    // // Modern web formats
    // 'image/webp': ['.webp'],
    // 'image/avif': ['.avif'],
    
    // // Vector graphics
    // 'image/svg+xml': ['.svg'],
    
    // // Icon formats
    // 'image/x-icon': ['.ico'],
    // 'image/vnd.microsoft.icon': ['.ico'],
    
    // // Print/Design formats (Note: Safari/iOS treats HEIC differently)
    // 'image/tiff': ['.tiff', '.tif'],
    // 'image/heic': ['.heic'],
    // 'image/heif': ['.heif'],
    //  // Portable Document Format
    // 'application/pdf': ['.pdf'],

    // // Microsoft Word
    // 'application/msword': ['.doc'],
    // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],

    // // Microsoft Excel
    // 'application/vnd.ms-excel': ['.xls'],
    // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],

    // // Microsoft PowerPoint
    // 'application/vnd.ms-powerpoint': ['.ppt'],
    // 'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],

    // // OpenDocument Formats (LibreOffice / OpenOffice)
    // 'application/vnd.oasis.opendocument.text': ['.odt'],
    // 'application/vnd.oasis.opendocument.spreadsheet': ['.ods'],

    // // Plain Text & Rich Text
    // 'text/plain': ['.txt'],
    // 'application/rtf': ['.rtf'],

    // // CSV (Comma Separated Values)
    // 'text/csv': ['.csv'],
    
    // // Compressed Archives (Often used to bundle documents)
    // 'application/zip': ['.zip'],
    // 'application/x-rar-compressed': ['.rar'],
    // Executable Files
    // 'application/x-msdownload': ['.exe']
  }

export const prioritiesDropdown = [
    {
        value: 'all-priority',
        label: "All"
    },
    {
        value: "low",
        label: "Low"
    },
    {
        value: "high",
        label: "High"
    },
    {
        value: "critical",
        label: "Critical"
    },
]

export const statusDropdown = [
    {
        value: 'all-status',
        label: "All"
    },
    {
        value: "not-started",
        label: "Not Started"
    },
    {
        value: "in-progress",
        label: "In Progress"
    },
    {
        value: "completed",
        label: "Completed"
    },
    {
        value: "cancelled",
        label: "Cancelled"
    },
]

