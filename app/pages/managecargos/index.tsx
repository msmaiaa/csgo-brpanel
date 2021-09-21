import Card from "components/Card/Card";
import Layout from "components/Layout";
import ToastContext from "context/ToastContext";
import router from "lib/router";
import styles from './managecargos.module.css'
import { addCargo, deleteCargo, getAllCargos, ICargo, updateCargo } from "services/CargoService";
import { getAllServers } from "services/ServerService";

import { FC, useContext, useEffect, useState } from "react";
import { TextField, Button, Checkbox, AccordionSummary, Typography, Accordion, AccordionDetails, CircularProgress, makeStyles } from '@material-ui/core'
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeContext } from "context/ThemeContext";

const useStyles = makeStyles({
  textField: (props: any) => ({
    '& > *': {
      color: props.textColor,
      fontFamily: 'Josefin Sans',
    },
    '& > .MuiFormLabel-root ': {
      color: props.textSecondary,
    },
    '& > *::before': {
      borderBottomColor: `${props.textSecondary}`,
    },
    marginBottom: '10px',
    marginLeft: '25px',
    marginRight: '25px',
    
  }),
  accordion: (props: any) => ({
    '& > *': {
      color: props.textColor,
      borderBottomColor: props.borderBottomColor,
      fontFamily: 'Josefin Sans',
    },
    color: props.textColor,
    borderBottomColor: props.borderBottomColor,
    fontFamily: 'Josefin Sans',
  })
})

