// import styles from './navigation-links.module.css';
import { Box } from "@mui/material";
import Link from 'next/link';
import pageRoutes from '../../enums/pageRoutes';
/* eslint-disable-next-line */
export interface NavigationLinksProps { }

export function NavigationLinks(props: NavigationLinksProps) {
  const getLinkView = (to: string, title: string) => {
    return (
      <Box
        paddingX={4}
        paddingY={6.5}
        height='100%'
        textAlign='center'
        // borderBottom={'4px solid #003356'}
      >
        {/* <BodyCopy> */}
        <Link href={to}>{title}</Link>
        {/* </BodyCopy> */}
      </Box>
    );
  };

  return (
    <Box display='flex' alignItems='center' data-testid='NavigationLinks'>
      {getLinkView('/home-page', 'Dashboard')}
    </Box>
  );

}

export default NavigationLinks;
