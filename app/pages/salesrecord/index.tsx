import {
  CircularProgress,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { FC, useContext, useEffect, useState } from "react";
import Layout from "components/Layout";
import router from "lib/router";
import { getAllSales } from "services/SalesService";
import styles from "./salesrecord.module.css";
import { ThemeContext } from "context/ThemeContext";

const useStyles = makeStyles({
  paginator: (props: any) => ({
    "& > li > .Mui-selected": {
      color: `${props.textColor}`,
      backgroundColor: props.backgroundSecondary,
    },
    "& > li > .Mui-selected:hover": {},
    "& > li > button:not(.Mui-selected)": {
      color: props.textSecondary,
    },
    "& > li > button:not(.Mui-selected):hover": {
      backgroundColor: props.backgroundSecondary,
    },
  }),
  table_row: (props: any) => ({
    "& > .MuiTableCell-root": {
      borderBottom: `1px solid ${props.borderBottomColor}`,
    },
  }),
  tableHeadText: (props: any) => ({
    fontFamily: "Josefin Sans !important",
    fontSize: "20px !important",
    color: props.textColor,
  }),
  tableBodyText: (props: any) => ({
    fontFamily: "Josefin Sans !important",
    color: props.textColor,
  }),
});

const SalesRecord = (props) => {
  const theme = useContext(ThemeContext);
  const classes = useStyles(theme.data);
  const [actualPage, setActualPage] = useState(1);
  const [totalPagesCount, setTotalPagesCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const updateSales = async () => {
    try {
      setIsLoading(true);
      const sales = await getAllSales(actualPage);
      setTotalPagesCount(Math.ceil(sales.data.body[0] / 10));
      setRows(sales.data.body[1]);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const parseDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  };

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setActualPage(value);
  };

  useEffect(() => {
    updateSales();
  }, [actualPage]);

  useEffect(() => {
    updateSales();
  }, []);

  return (
    <>
      <Layout user={props.user}>
        <div className={styles.container}>
          <div className={styles.sales_container}>
            <p
              className={styles.salesTitle}
              style={{ color: theme.data.textColor }}
            >
              Vendas
            </p>
            <TableContainer
              component={Paper}
              className={styles.tableContainer}
              style={{
                backgroundColor: theme.data.backgroundPrimary,
                boxShadow: theme.data.boxShadowCard,
              }}
            >
              {isLoading ? (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "50px",
                    minHeight: "200px",
                  }}
                >
                  <CircularProgress
                    style={{ height: "100px", width: "100px" }}
                  />
                </div>
              ) : (
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow className={classes.table_row}>
                      <TableCell
                        align="center"
                        className={classes.tableHeadText}
                      >
                        ID
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.tableHeadText}
                      >
                        Usuário
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.tableHeadText}
                      >
                        Email do usuário
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.tableHeadText}
                      >
                        Valor
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.tableHeadText}
                      >
                        Moeda
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.tableHeadText}
                      >
                        Gateway
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.tableHeadText}
                      >
                        Data
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id} className={classes.table_row}>
                        <TableCell
                          align="center"
                          className={classes.tableBodyText}
                        >
                          {row.id}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={classes.tableBodyText}
                          style={{ color: theme.data.textAccent }}
                        >
                          {row.customer_steamid}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={classes.tableBodyText}
                        >
                          {row.customer_email}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={classes.tableBodyText}
                          style={{ color: "green" }}
                        >
                          {row.amount}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={classes.tableBodyText}
                        >
                          {row.currency}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={classes.tableBodyText}
                        >
                          {row.gateway}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={classes.tableBodyText}
                        >
                          {parseDate(row.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <Pagination
                classes={{ ul: classes.paginator }}
                count={totalPagesCount}
                style={{ float: "right" }}
                onChange={handleChangePage}
                page={actualPage}
              />
            </TableContainer>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SalesRecord;

export async function getServerSideProps({ req, res }) {
  await router.run(req, res);
  if (!req.user || req.user.user_type < 2) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { user: req.user || null } };
}
