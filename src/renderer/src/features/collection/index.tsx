import React from 'react'
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material'

const Collection: React.FC = () => {
  return (
    <Box sx={{ p: 2, height: '100%', bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        集合
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="示例集合 1" />
        </ListItem>
        <ListItem>
          <ListItemText primary="示例集合 2" />
        </ListItem>
        <ListItem>
          <ListItemText primary="示例集合 3" />
        </ListItem>
      </List>
    </Box>
  )
}

export default Collection
