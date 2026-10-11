import {
  FiltersCardSurfaceStyle1,
  FiltersCardContentSpacingStyle2
} from "../../Styles/Todo/Filters/Filters/Filters.styles";
import { Card, CardHeader, Divider, Typography, CardContent, Stack } from '@mui/material'
import type { IFilterMenuItems } from '../../../typescript/interface'
import FilterMenuItems from './FilterMenuItems'

export default function Filters({ priorityMenuItems, statusMenuItems }: { priorityMenuItems: IFilterMenuItems[], statusMenuItems: IFilterMenuItems[] }) {
  return (
    <Card variant="outlined" sx={FiltersCardSurfaceStyle1}>
        <CardHeader title={<Typography variant="body1">Filters</Typography>}/>
        <Divider/>
        <CardContent sx={FiltersCardContentSpacingStyle2}>
            <Stack spacing={1}>
              <FilterMenuItems filterMenuItems={priorityMenuItems} name="Priority"/>
              <FilterMenuItems filterMenuItems={statusMenuItems} name="Status"/>
            </Stack>
        </CardContent>
    </Card>
  )
}
