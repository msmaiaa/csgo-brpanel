import { Button, FormControl, MenuItem, Select, TextField, withStyles } from "@material-ui/core";
import { FC, useContext, useEffect, useState } from "react";
import ToastContext from "../../context/ToastContext";
import { IUser, updateUser } from "../../services/UserService";
import styles from './updateuser.module.css'


interface IProps {
  selectedData: IUser
  updateUserInfo()
}


const FormUpdateUser:FC<IProps> = ({ selectedData, updateUserInfo }: IProps) => {
  const toast = useContext(ToastContext)
  const [infoData, setInfoData] = useState<IUser | {}>({})
  const [userTypeInput, setUserTypeInput] = useState<any>(0)

  useEffect(() => {
    if(selectedData) {
      setInfoData(selectedData)
      setUserTypeInput(selectedData.user_type)
    }
  },[selectedData])

  const handleUpdateUType = async() => {
    try{
      const updatedUser = await updateUser(selectedData.id, {user_type: userTypeInput})
      updateUserInfo()
      toast.success(updatedUser.data.message)
    }catch(e) {
      toast.error(e.response.data.message)
    }
  }

  if(!selectedData) return (
    <p style={{width: '100%', height: '100%', textAlign:'center', fontSize: '24px', marginTop: '25px'}}>Selecione um usuário :)</p>
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
              style={{fontFamily: 'Josefin Sans', minWidth: '80px', height: '20px'}}
              >
              <MenuItem style={{fontFamily: 'Josefin Sans'}} value={0} className={styles.menuitem}>Comum</MenuItem>
              <MenuItem style={{fontFamily: 'Josefin Sans'}} value={1} className={styles.menuitem}>Admin</MenuItem>
              <MenuItem style={{fontFamily: 'Josefin Sans'}} value={2} className={styles.menuitem}>Super Admin</MenuItem>
            </Select>
          </FormControl>
          <Button onClick={handleUpdateUType} color="primary" variant="contained" style={{height: '26px', width: '80px', fontSize: '14px', marginLeft: '10px'}}>Salvar</Button>
        </div>
      </div>
      <div style={{marginLeft: '20px', marginTop: '20px'}}>
        <p className={styles.title}>Cargos</p>
      </div>
    </div>
  )
} 

export default FormUpdateUser