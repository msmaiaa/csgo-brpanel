import { FC, useContext, useEffect, useState } from "react";
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
import { ThemeContext } from "context/ThemeContext";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  paginator: (props: any) => ({
    '& > li > .Mui-selected': {
      color: `${props.textColor}`,
      backgroundColor: props.backgroundSecondary
    },
    '& > li > .Mui-selected:hover': {
    },
    '& > li > button:not(.Mui-selected)': {
      color: props.textSecondary
    },
    '& > li > button:not(.Mui-selected):hover': {
      backgroundColor: props.backgroundSecondary
    }
  }),
  table_row: (props: any) => ({
    '& > .MuiTableCell-root': {
      borderBottom: `1px solid ${props.borderBottomColor}`
    }
  })
})

const LogsPage: FC<any> = (props) => {
  const theme = useContext(ThemeContext)
  const classes = useStyles(theme.data)
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
            <p className={styles.logsTitle} style={{color: theme.data.textColor}}>Logs</p>
            <TableContainer component={Paper} className={styles.tableContainer} style={{backgroundColor: theme.data.backgroundPrimary, boxShadow: theme.data.boxShadowCard}}>
              {isLoading ? 
                <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '50px'}}>
                  <CircularProgress style={{height: '100px', width: '100px'}}/> 
                </div>
              :
                <Table  size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow className={classes.table_row}>
                      <TableCell style={{color: theme.data.textColor}} className={styles.tableHeadText}>Atividade</TableCell>
                      <TableCell style={{color: theme.data.textColor}} className={styles.tableHeadText}>Informações adicionais</TableCell>
                      <TableCell style={{color: theme.data.textColor}} className={styles.tableHeadText}>Feita por</TableCell>
                      <TableCell style={{color: theme.data.textColor}} className={styles.tableHeadText}>Data</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id} className={classes.table_row}>
                        <TableCell component="th" scope="row" className={styles.tableBodyText} style={{color: theme.data.textAccent}}>
                          {row.activity}
                        </TableCell>
                        <TableCell className={styles.tableBodyText} style={{color: theme.data.textColor}}>{row.additional_info}</TableCell>
                        <TableCell className={styles.tableBodyText} style={{color: theme.data.textAccent}}>{row.created_by}</TableCell>
                        <TableCell className={styles.tableBodyText} style={{color: 'grey'}}>{parseDate(row.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              }
              <Pagination count={totalPagesCount} classes={{ul: classes.paginator}} style={{float: 'right'}} onChange={handleChangePage} page={actualPage}/>
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