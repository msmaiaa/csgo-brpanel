import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, AccordionDetails, AccordionSummary, Button, FormControl, MenuItem, Select, TextField, Typography, withStyles } from "@material-ui/core";
import { FC, useContext, useEffect, useState } from "react";
import ToastContext from "context/ToastContext";
import { addCargosToUser, getAllCargos, getNonIndividualCargos, ICargo, removeCargosFromUser } from "services/CargoService";
import { getAllServersWithCargo, IServer } from "services/ServerService";
import { IUser, updateUser } from "services/UserService";
import styles from './updateuser.module.css'


interface IProps {
  selectedData: IUser
  updateUserInfo()
}

interface ICargo_Server {
  cargo_id: number
  id: number
  server_id: number
  cargo: ICargo
}

const CustomAccordion = withStyles({
  root: {
    '& > *': {
      fontFamily: 'Josefin Sans',
    },
  },
})(Accordion);

const StyledTextField = withStyles({
  root: {
    '& > *': {
      fontFamily: 'Josefin Sans',
      height: '30px'
    },
  },
})(TextField)


const FormUpdateUser:FC<IProps> = ({ selectedData, updateUserInfo }: IProps) => {
  const toast = useContext(ToastContext)
  const [infoData, setInfoData] = useState<IUser | {}>({})
  const [userTypeInput, setUserTypeInput] = useState<any>(0)
  const [cargosAllServers, setCargosAllServers] = useState([])
  const [serversWithCargo, setServersWithCargo] = useState([])

  useEffect(() => {
    if(selectedData) {
      setInfoData(selectedData)
      setUserTypeInput(selectedData.user_type)
    }
  },[selectedData])

  const updateCargosData = async() => {
    try{
      let mounted = true
      const svsWithCargo = await getAllServersWithCargo()
      const niCargos = await getNonIndividualCargos()
      if(mounted) {
        setCargosAllServers(niCargos.data.body)
        setServersWithCargo(svsWithCargo.data.body)
      }
      return () => {
        mounted = false
      }
    }catch(e) {
      toast.error('Erro ao tentar recuperar informações sobre os cargos.')
    }
  }

  useEffect(() => {
    updateCargosData()
  }, [])

  const handleUpdateUType = async() => {
    try{
      const updatedUser = await updateUser(selectedData.id, {user_type: userTypeInput})
      updateUserInfo()
      toast.success(updatedUser.data.message)
    }catch(e) {
      toast.error(e.response.data.message)
    }
  }

  const handleAddCargo = async(cargo: ICargo, days: number, server: IServer | string) => {
    try{
      const addedCargos = await addCargosToUser({cargo, days, server, user: selectedData})
      updateUserInfo()
      toast.success(addedCargos.data.message)
    }catch(e){
      toast.error(e.response.data.message)
    }
  }
  
  const handleDeleteCargos = async() => {
    try{
      const removedCargosFromUser = await removeCargosFromUser(selectedData)
      updateUserInfo()
      toast.success(removedCargosFromUser.data.message)
    }catch(e){
      toast.error(e.response.data.message)
    }
  }

  if(!selectedData) return (
    <p style={{width: '100%', height: '100%', textAlign:'center', fontSize: '24px', marginTop: '25px'}}>Selecione um usuário</p>
  )

  return(
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <div style={{marginLeft: '20px', marginTop: '20px'}}>
        <p className={styles.title}>Informações</p>
        <div style={{display: 'flex', alignItems: 'center', height: '20px', marginTop: '15px'}}>
          <p style={{color: 'blue'}}>Permissões: </p>
          <FormControl style={{display: 'flex', alignItems:'flex-start', height: '20px', marginLeft: '15px'}}>
            <Select
              value={userTypeInput}
              onChange={(event) => setUserTypeInput(event.target.value)}
              style={{fontFamily: 'Josefin Sans', minWidth: '80px'}}
              >
              <MenuItem style={{fontFamily: 'Josefin Sans'}} value={0} className={styles.menuitem}>Comum</MenuItem>
              <MenuItem style={{fontFamily: 'Josefin Sans'}} value={1} className={styles.menuitem}>Admin</MenuItem>
              <MenuItem style={{fontFamily: 'Josefin Sans'}} value={2} className={styles.menuitem}>Super Admin</MenuItem>
            </Select>
          </FormControl>
          <Button onClick={handleUpdateUType} color="primary" variant="contained" style={{height: '26px', width: '80px', fontSize: '14px', marginLeft: '10px'}}>Salvar</Button>
        </div>
      </div>
      <div style={{marginLeft: '20px', marginTop: '20px', marginRight: '20px'}}>
        <p className={styles.title}>Adicionar cargos</p>
        <p style={{ color: 'gray', marginTop: '5px', fontSize: '14px' }}>
        Caso o usuário já possua um cargo no servidor, 
        as flags do novo cago irão sobrepor às do cargo antigo e os dias serão somados.
        </p>
        <div style={{marginTop: '20px'}}>
          {cargosAllServers.length > 0 && 
          <CustomAccordion>
            <AccordionSummary
              expandIcon={<FontAwesomeIcon icon={faCaretDown} />}
            >
              <Typography style={{fontFamily: 'Josefin Sans'}}>Todos os servidores</Typography>
            </AccordionSummary>
            <AccordionDetails style={{display: 'flex', flexDirection: 'column'}}>
              {cargosAllServers.map((cargo: ICargo) => {
                  return (
                    <div key={cargo.id} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', marginTop: '15px'}}>
                      <>
                        <p style={{color: 'blue', fontSize: '16px', width: '60px'}}>{cargo.name}</p>
                      </>
                      <>
                        <Button onClick={() => handleAddCargo(cargo, 1, 'all')} variant="contained" color="primary" className={styles.button}>1 dia</Button>
                        <Button onClick={() => handleAddCargo(cargo, 15, 'all')} variant="contained" color="secondary" className={styles.button}>15 dias</Button>
                        <Button onClick={() => handleAddCargo(cargo, 30, 'all')} variant="contained" style={{backgroundColor: 'red', color: 'white'}} className={styles.button}>30 dias</Button>
                      </>
                    </div>
                  )
              })}
            </AccordionDetails>
          </CustomAccordion>
          }
          {serversWithCargo.length > 0 && 
            <>
              {serversWithCargo.map((server) => {
                return (
                  <CustomAccordion key={server.id}>
                    <AccordionSummary
                      expandIcon={<FontAwesomeIcon icon={faCaretDown} />}
                    >
                    <Typography style={{fontFamily: 'Josefin Sans'}}>{server.full_name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {server.cargo_server.length > 0 && 
                      <>
                        {server.cargo_server.map((cargo_sv: ICargo_Server) => {
                          return (
                            <div key={cargo_sv.id} style={{display: 'flex', alignItems: 'center'}}>
                              <p style={{color: 'blue', fontSize: '16px', marginRight: '10px'}}>{cargo_sv.cargo.name} - </p>
                              <Button onClick={() => handleAddCargo(cargo_sv.cargo, 1, server)} variant="contained" color="primary" className={styles.button}>1 dia</Button>
                              <Button onClick={() => handleAddCargo(cargo_sv.cargo, 15, server)} variant="contained" color="secondary" className={styles.button}>15 dias</Button>
                              <Button onClick={() => handleAddCargo(cargo_sv.cargo, 30, server)} variant="contained" style={{backgroundColor: 'red', color: 'white'}} className={styles.button}>30 dias</Button>
                            </div>
                          )
                        })}
                      </>
                    }
                  </AccordionDetails>
                  </CustomAccordion>
                )
              })}
            </>
          }
        </div>
        {selectedData.user_cargo.length > 0 &&
        <Button variant="contained" style={{backgroundColor: 'red', color: 'white', marginTop: '10px'}} onClick={handleDeleteCargos}>Remover todos os cargos do usuário</Button>
        }
      </div>
    </div>
  )
} 

export default FormUpdateUser