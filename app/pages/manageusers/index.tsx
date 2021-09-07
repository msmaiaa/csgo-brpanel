import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { FC, useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import SteamSearchForm from "../../components/SteamSearchForm";
import ToastContext from "../../context/ToastContext";
import router from "../../lib/router";
import { ICargo } from "../../services/CargoService";
import { IServer } from "../../services/ServerService";
import { getAllUsers, IUser } from "../../services/UserService";
import styles from './manageusers.module.css'

interface IUser_Cargo {
  id: number
  cargo_id: number
  flags: string
  cargo: ICargo
  server: IServer
  server_name: string
  steamid: string
}
interface IUserWithCargo extends IUser {
  user_cargo?: Array<IUser_Cargo>
}

const ManageCargos: FC<any> = (props) => {
  const toast = useContext(ToastContext)
  const [rows, setRows] = useState<Array<IUserWithCargo>>([])
  const [totalPagesCount, setTotalPagesCount] = useState(0)
  const [actualPage, setActualPage] = useState(1)
  const [userEditInfo, setUserEditInfo] = useState<IUser_Cargo | {}>({})

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

  useEffect(() => {
    updateUsersRows()
  }, [])

  return(
    <>
      <Layout user={props.user}>
      <div className={styles.container}>
          <div className={styles.users_container}>
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
                        <Button style={{height: '30px', width: '80px', fontSize: '14px'}} onClick={() => setUserEditInfo(row)} color="primary" variant="contained">Editar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination count={totalPagesCount} style={{float: 'right'}} onChange={handleChangePage} page={actualPage}/>
            </TableContainer>
          </div>
            <div style={{display: 'flex', width: '100%', height: '800px', marginTop: '30px', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', flexDirection: 'column', width: '48%'}}>
                  <p style={{height: '4%'}} className={styles.cardTitle}>Editar usuário</p>
                  <div className={styles.container_small}>
                  </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', width: '48%', justifyContent: 'space-between'}}>
                    <div style={{height: '48%'}}>
                      <p style={{height: '8%'}} className={styles.cardTitle}>Adicionar usuário</p>
                      <div className={styles.container_mini}>
                      </div>
                    </div>
                    <div style={{height: '48%'}}>
                      <p style={{height: '8%'}} className={styles.cardTitle}>Pesquisar Usuário</p>
                      <div className={styles.container_mini}>
                        <SteamSearchForm/>
                      </div>
                    </div>
                </div>
            </div>
        </div>
      </Layout>
    </>
  )
}

export default ManageCargos

export async function getServerSideProps({ req, res}) {
	await router.run(req, res);
  if(!req.user || req.user.user_type < 1) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
	return { props: { user: req.user || null } };
}