import { Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core"
import { Pagination } from "@material-ui/lab";
import { makeStyles } from "@material-ui/styles";
import { ThemeContext } from "context/ThemeContext";
import { FC, useContext, useEffect, useState } from "react"
import { getAllUsers, IUser } from "services/UserService";
import styles from './userstable.module.css'

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
      borderBottom: `1px solid ${props.borderBottomColor}`,
      color: props.textColor
    }
  })
})

const UsersTable: FC<any> = ({ onEditClick, updateData, setUpdateData }) => {
  const theme = useContext(ThemeContext)
  const classes = useStyles(theme.data)
  const [rows, setRows] = useState<Array<IUser>>([])
  const [totalPagesCount, setTotalPagesCount] = useState(0)
  const [actualPage, setActualPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    updateUsersRows()
  }, [])

  useEffect(() => {
    updateUsersRows()
  },[actualPage])

  useEffect(() => {
    if(updateData) {
      updateUsersRows()
      setUpdateData(false)
    }
  }, [updateData])

  const updateUsersRows = async() => {
    try{
      setIsLoading(true)
      const users = await getAllUsers(actualPage)
      setTotalPagesCount(Math.ceil((users.data.body[0] / 10)))
      setRows(users.data.body[1])
      setIsLoading(false)
    }catch(e) {
      console.error(e)
    }
  }

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setActualPage(value);
  };

  const parseDate = (date) => {
    const newDate = new Date(date)
    return newDate.toLocaleDateString()
  }

  const userTypeFromNumber = (num) => {
    switch(num){
      case 0: return 'Comum';
      case 1: return 'Admin';
      case 2: return 'Super Admin';
    }
  }

  return (
    <>
      <p className={styles.usersTitle}>Usuários</p>
      <TableContainer component={Paper} className={styles.tableContainer} style={{backgroundColor: theme.data.backgroundPrimary, boxShadow: theme.data.boxShadowCard}}>
        {isLoading ? 
        <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
          <CircularProgress style={{height: '50px', width: '50px'}}/>
        </div>
        :
        <Table size="small">
          <TableHead>
            <TableRow className={classes.table_row}>
              <TableCell className={styles.tableHeadText}>Nome</TableCell>
              <TableCell align="left" className={styles.tableHeadText}>SteamID</TableCell>
              <TableCell align="left" className={styles.tableHeadText}>Autorização</TableCell>
              <TableCell align="center" className={styles.tableHeadText}>Cargos</TableCell>
              <TableCell align="center" className={styles.tableHeadText}>Data de cadastro</TableCell>
              <TableCell align="center" className={styles.tableHeadText}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className={classes.table_row}>
                <TableCell component="th" scope="row" style={{color: theme.data.textAccent}}  className={styles.tableBodyText}>
                  <p>{row.name}</p>
                </TableCell>
                <TableCell style={{color: theme.data.textAccent}} align="left" className={styles.tableBodyText}>{row.steamid}</TableCell>
                <TableCell align="left" className={styles.tableBodyText}>{userTypeFromNumber(row.user_type)}</TableCell>
                <TableCell align="center" className={styles.tableBodyText}>{row.user_cargo ? row.user_cargo.length : 0}</TableCell>
                <TableCell align="center" className={styles.tableBodyText}>{parseDate(row.created_at)}</TableCell>
                <TableCell align="center" className={styles.tableBodyText}>
                  <Button style={{height: '30px', width: '80px', fontSize: '14px'}} onClick={() => onEditClick(row)} color="primary" variant="contained">Editar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        }
        <Pagination count={totalPagesCount} classes={{ul: classes.paginator}} style={{float: 'right'}} onChange={handleChangePage} page={actualPage}/>
      </TableContainer>
    </>
  )
}

export default UsersTable