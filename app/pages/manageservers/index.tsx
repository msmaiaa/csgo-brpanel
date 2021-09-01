import { FC, useState } from "react";
import { TextField, Button, withStyles } from '@material-ui/core'
import styles from './manageservers.module.css'

import Card from "../../components/Card/Card";
import Layout from "../../components/Layout";
import router from "../../lib/router";

import { useContext } from "react";
import ToastContext from "../../context/ToastContext";
import { addServer } from '../../services/ServerService'

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

const ManageServers: FC<any> = (props) => {
  const toast = useContext(ToastContext)

  const [addInputs, setAddInputs] = useState<any>({});
  const handleAddChange = e => setAddInputs(prevState => ({ ...prevState, [e.target.name]: e.target.value }));

  const [updateInputs, setUpdateInputs] = useState({});
  const handleUpdateChange = e => setUpdateInputs(prevState => ({ ...prevState, [e.target.name]: e.target.value }));

  const handleAddServer = async() => {
    try{
      const addedServer = await addServer(addInputs)
      toast.success(addedServer.data.message)
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
                <CustomTextField inputProps={{ maxLength: 100}} name="name" onChange={handleAddChange} required label="Nome do servidor (definido na cfg do plugin)" />
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
              <form className={styles.inputGroup}>
                <CustomTextField label="Nome do servidor" />
                <CustomTextField label="Nome do servidor (definido na cfg do plugin)" />
                <CustomTextField label="IP do servidor" />
                <CustomTextField label="Senha RCON" />
              </form>
              <Button variant="contained" color="secondary" className={styles.inputButton}>ADD</Button>
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