import { FC, useEffect, useState } from "react";
import router from "../lib/router";
import { getAllServers } from '../services/ServerService'
import styles from './index.module.css'
import Layout from "../components/Layout";
import ServerCard from "../components/ServerCard/ServerCard";

const HomePage: FC<any> = (props) => {
  const [servers, setServers] = useState([])

  useEffect(() => {
    let mounted = true
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
  
  useEffect(() => {
    //console.log(servers)
  },[servers])

  return (
    <>
      <Layout user={props.user}>
        <div className={styles.container}>
          <div className={styles.serversContainer}>
            {servers.length > 0 ? 
            servers.map((server, index) => {
              return (
                <ServerCard key={server.id} server={server} style={{
                width: '280px', 
                height: '180px', 
                marginLeft: index === 0 ? '0' : '30px', 
                backgroundColor: 'rgba(255, 255, 255, .15)', 
                backdropFilter: 'blur(5px)'
              }}/>
              )
            })
            : ''}
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