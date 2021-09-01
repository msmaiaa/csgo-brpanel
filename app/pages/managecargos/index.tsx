import Card from "../../components/Card/Card";
import Layout from "../../components/Layout";
import ToastContext from "../../context/ToastContext";
import router from "../../lib/router";
import styles from './managecargos.module.css'
import { addCargo } from "../../services/CargoService";
import { getAllServers } from "../../services/ServerService";

import { FC, useContext, useEffect, useState } from "react";
import { withStyles, TextField, Button, Checkbox } from '@material-ui/core'

const CustomTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'black',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'black',
    },
    '& .MuiInputBase-root': { 
      color: 'black',
      fontFamily: 'Josefin Sans',
    },
    '& > *': {
      color: 'black',
      borderBottomColor: 'black',
      fontFamily: 'Josefin Sans',
    },
    marginBottom: 10
  },
})(TextField);

const ManageCargos: FC<any> = (props) => {
  const toast = useContext(ToastContext)

  const [addInputs, setAddInputs] = useState<any>({});
  const handleAddChange = e => setAddInputs(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  const [updateInputs, setUpdateInputs] = useState({});
  const handleUpdateChange = e => setUpdateInputs(prevState => ({ ...prevState, [e.target.name]: e.target.value }));

  const [servers, setServers] = useState([])
  const [serversChecked, setServersChecked] = useState([])
  const [isAllServers, setAllServers] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let updatedServersChecked = [...serversChecked]
    updatedServersChecked[index].checked = event.target.checked
    setServersChecked(updatedServersChecked)
  };

  useEffect(() => {
    getAllServers()
    .then((response) => setServers(response.data.body))
  },[])

  useEffect(() => {
    if(servers.length > 0) {
      const serversFormatted = servers.map((server) => {
        return {
          ...server,
          checked: false
        }
      })
      setServersChecked(serversFormatted)
    }
  }, [servers])

  const handleAddCargo = async() => {
    try{
      const cargoData = addInputs
      cargoData.individual = true
      let serversData = serversChecked.filter((sv) => { return sv.checked });
      if(isAllServers) {
        serversData = servers
        cargoData.individual = false
      } 
      const addedCargo = await addCargo(cargoData, serversData)
      toast.success(addedCargo.data.message)
    }catch(e){
      toast.error(e.response.data.message)
    }
  }
  
  return (
    <>
      <Layout user={props.user}>
      <div className={styles.cardsContainer}>
          <div className={styles.cardWrapper}>
            <p className={styles.cardTitle}>Adicionar cargo</p>
            <Card style={{width:'100%'}}>
              <form className={styles.inputGroup}>
                <CustomTextField inputProps={{ maxLength: 100}} name="name" placeholder="Cargo legal" onChange={handleAddChange} required label="Nome do cargo"/>
                <CustomTextField inputProps={{ maxLength: 100}} name="price" placeholder="15" onChange={handleAddChange} required label="Preço"/>
                <CustomTextField inputProps={{ maxLength: 100}} name="duration" placeholder="30" onChange={handleAddChange} required label="Tempo de duração (dias)"/>
                <CustomTextField inputProps={{ maxLength: 100}} placeholder="100:z" name="flags" onChange={handleAddChange} required label="Flags"/>
                <CustomTextField inputProps={{ maxLength: 100}} name="stripe_id" placeholder="price_xxxxxxxxxxxxxxxx" onChange={handleAddChange} required label="ID do produto (stripe)"/>


                <div className={styles.serverField}>
                  <Checkbox
                    checked={isAllServers}
                    onChange={(event) => setAllServers(event.target.checked)}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                  <p>Todos os servidores</p>
                </div>
                {servers.length > 0  && serversChecked.length > 0 && !isAllServers?
                <>
                <p className={styles.cardTitle} style={{marginTop: '25px', marginBottom: '15px', fontSize: '20px', fontWeight: 500}}>Servidores (individual)</p>
                  {servers.map((serverInfo, index) => {
                    return(
                      <div className={styles.serverField} key={serverInfo.id}>
                        <Checkbox
                          checked={serversChecked[index].checked}
                          onChange={(event) => handleCheckboxChange(event, index)}
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                        <p>{serverInfo.full_name}</p>
                      </div>
                    )
                  })}
                </>
                : isAllServers ? '' : <p>Nenhum servidor foi encontrado</p>}
              </form>
              <Button variant="contained" color="secondary" className={styles.inputButton} onClick={handleAddCargo}>Adicionar</Button>
            </Card>
          </div>
          <div className={styles.cardWrapper}>
            <p className={styles.cardTitle}>Alterar cargo</p>
            <Card style={{width:'100%'}}>
              <form className={styles.inputGroup}>
              </form>
              <Button variant="contained" color="secondary" className={styles.inputButton}>Alterar</Button>
            </Card>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default ManageCargos

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