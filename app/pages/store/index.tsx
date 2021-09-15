import Layout from "components/Layout";
import router from "lib/router";
import { buyCargo, getNonIndividualCargos } from "services/CargoService";
import styles from './store.module.css'

import { Button, CircularProgress, FormControl, Select } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import { MenuItem } from "react-pro-sidebar";
import { useRouter } from 'next/router'
import { getAllServersWithCargo } from "services/ServerService";



const StorePage: FC<any> = (props) => {
  const router = useRouter()
  const [cargosAllServers, setCargosAllServers] = useState([])
  const [serversWithCargo, setServersWithCargo] = useState([])
  const [activeData, setActiveData] = useState([])
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true)

  const getInitialData = async() => {
    let mounted = true
    const servers = await getAllServersWithCargo()
    const cargosAll = await getNonIndividualCargos()
    if(mounted) {
      setCargosAllServers(cargosAll.data.body)
      setServersWithCargo(servers.data.body)
      setIsLoading(false)
    }
    return () => {
      mounted = false
    }
  }
  
  const handleChange = (event: React.ChangeEvent<{ value: any }>) => {
    if(event.target.value.full_name) {
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

  const handleBuy = async(cargo, gateway) => {
    try{
      const boughtCargo: any = await buyCargo(cargo, gateway)
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
              {isLoading ? 
              <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                <CircularProgress style={{height: '50px', width: '50px'}}/> 
              </div>
              :
              <div className={styles.contentHeader}>
                <div style={{width: '48%', height: '100%', display: 'flex', justifyContent: 'flex-end', alignItems:'center'}}>
                  <p className={styles.contentHeader__title}>Servidor:</p>
                </div>
                <FormControl style={{width: '52%', height: '100%', display: 'flex', justifyContent: 'center', alignItems:'flex-start'}}>
                  <Select
                    value={name}
                    onChange={handleChange}
                    style={{fontFamily: 'Josefin Sans', minWidth: '100px'}}
                  >
                    {cargosAllServers.length > 0 && serversWithCargo.length > 0 && 
                    <MenuItem  className={styles.menuitem} value={cargosAllServers}>Cargo em todos os servidores</MenuItem>}  

                    {serversWithCargo.length > 0 && serversWithCargo.map((server) => {
                      return <MenuItem className={styles.menuitem} key={server.id} value={server}>{server.full_name}</MenuItem>
                    })}

                  </Select>
              </FormControl>
              </div>
              }
              <div className={styles.contentCargos}>
                  {activeData.length > 0 && !isLoading && activeData.map((cargo) => {
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
                          {/* <Button variant="contained" color="primary" onClick={() => handleBuy(cargo, 'stripe')}>Stripe</Button> */}
                          <img className={styles.pagseguro} src="https://netfacilita.com.br/mais-ajuda/comprar-ps.png" onClick={() => handleBuy(cargo, 'pagseguro')}/>
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