import { FC, useEffect, useState } from "react";
import { TextField, Button, withStyles, Typography } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import styles from './manageservers.module.css'

import Card from "../../components/Card/Card";
import Layout from "../../components/Layout";
import router from "../../lib/router";

import { useContext } from "react";
import ToastContext from "../../context/ToastContext";
import { addServer, getAllServersWithRcon, updateServer } from '../../services/ServerService'

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
    }
  },
})(TextField);

const CustomAccordion = withStyles({
  root: {
    '& > *': {
      color: 'black',
      borderBottomColor: 'black',
      fontFamily: 'Josefin Sans',
    },
    color: 'black',
    borderBottomColor: 'black',
    fontFamily: 'Josefin Sans',
  },
})(Accordion);



const ManageServers: FC<any> = (props) => {
  const toast = useContext(ToastContext)
  const [servers, setServers] = useState([])


  const [addInputs, setAddInputs] = useState<any>({});
  const handleAddChange = e => setAddInputs(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  const [updateInputs, setUpdateInputs] = useState({});
  const handleUpdateChange = (e, server) =>  {
    let newState = {...updateInputs}
    if(!newState[server.name]) newState[server.name] = {}
    newState[server.name][e.target.name] = e.target.value
    setUpdateInputs(newState)
  }
  
  
  useEffect(() => {
    updateServers()
  },[])

  useEffect(() => {
    if(servers.length > 0) {
      let formValues = {}
      for(let server of servers) {
        formValues[server.name] = {
          ...server
        }
      }
      setUpdateInputs(formValues)
    }
  }, [servers])

  const updateServers = () => {
    getAllServersWithRcon()
    .then((response) => setServers(response.data.body))
  }

  const handleUpdateServer = async(event, server) => {
    event.preventDefault()
    try{
      const updatedServer = await updateServer(updateInputs[server.name])
      toast.success(updatedServer.data.message)
      updateServers()
    }catch(e) {
      toast.error(e.response.data.message)
    }
  }

  const handleAddServer = async() => {
    try{
      const addedServer = await addServer(addInputs)
      toast.success(addedServer.data.message)
      updateServers()
    }catch(e){
      toast.error(e.response.data.message)
    }
  }

  return (
    <>
      <Layout user={props.user}>
        <div className={styles.cardsContainer}>
          <div className={styles.cardWrapper}>
            <p className={styles.cardTitle}>Adicionar servidor</p>
            <Card style={{width:'100%'}}>
              <form className={styles.inputGroup}>
                <CustomTextField inputProps={{ maxLength: 100}} name="full_name" onChange={handleAddChange} required label="Nome do servidor" />
                <CustomTextField inputProps={{ maxLength: 100}} name="name" onChange={handleAddChange} required label="Nome do servidor (definido na cfg do plugin, sem espaços)" />
                <CustomTextField inputProps={{ maxLength: 100}} name="ip" onChange={handleAddChange} required label="IP do servidor" />
                <CustomTextField inputProps={{ maxLength: 100}} name="port" onChange={handleAddChange} required label="Porta do servidor" />
                <CustomTextField inputProps={{ maxLength: 100}} name="rcon_pass" onChange={handleAddChange} required label="Senha RCON" />
              </form>
              <Button variant="contained" color="secondary" className={styles.inputButton} onClick={handleAddServer}>Adicionar</Button>
            </Card>
          </div>
          <div className={styles.cardWrapper}>
            <p className={styles.cardTitle}>Alterar servidor</p>
            <Card style={{width:'100%'}}>
              {servers.length > 0 && servers.map((server) => {
                
                if (updateInputs[server.name]) return <CustomAccordion key={server.id}>
                <AccordionSummary
                  expandIcon={<FontAwesomeIcon icon={faCaretDown} />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography style={{fontFamily: 'Josefin Sans'}}>{server.full_name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <form className={styles.inputGroup} onSubmit={(event) => handleUpdateServer(event, server)} style={{width: '100%'}}>
                    <CustomTextField inputProps={{ maxLength: 100}} name="full_name" value={updateInputs[server.name].full_name} onChange={(event) => handleUpdateChange(event, server)} required label="Nome do servidor" />
                    <CustomTextField inputProps={{ maxLength: 100}} name="name" value={updateInputs[server.name].name} onChange={(event) => handleUpdateChange(event, server)} required label="Nome do servidor (definido na cfg do plugin)" />
                    <CustomTextField inputProps={{ maxLength: 100}} name="ip" value={updateInputs[server.name].ip} onChange={(event) => handleUpdateChange(event, server)} required label="IP do servidor" />
                    <CustomTextField inputProps={{ maxLength: 100}} name="port" value={updateInputs[server.name].port} onChange={(event) => handleUpdateChange(event, server)} required label="Porta do servidor" />
                    <CustomTextField inputProps={{ maxLength: 100}} name="rcon_pass" value={updateInputs[server.name].rcon_pass} onChange={(event) => handleUpdateChange(event, server)} required label="Senha RCON" />
                    <Button type="submit" variant="contained" color="secondary" className={styles.inputButton}>Alterar</Button>
                  </form>
                </AccordionDetails>
              </CustomAccordion>
              })}
            </Card>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default ManageServers

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