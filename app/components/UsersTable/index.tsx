import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core"
import { Pagination } from "@material-ui/lab";
import { FC, useEffect, useState } from "react"
import { IUserWithCargo } from "../../pages/manageusers";
import { getAllUsers } from "../../services/UserService";
import styles from './userstable.module.css'

const UsersTable: FC<any> = ({ onEditClick }) => {
  const [rows, setRows] = useState<Array<IUserWithCargo>>([])
  const [totalPagesCount, setTotalPagesCount] = useState(0)
  const [actualPage, setActualPage] = useState(1)

  useEffect(() => {
    updateUsersRows()
  }, [])

  const updateUsersRows = async() => {
    try{
      const users = await getAllUsers(actualPage)
      setTotalPagesCount(Math.ceil((users.data.body[0] / 10)))
      setRows(users.data.body[1])
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
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table  size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
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
              <TableRow key={row.id}>
                <TableCell component="th" scope="row" className={styles.tableBodyText} style={{color: 'blue'}}>
                  <p>{row.name}</p>
                </TableCell>
                <TableCell align="left" className={styles.tableBodyText}>{row.steamid}</TableCell>
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
        <Pagination count={totalPagesCount} style={{float: 'right'}} onChange={handleChangePage} page={actualPage}/>
      </TableContainer>
    </>
  )
}

export default UsersTable