import Link from 'next/link';
import { Box, Button, IconButton } from '@mui/material';
import { Layout } from '../../components';
import { ArrowBackIos, DownloadOutlined } from '@mui/icons-material';
// import styles from './index.module.css';

/* eslint-disable-next-line */
export interface ViewDetailsProps { }

export function ViewDetails(props: ViewDetailsProps) {
  const handleBackDashboard = () => {
    return;
    // alert('Hii');
    // <Link href='/home-page'></Link>
  }
  return (
    <Layout>
      <h1>Record Details</h1>
      <Box display='flex' alignItems='center' marginLeft={0} width='100%'>
        <Box>
          <Button variant="outlined" component="label" startIcon={<ArrowBackIos />} onClick={handleBackDashboard}>
            BACK TO DASHBOARD
            {/* <input hidden accept="image/*" multiple type="file" /> */}
          </Button>
        </Box>
        {/* <Box display='flex' width='20%' justifyContent='space-between' alignItems={'center'} paddingY={2}>
          <Button variant="contained">REHYDRATE</Button>
          <Button variant="outlined">EMAIL REPORT</Button>
          <Button variant='outlined'>
            <IconButton><DownloadOutlined /></IconButton>
          </Button>
        </Box> */}
      </Box>
    </Layout>
  );
}

export default ViewDetails;
