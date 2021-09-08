import { FC, useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import SteamSearchForm from "../../components/SteamSearchForm";
import UsersTable from "../../components/UsersTable";
import ToastContext from "../../context/ToastContext";
import router from "../../lib/router";
import { ICargo } from "../../services/CargoService";
import { IServer } from "../../services/ServerService";
import { IUser } from "../../services/UserService";
import styles from './manageusers.module.css'

export interface IUser_Cargo {
  id: number
  cargo_id: number
  flags: string
  cargo: ICargo
  server: IServer
  server_name: string
  steamid: string
}
export interface IUserWithCargo extends IUser {
  user_cargo?: Array<IUser_Cargo>
}

const ManageUsers: FC<any> = (props) => {
  const toast = useContext(ToastContext)

  const [userEditInfo, setUserEditInfo] = useState<IUser_Cargo | {}>({})

  const handleUserSearch = (steamid: string) => {
    console.log(steamid)
  }

  const handleEditClick = (user: IUserWithCargo) => {
    console.log(user)
  }


  return(
    <>
      <Layout user={props.user}>
      <div className={styles.container}>
          <div className={styles.users_container}>
            <UsersTable onEditClick={handleEditClick}/>
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
                        <SteamSearchForm onUserSearch={(steamid) => handleUserSearch(steamid)}/>
                      </div>
                    </div>
                </div>
            </div>
        </div>
      </Layout>
    </>
  )
}

export default ManageUsers

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