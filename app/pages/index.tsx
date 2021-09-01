import { FC, useEffect, useState } from "react";
import router from "../lib/router";
import { getAllServers } from '../services/ServerService'
import styles from './index.module.css'
import Layout from "../components/Layout";
import ServerCard from "../components/ServerCard/ServerCard";
const HomePage: FC<any> = (props) => {
  const [servers, setServers] = useState([])

  useEffect(() => {
    getAllServers()
    .then((response) => setServers(response.data.body))
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
            servers.map((server) => {
              return (
                <ServerCard key={server.id} server={server} style={{width: '300px', height: '200px', marginLeft: '30px', backgroundColor: '#191919'}}/>
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