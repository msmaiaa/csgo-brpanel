import { FC, useEffect, useState } from "react";
import router from "lib/router";
import { getAllServers } from 'services/ServerService'
import styles from './index.module.css'
import Layout from "components/Layout";
import ServerCard from "components/ServerCard/ServerCard";
import { getUserStatus } from "services/UserService";
import { ISaleData } from "utils/email";
import { ISteamApiUser } from "components/SteamSearchForm";
import { Card } from "@material-ui/core";

interface IUserData {
  cargos: [{
    cargo: { name: string },
    server: { full_name: string }
  }]
  sales?: Array<ISaleData>
}

interface IProps {
  user: ISteamApiUser
}

const HomePage: FC<any> = (props: IProps) => {
  const [servers, setServers] = useState([])
  const [userData, setUserData] = useState<IUserData>()

  useEffect(() => {
    let mounted = true
    if(props.user) {
      getUserStatus()
      .then((response) => {
        setUserData(response.data.body)
      })
    }
    getAllServers()
    .then((response) => {
      if(mounted) {
        setServers(response.data.body)
      }
    })
    return function cleanup() {
      mounted = false
    }
  }, [])

  return (
    <>
      <Layout user={props.user}>
        <div className={styles.container}>
          {props.user && userData &&
          <div className={styles.serversContainer}>
            <p style={{fontSize: '32px', fontWeight: 300 }}>Status</p>
            <Card style={{marginTop: '15px', 
            width: '450px',
            height: '180px', 
            justifyContent: 'center', 
            backgroundColor: 'rgba(255, 255, 255, .15)',
            boxShadow: '0 0 35px 0 rgba(154,161,171,.25)',
            backdropFilter: 'blur(5px)',
            flexGrow: 1
            }}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%'}}>
                <div style={{display: 'flex', marginLeft: '10px'}}>
                  <img src={props.user.avatarfull} alt="Avatar" style={{height: '130px'}}/>
                </div>
                <div style={{marginLeft: '15px'}}>
                  <p className={styles.profileItem}>Nome: <span className={styles.profileSubItem}>{props.user.personaname}</span></p>
                  <p className={styles.profileItem}>SteamID: <span className={styles.profileSubItem}>{props.user.steamid}</span></p>                  
                  <p className={styles.profileItem}>Você possui <span className={styles.profileSubItem}>{userData.cargos.length}</span> cargos</p>                  
                </div>
              </div>
            </Card>
          </div>
          }
          <div className={styles.serversContainer}>
            <p style={{fontSize: '32px', fontWeight: 300, marginTop: '25px' }}>Servidores</p>
            <div style={{display: 'flex', justifyContent: 'flex-start', marginTop: '15px'}}>
              {servers.length > 0 ? 
              servers.map((server, index) => {
                return (
                  <ServerCard key={server.id} server={server} style={{
                  height: '220px', 
                  minWidth: '350px',
                  marginLeft: index === 0 ? '0' : '30px', 
                  backgroundColor: 'rgba(255, 255, 255, .15)', 
                  backdropFilter: 'blur(5px)'
                }}/>
                )
              })
              : ''}
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default HomePage

export async function getServerSideProps({ req, res}) {
	await router.run(req, res);
	return { props: { user: req.user || null } };
}