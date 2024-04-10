// import styles from './layout.module.css';
import { Box } from '@mui/material';
import Header from '../header/index';

/* eslint-disable-next-line */
export interface LayoutProps { }

export function Layout(props: any) {
  return (
    <>
      <Header />
      <Box bgcolor='white' padding='4px 30px 10px 30px'>{props.children}</Box>
    </>
  );
}

export default Layout;
