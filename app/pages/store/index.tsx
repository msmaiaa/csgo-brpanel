import ToastContext from "../../context/ToastContext";
import Layout from "../../components/Layout";
import router from "../../lib/router";
import { buyCargo } from "../../services/CargoService";
import styles from './store.module.css'

import axios from "axios";
import { Button, FormControl, Select } from "@material-ui/core";
import { FC, useContext, useEffect, useState } from "react";
import { MenuItem } from "react-pro-sidebar";
import { useRouter } from 'next/router'



const StorePage: FC<any> = (props) => {
  const router = useRouter()
  const toast = useContext(ToastContext)
  const [cargosAllServers, setCargosAllServers] = useState([])
  const [serversWithCargo, setServersWithCargo] = useState([])
  const [activeData, setActiveData] = useState([])
  const [name, setName] = useState('');

  const getInitialData = async() => {
    let mounted = true
    const servers = await axios.get('/api/servers/withCargo')
    const cargosAll = await axios.get('/api/cargos?all=true')
    if(mounted) {
      setCargosAllServers(cargosAll.data.body)
      setServersWithCargo(servers.data.body)
    }
    return () => {
      mounted = false
    }
  }
  
  const handleChange = (event: React.ChangeEvent<{ value: any }>) => {
    if(event.target.value.full_name) {
      console.log(event.target.value)
      const serverName = event.target.value.name
      const newActiveData = event.target.value.cargo_server.map((data) => {
        const newData = data.cargo
        newData.serverName = serverName
        return newData
      })
      setActiveData(newActiveData);
    }else {
      setActiveData(event.target.value);
    }
    setName(event.target.value as string)
  };

  const handleBuy = async(cargo) => {
    try{
      const boughtCargo: any = await buyCargo(cargo)
      router.push(boughtCargo.data.url)
    }catch(e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getInitialData()
  }, [])

  

  return (
    <>
      <Layout user={props.user}>
        <div className={styles.container}>
          <div className={styles.cargos_container}>
            <p className={styles.cargosTitle}>Cargos</p>
            <div className={styles.cargosContent}>
              <div className={styles.contentHeader}>
                <div style={{width: '50%', height: '100%', display: 'flex', justifyContent: 'flex-end', alignItems:'center'}}>
                  <p className={styles.contentHeader__title}>Servidor:</p>
                </div>
                <FormControl style={{width: '50%', height: '100%', display: 'flex', justifyContent: 'center', alignItems:'flex-start'}}>
                  {/* <InputLabel id="demo-simple-select-label">name</InputLabel> */}
                  <Select
                    value={name}
                    onChange={handleChange}
                    style={{fontFamily: 'Josefin Sans', minWidth: '50px'}}
                  >
                    {cargosAllServers.length > 0 && <MenuItem
                    onMouseEnter={(e: any) => {
                      e.target.style.backgroundColor = 'lightgray'
                      e.target.style.cursor = 'pointer'
                    }} 
                    onMouseLeave={(e: any) => e.target.style.backgroundColor = 'white'} 
                    style={{fontSize: '18px'}} 
                    value={cargosAllServers}>Cargo em todos os servidores</MenuItem>}                    
                    {serversWithCargo.length > 0 && serversWithCargo.map((server) => {
                      return <MenuItem 
                      onMouseEnter={(e: any) => {
                        e.target.style.backgroundColor = 'lightgray'
                        e.target.style.cursor = 'pointer'
                      }} 
                      onMouseLeave={(e: any) => e.target.style.backgroundColor = 'white'} 
                      style={{fontSize: '18px', marginTop: '8px'}}
                      key={server.id}
                      value={server}>{server.full_name}</MenuItem>
                    })}
                  </Select>
              </FormControl>
              </div>
              <div className={styles.contentCargos}>
                  {activeData.length > 0 && activeData.map((cargo) => {
                    return (
                      <div key={cargo.stripe_id} className={styles.customCard}>
                        <div>
                          <p className={styles.cargo__name}>{cargo.name}</p>
                          <p className={styles.cargo__duration}>{cargo.duration} dias</p>
                          <p className={styles.cargo__pricetext} style={{marginLeft: '20px'}}>
                            R$<span className={styles.cargo__price}>{cargo.price},00</span>
                          </p>
                        </div>
                        <div className={styles.cargo__footer}>
                          <Button variant="contained" color="primary" onClick={() => handleBuy(cargo)}>Comprar</Button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default StorePage

export async function getServerSideProps({ req, res}) {
	await router.run(req, res);
  if(!req.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
	return { props: { user: req.user || null } };
}