import Link from 'next/link';
import { NavigationLinks, UserMenuOptions } from '..';
import { Divider } from '@mui/material';
import styles from './index.module.css';
import Image from 'next/image';
import Box from '@mui/material/Box';

/* eslint-disable-next-line */
export interface HeaderProps { }

export function Header(props: HeaderProps) {

  return (

    <Box
      paddingRight={8}
      bgcolor='white'
      borderBottom={'4px solid #00548C'}
      boxShadow='0px 4px 4px rgba(0, 0, 0, 0.25)'
    >
      <div className={styles['container']}>
        {/* <Container maxWidth={1376} height={76}> */}

        <Box display='flex' height='100%' alignItems='center' marginLeft={0}>
          {/* <GridItem desktop={2}> */}
          <Box>
            <Link href='/'>
              <Image
                src="/images/Brillio-logo.jpg" // Route of the image file
                height={50} // Desired size with correct aspect ratio
                width={144} // Desired size with correct aspect ratio
                alt="Your Name"
              />
            </Link>
          </Box>
          {/* </GridItem> */}
          {/* <GridItem desktop={10}> */}
          <Box
            display='flex'
            marginLeft={5}
            width='100%'
            // height='100%'
            justifyContent='space-between'
            alignItems='center'
          >
            {/* <GridItem desktop={9}> */}
            <NavigationLinks />
            {/* </GridItem> */}
            {/* <GridItem desktop={3}> */}
            <UserMenuOptions />
            {/* </GridItem> */}
          </Box>
          {/* </GridItem> */}
        </Box>
      </div>
      <Divider />
    </Box>

  );

}

export default Header;
