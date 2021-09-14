import { FC, useContext, useState } from "react";
import FormUpdateUser from "components/FormUpdateUser";
import Layout from "components/Layout";
import SteamSearchForm from "components/SteamSearchForm";
import UsersTable from "components/UsersTable";
import ToastContext from "context/ToastContext";
import router from "lib/router";
import { ICargo } from "services/CargoService";
import { IServer } from "services/ServerService";
import { IUser } from "services/UserService";
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

const ManageUsers: FC<any> = (props) => {
  const toast = useContext(ToastContext)
  const [userEditInfo, setUserEditInfo] = useState<IUser>()
  const [updateData, setUpdateData] = useState<boolean>()

  const handleEditClick = (user: IUser) => {
    setUserEditInfo(user)
  }

  const handleUpdateUserInfo = async() => {
    setUpdateData(true)
  }


  return(
    <>
      <Layout user={props.user}>
      <div className={styles.container}>
          <div className={styles.users_container}>
            <UsersTable onEditClick={handleEditClick} updateData={updateData} setUpdateData={(value) => setUpdateData(value)}/>
          </div>
            <div style={{display: 'flex', width: '100%', height: '800px', marginTop: '30px', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', flexDirection: 'column', width: '48%'}}>
                  <p style={{height: '4%'}} className={styles.cardTitle}>Editar usuário <span style={{fontSize: '20px', fontWeight: 400, color: 'blue'}}>{userEditInfo ? userEditInfo.name : ''}</span></p>
                  <div className={styles.container_small}>
                    <FormUpdateUser selectedData={userEditInfo} updateUserInfo={handleUpdateUserInfo}/>
                  </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', width: '48%', justifyContent: 'space-between'}}>
                    <div style={{height: '48%'}}>
                      <p style={{height: '8%'}} className={styles.cardTitle}>Adicionar Usuário</p>
                      <div className={styles.container_mini}>
                        <SteamSearchForm onAddUser={() => setUpdateData(true)}/>
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