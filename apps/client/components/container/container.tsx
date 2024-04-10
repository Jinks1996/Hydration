import { Box } from '@mui/material';
// import styles from './container.module.css';

/* eslint-disable-next-line */
export interface ContainerProps { }

export function Container(children: any, ...rest: any) {
  return (
    <Box maxWidth={1216} marginX={'auto'} {...rest}>
      {children}
    </Box>
  );
}

export default Container;
