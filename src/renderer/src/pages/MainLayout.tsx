import React from 'react';
import { Grid } from '@mui/material';
import Collection from '../features/collection';
import RequestPanel from '../features/request/components/RequestPanel';
import ResponsePanel from '../features/request/components/ResponsePanel';

const MainLayout: React.FC = () => {
  return (
    <Grid container spacing={0} sx={{ height: '100vh' }}>
      {/* 左侧集合面板 */}
      <Grid item xs={3} sx={{ borderRight: '1px solid #ddd' }}>
        <Collection />
      </Grid>

      {/* 右侧请求/响应面板 */}
      <Grid item xs={9}>
        <Grid container direction="column" spacing={0} sx={{ height: '100%' }}>
          {/* 上部请求面板 */}
          <Grid item sx={{ flex: 1, borderBottom: '1px solid #ddd' }}>
            <RequestPanel />
          </Grid>

          {/* 下部响应面板 */}
          <Grid item sx={{ flex: 1 }}>
            <ResponsePanel />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MainLayout;