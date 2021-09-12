import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { FC, useEffect, useState } from "react";
import Layout from "components/Layout";
import router from "lib/router";
import { getAllSales } from "services/SalesService";
import styles from './salesrecord.module.css'

const SalesRecord: FC<any> = (props) => {
  const [actualPage, setActualPage] = useState(1)
  const [totalPagesCount, setTotalPagesCount] = useState(0)
  const [rows, setRows] = useState([])

  const updateSales = async() => {
    try{
      const sales = await getAllSales(actualPage)
      setTotalPagesCount(Math.ceil((sales.data.body[0] / 10)))
      setRows(sales.data.body[1])
    }catch(e) {
      console.error(e)
    }
  }

  const parseDate = (date) => {
    const newDate = new Date(date)
    return newDate.toLocaleDateString()
  }

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setActualPage(value);
  };

  useEffect(() => {
    updateSales()
  },[actualPage])

  useEffect(() => {
    updateSales()
  }, [])

  return (
    <>
      <Layout user={props.user}>
      <div className={styles.container}>
          <div className={styles.sales_container}>
            <p className={styles.salesTitle}>Vendas</p>
            <TableContainer component={Paper} className={styles.tableContainer}>
              <Table  size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" className={styles.tableHeadText}>ID</TableCell>
                    <TableCell align="center" className={styles.tableHeadText}>Usuário</TableCell>
                    <TableCell align="center" className={styles.tableHeadText}>Email do usuário</TableCell>
                    <TableCell align="center" className={styles.tableHeadText}>Valor</TableCell>
                    <TableCell align="center" className={styles.tableHeadText}>Moeda</TableCell>
                    <TableCell align="center" className={styles.tableHeadText}>Gateway</TableCell>
                    <TableCell align="center" className={styles.tableHeadText}>Data</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="center" className={styles.tableBodyText}>{row.id}</TableCell>
                      <TableCell align="center" className={styles.tableBodyText} style={{color: 'blue'}}>{row.customer_steamid}</TableCell>
                      <TableCell align="center" className={styles.tableBodyText}>{row.customer_email}</TableCell>
                      <TableCell align="center" className={styles.tableBodyText} style={{color: 'green'}}>{row.amount}</TableCell>
                      <TableCell align="center" className={styles.tableBodyText}>{row.currency}</TableCell>
                      <TableCell align="center" className={styles.tableBodyText}>{row.gateway}</TableCell>
                      <TableCell align="center" className={styles.tableBodyText}>{parseDate(row.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination count={totalPagesCount} style={{float: 'right'}} onChange={handleChangePage} page={actualPage}/>
            </TableContainer>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default SalesRecord

export async function getServerSideProps({ req, res}) {
	await router.run(req, res);
  if(!req.user || req.user.user_type < 2) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
	return { props: { user: req.user || null } };
}