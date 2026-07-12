export const validFileTypes = {
    // Standard formats
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/gif': ['.gif']
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

export const limitText = (params: string) => params.length > 10 ? params.slice(0, 10) + "..." : params;