import { Card, CardHeader, Divider, Typography, CardContent, Stack } from '@mui/material'
import type { IFilterMenuItems } from '../../../typescript/interface'
import FilterMenuItems from './FilterMenuItems'

export default function Filters({ priorityMenuItems, statusMenuItems }: { priorityMenuItems: IFilterMenuItems[], statusMenuItems: IFilterMenuItems[] }) {
  return (
    <Card variant="outlined" sx={{ height: "86vh", width: '100%', borderRadius: 5, marginBottom: 2 }}>
        <CardHeader title={<Typography variant="body1">Filters</Typography>}/>
        <Divider/>
        <CardContent>
            <Stack spacing={2}>
                <FilterMenuItems filterMenuItems={priorityMenuItems} name="Priority"/>
                <FilterMenuItems filterMenuItems={statusMenuItems} name="Status"/>
            </Stack>
        </CardContent>
    </Card>
  )
}
