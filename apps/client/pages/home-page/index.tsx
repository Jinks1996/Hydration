// import Link from 'next/link';
import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link, TableSortLabel } from '@mui/material';
import styles from './index.module.css';
import { Layout } from '../../components';
import { useMemo, useState } from 'react';
import { visuallyHidden } from '@mui/utils';

/* eslint-disable-next-line */
export interface HomePageProps { }

export function HomePage(props: HomePageProps) {
  interface Data {
    lob: string;
    status: string;
    startTime: Date;
    successRate: number;
  }
  interface HeadCell {
    id: keyof Data;
    label: string;
    numeric: boolean;
  }
  const headCells: readonly HeadCell[] = [
    {
      id: 'lob',
      numeric: false,
      label: 'LOB',
    },
    {
      id: 'status',
      numeric: false,
      label: 'Status',
    },
    {
      id: 'startTime',
      numeric: true,
      label: 'Start Time',
    },
    {
      id: 'successRate',
      numeric: true,
      label: 'Success Rate',
    },
  ];
  const rows = [
    { lob: 'Medicare_California_666450Y', status: 'Completed', startTime: '03/03/2023; 04:00 hrs', successRate: 0.67, viewDetails: 'View Details' },
    { lob: 'Medicaid_Qualchoice_666450Y_PPO Health 450_Platinum', status: 'In Progress', startTime: '03/03/2023; 15:00 hrs', successRate: 0.51, viewDetails: 'View Details' },
    { lob: 'Medicaid_Sunshine Health_666450Y', status: 'Terminated', startTime: '03/03/2023; 08:30 hrs', successRate: 0.24, viewDetails: 'View Details' },
    { lob: 'Marketplace_Qualchoice_666450Y', status: 'Completed', startTime: '03/03/2023; 11:30 hrs', successRate: 0.24, viewDetails: 'View Details' },
  ];

  type Order = 'asc' | 'desc';
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('successRate');

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    console.log('isAsc--', property);
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    order: Order;
    orderBy: string;
  }

  const EnhancedTableHead = (props: EnhancedTableProps) => {
    const { order, orderBy, onRequestSort } =
      props;
    const createSortHandler =
      (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
      };

    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
  ): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
  ) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)),
    [order, orderBy],
  );

  return (
    <Layout>
      <Box>
        <Box className={styles['header-style']}>
          <h1>Dashboard</h1>
        </Box>
        <Stack direction="row" alignItems="center" spacing={2}>
          <div className={styles['button-style']}>
            <Button variant="outlined" component="label">
              Hydrate Records
              <input hidden accept="image/*" multiple type="file" />
            </Button>
          </div>
        </Stack>
        <h2 className={styles['sub-header']}>All Reports</h2>
        <TableContainer className={styles['table-style']} component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((row) => (
                <TableRow
                  key={row.lob}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.lob}
                  </TableCell>
                  <TableCell className={styles[row.status === "In Progress" ? 'In-Progress' : row.status]} align="center">{row.status}</TableCell>
                  <TableCell align="right">{row.startTime}</TableCell>
                  <TableCell align="right">{row.successRate}</TableCell>
                  <TableCell align="right"><Link href="/view-details">{row.viewDetails}</Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  );
}

export default HomePage;