const ManageCargos: FC<any> = (props) => {
  const toast = useContext(ToastContext)
  const theme = useContext(ThemeContext)
  const classes = useStyles(theme.data)
  const [addInputs, setAddInputs] = useState<any>({});
  const handleAddChange = e => setAddInputs(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  const [updateInputs, setUpdateInputs] = useState({});
  const handleUpdateChange = (e, cargo, checkbox=false, isSingleServer=false) =>  {
    let parsedValue = e.target.value
    let newState = {...updateInputs}
    if(!newState[cargo.name]) newState[cargo.name] = {}
    if(checkbox) {
      parsedValue = JSON.parse(e.target.value)
      const allServers = parsedValue.allServers
      if(allServers) {
        newState[cargo.name].individual = !newState[cargo.name].individual
        newState[cargo.name].servers = []
      }
      if(isSingleServer) {
        const serverInfo = parsedValue.serverInfo
        if(e.target.checked) {
          newState[cargo.name].servers.push(serverInfo)
          if (!updateInputs[cargo.name].individual) updateInputs[cargo.name].individual = true
        }else {
          newState[cargo.name].servers = newState[cargo.name].servers.filter((sv) => {
            return sv.id != serverInfo.id
          })
        }
      }
    }else{
      newState[cargo.name][e.target.name] = e.target.value
    }
    setUpdateInputs(newState)
  }

  const [servers, setServers] = useState([])
  const [serversChecked, setServersChecked] = useState([])
  const [isAllServers, setAllServers] = useState(false)
  const [cargosFromDb, setCargosFromDb] = useState<Array<ICargo>>([])
  const [isLoadingServers, setIsLoadingServers] = useState(true)
  const [isLoadingCargos, setIsLoadingCargos] = useState(true)

  useEffect(() => {
    setIsLoadingServers(true)
    getAllServers()
    .then((response) => {
      setServers(response.data.body)
      setIsLoadingServers(false)
    })
    updateCargos()
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

  useEffect(() => {
    if(cargosFromDb.length > 0) {
      let formValues = {}
      for(let cargo of cargosFromDb) {
        formValues[cargo.name] = {
          ...cargo,
        }
        formValues[cargo.name].servers =  cargo.cargo_server.map((data) => {
          return data.server
        })
        delete formValues[cargo.name].cargo_server
      }
      setUpdateInputs(formValues)
    }
  }, [cargosFromDb])

  const updateCargos = () => {
    setIsLoadingCargos(true)
    getAllCargos()
    .then((response) => {
      setCargosFromDb(response.data.body)
      setIsLoadingCargos(false)
    })
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let updatedServersChecked = [...serversChecked]
    updatedServersChecked[index].checked = event.target.checked
    setServersChecked(updatedServersChecked)
  };

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
      updateCargos()
    }catch(e){
      toast.error(e.response.data.message)
    }
  }

  const handleUpdateCargo = async(event, cargo) => {
    try{
      event.preventDefault()
      const updatedCargo = await updateCargo(updateInputs[cargo.name])
      toast.success(updatedCargo.data.message)
      updateCargos()
    }catch(e){
      toast.error(e.response.data.message)
    }
  }

  const handleDeleteCargo = async(cargo) => {
    try{
      const deletedCargo = await deleteCargo(updateInputs[cargo.name])
      toast.success(deletedCargo.data.message)
      updateCargos()
    }catch(e){
      toast.error(e.response.data.message)
    }
  }
  
  return (
    <>
      <Layout user={props.user}>

      <div className={styles.cardsContainer} style={{color: theme.data.textColor}}>
          <div className={styles.cardWrapper}>
            <p className={styles.cardTitle}>Adicionar cargo</p>
            <Card style={{width:'100%', backgroundColor: theme.data.backgroundPrimary}}>
              <form className={styles.inputGroup}>
                <TextField className={classes.textField} inputProps={{ maxLength: 100}} name="name" placeholder="Cargo legal" onChange={handleAddChange} required label="Nome do cargo"/>
                <TextField className={classes.textField} inputProps={{ maxLength: 100}} name="price" placeholder="15" onChange={handleAddChange} required label="Preço"/>
                <TextField className={classes.textField} inputProps={{ maxLength: 100}} name="duration" placeholder="30" onChange={handleAddChange} required label="Tempo de duração (dias)"/>
                <TextField className={classes.textField} inputProps={{ maxLength: 100}} name="flags" placeholder="100:z" onChange={handleAddChange} required label="Flags"/>
                {isLoadingServers ? 
                <CircularProgress style={{height: '100px', width: '100px'}}/> 
                :
                <>
                <div className={styles.serverField}>
                  <Checkbox
                    checked={isAllServers}
                    onChange={(event) => setAllServers(event.target.checked)}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                  <p>Todos os servidores</p>
                </div>
                  <div>
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
                  : isAllServers ? '' : <p style={{margin: '15px 0 10px 0'}}>Nenhum servidor foi encontrado</p>}
                  </div>
                </>
                }
                <Button style={{width: '100px'}} variant="contained" color="primary" className={styles.inputButton} onClick={handleAddCargo}>Adicionar</Button>
              </form>
            </Card>
          </div>

          <div className={styles.cardWrapper}>
            <p className={styles.cardTitle} style={{color: theme.data.textColor}}>Alterar cargos</p>
            <Card style={{width:'100%', backgroundColor: theme.data.backgroundPrimary}}>
              {isLoadingCargos ? 
              <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px'}}>
                <CircularProgress style={{height: '100px', width: '100px'}}/> 
              </div>
               :
               <>
              {cargosFromDb.length > 0 ? cargosFromDb.map((cargo) => {
                if (updateInputs[cargo.name]) return <Accordion key={cargo.id} className={classes.accordion}>
                <AccordionSummary
                  expandIcon={<FontAwesomeIcon icon={faCaretDown} />}
                  style={{backgroundColor: theme.data.backgroundPrimary}}
                >
                  <Typography style={{fontFamily: 'Josefin Sans', color: theme.data.textAccent}}>{cargo.name}</Typography>
                </AccordionSummary>
                <AccordionDetails style={{backgroundColor: theme.data.backgroundPrimary}}>
                  <form className={styles.inputGroup} onSubmit={(event) => handleUpdateCargo(event, cargo)} style={{width: '100%'}}>
                    <TextField className={classes.textField} inputProps={{ maxLength: 100}} name="name" value={updateInputs[cargo.name].name} onChange={(event) => handleUpdateChange(event, cargo)} required label="Nome do cargo" />
                    <TextField className={classes.textField} inputProps={{ maxLength: 100}} name="price" value={updateInputs[cargo.name].price} onChange={(event) => handleUpdateChange(event, cargo)} required label="Preço" />
                    <TextField className={classes.textField} inputProps={{ maxLength: 100}} name="duration" value={updateInputs[cargo.name].duration} onChange={(event) => handleUpdateChange(event, cargo)} required label="Tempo de duração (dias)" />
                    <TextField className={classes.textField} inputProps={{ maxLength: 100}} name="flags" value={updateInputs[cargo.name].flags} onChange={(event) => handleUpdateChange(event, cargo)} required label="Flags" />
                    {/* <CustomTextField inputProps={{ maxLength: 100}} name="stripe_id" value={updateInputs[cargo.name].stripe_id} onChange={(event) => handleUpdateChange(event, cargo)} required label="Id do produto (stripe)" /> */}
                      {isLoadingServers  || isLoadingCargos ? 
                      <CircularProgress style={{height: '100px', width: '100px'}}/> 
                      :
                      <>
                    <div className={styles.serverField}>
                      <Checkbox
                        value={JSON.stringify({allServers: true})}
                        name="individual"
                        checked={!updateInputs[cargo.name].individual}
                        onChange={(event) => handleUpdateChange(event, cargo, true)}
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
                                  value={JSON.stringify({allServers: false, serverInfo})}
                                  checked={updateInputs[cargo.name].servers.find((sv) => sv.id == serverInfo.id) ? true : false}
                                  onChange={(event) => handleUpdateChange(event, cargo, true, true)}
                                  inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                                <p>{serverInfo.full_name}</p>
                              </div>
                            )
                          })}
                        </>
                        : isAllServers ? '' : <p style={{marginTop: '5px', marginBottom: '5px'}}>Nenhum servidor foi encontrado</p>}        
                      </>          
                    }
                        <div style={{display: 'flex'}}>
                          <Button type="submit" variant="contained" color="primary" className={styles.inputButton}>Alterar</Button>
                          <Button onClick={() => handleDeleteCargo(cargo)} variant="contained" style={{backgroundColor: 'red', color: 'white', marginLeft: '15px'}} className={styles.inputButton}>Deletar</Button>
                        </div>
                  </form>
                </AccordionDetails>
              </Accordion>
              }) : 
                <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px'}}>
                  <p style={{fontSize: '30px', fontWeight: 300}}>Nenhum cargo encontrado.</p> 
                </div>
              }
              </>
              }
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