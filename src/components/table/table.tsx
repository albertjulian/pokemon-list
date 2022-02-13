import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const headCells = [
  { id: 'name', label: 'Name' },
  { id: 'owned', label: 'Total Owned' },
  { id: 'action', label: 'Action' },
];

const EnhancedTableHead = (props: any) => {
  const { classes } = props;

  return (
    <TableHead className={classes.tableHead}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            style={{
              fontWeight: 'bold',
              fontSize: 20,
            }}
            key={headCell.id}
            align="center"
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    borderRadius: '10px',
  },
  tableHead: {
    backgroundColor: 'grey',
    borderRadius: '10px',
  },
}));

const EnhancedTable = (props: any) => {
  const {
    data: rows,
    totalRows,
    callback,
  } = props;
  const classes = useStyles();
  const rowsPerPage = 10;
  const [page, setPage] = useState(0);

  const handlePageChange = (e: any, newPage: number) => {
    callback(page, newPage)
    setPage(newPage);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} variant="elevation" elevation={4} square={false}>
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size='medium'
            aria-label="enhanced table"
          >
            <EnhancedTableHead classes={classes} />
            <TableBody>
              {rows.map((row: any, index: number) => {
                const labelId = `enhanced-table-${index}`;
                return (
                  <TableRow
                    key={row.name}
                  >
                    {
                      headCells && headCells.map((dataPerRow) => {
                        return (
                          <TableCell key={row[dataPerRow.id]} component="th" id={labelId} align="center">
                            {row[dataPerRow.id]}
                          </TableCell>
                        )
                      })
                    }
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {
          totalRows !== rows.length &&
          <TablePagination
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => handlePageChange(e, newPage)}
            rowsPerPageOptions={[]}
          />
        }
      </Paper>
    </div>
  );
}

export default EnhancedTable;