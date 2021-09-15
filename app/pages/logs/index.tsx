import { FC, useEffect, useState } from "react";
import Layout from "components/Layout";
import router from "lib/router";
import { getAllLogs } from "services/LogsService";
import styles from './logs.module.css'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Pagination from '@material-ui/lab/Pagination';
import { CircularProgress } from "@material-ui/core";

const LogsPage: FC<any> = (props) => {
  const [actualPage, setActualPage] = useState(1)
  const [totalPagesCount, setTotalPagesCount] = useState(0)
  const [rows, setRows] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const updateLogs = async() => {
    try{
      setIsLoading(true)
      const logs = await getAllLogs(actualPage)
      setTotalPagesCount(Math.ceil((logs.data.body[0] / 10)))
      setRows(logs.data.body[1])
      setIsLoading(false)
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
    updateLogs()
  },[actualPage])

  useEffect(() => {
    updateLogs()
  }, [])

  return (
    <>
      <Layout user={props.user}>
        <div className={styles.container}>
          <div className={styles.logs_container}>
            <p className={styles.logsTitle}>Logs</p>
            <TableContainer component={Paper} className={styles.tableContainer}>
              {isLoading ? 
                <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '50px'}}>
                  <CircularProgress style={{height: '100px', width: '100px'}}/> 
                </div>
              :
                <Table  size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell className={styles.tableHeadText}>Atividade</TableCell>
                      <TableCell className={styles.tableHeadText}>Informações adicionais</TableCell>
                      <TableCell className={styles.tableHeadText}>Feita por</TableCell>
                      <TableCell className={styles.tableHeadText}>Data</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row" className={styles.tableBodyText} style={{color: 'blue'}}>
                          {row.activity}
                        </TableCell>
                        <TableCell className={styles.tableBodyText}>{row.additional_info}</TableCell>
                        <TableCell className={styles.tableBodyText} style={{color: 'red'}}>{row.created_by}</TableCell>
                        <TableCell className={styles.tableBodyText} style={{color: 'grey'}}>{parseDate(row.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              }
              <Pagination count={totalPagesCount} style={{float: 'right'}} onChange={handleChangePage} page={actualPage}/>
            </TableContainer>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default LogsPage

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