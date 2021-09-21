import { Button, Checkbox, CircularProgress, TextField } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/styles";
import { useContext, useEffect, useState } from "react"
import ToastContext from "context/ToastContext";
import { getAllSettings, testDiscordHook, updateSettings } from "services/SettingsService"
import styles from './notificationsettings.module.css'
import { ThemeContext } from "context/ThemeContext";

interface INotificationSettings {
  id: number
  community_website: string
  community_name: string
  logo_url: string
  webhook_url: string
  send_disc_on_modification: boolean
  send_disc_on_sale: boolean
  send_discord_notifications: boolean
  send_email_sale: boolean
}

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
    width: '400px'
  })
})

export default function NotificationSettings() {
  const theme = useContext(ThemeContext)
  const classes = useStyles(theme.data)
  const toast = useContext(ToastContext)
  const [settings, setSettings] = useState<INotificationSettings>()
  const [isLoading, setIsLoading] = useState(true)

  const onUpdateForm = (value, key) => {
    const newData = {...settings}
    newData[key] = value
    setSettings(newData)
  }

  const refreshSettings = async() => {
    try{
      setIsLoading(true)
      const foundSettings = await getAllSettings('notifications')
      setSettings(foundSettings.data.body)
      setIsLoading(false)
    }catch(e) {
      console.error(e)
    }
  }

  const handleUpdateSettings = async() => {
    try{
      const updatedSettings = await updateSettings({data: settings, scope: 'notifications'})
      toast.success(updatedSettings.data.message)
    }catch(e) {
      toast.error(e.response.data.message)
    }
  }

  const handleTestWebhook = async() => {
    try{
      await testDiscordHook(settings.webhook_url)
    }catch(e) {
      console.error(e.message)
    }
  }

  useEffect(() => {
    refreshSettings()
  }, [])

  if(!settings || isLoading) {
    return (
      <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '50px'}}>
        <CircularProgress style={{height: '100px', width: '100px'}}/> 
      </div>
    )
  }

  return (
    <div style={{marginTop: '25px', display: 'flex', alignItems: 'center', flexDirection: 'column', color: theme.data.textColor}}>
      <p style={{fontSize: '24px', fontWeight: 400, fontStyle: 'italic'}}>Configurações de notificações</p>
      <div style={{display: 'flex', flexDirection: 'column', marginTop: '10px', alignItems: 'flex-start'}}>
        <TextField className={classes.textField} value={settings['community_name']} onChange={(event) => onUpdateForm(event.target.value, 'community_name')} label="Nome da comunidade"/>
        <TextField className={classes.textField} value={settings['community_website']} onChange={(event) => onUpdateForm(event.target.value, 'community_website')} label="Website da comunidade"/>
        <TextField className={classes.textField} value={settings['logo_url']} onChange={(event) => onUpdateForm(event.target.value, 'logo_url')} label="Logo da comunidade (url)"/>
        <TextField className={classes.textField} value={settings['webhook_url']} onChange={(event) => onUpdateForm(event.target.value, 'webhook_url')} label="Url do webhook"/>
        <div className={styles.checkboxArea}>
          <Checkbox checked={settings['send_discord_notifications']} onChange={(event) => onUpdateForm(event.target.checked, 'send_discord_notifications')} inputProps={{ 'aria-label': 'primary checkbox' }}/>
          <p className={styles.checkboxText}>Enviar notificações</p>
        </div>
        <div className={styles.checkboxArea}>
          <Checkbox checked={settings['send_disc_on_modification']} onChange={(event) => onUpdateForm(event.target.checked, 'send_disc_on_modification')} inputProps={{ 'aria-label': 'primary checkbox' }}/>
          <p className={styles.checkboxText}>Notificar ao correr alguma mudança no painel</p>
        </div>
        <div className={styles.checkboxArea}>
          <Checkbox checked={settings['send_disc_on_sale']} onChange={(event) => onUpdateForm(event.target.checked, 'send_disc_on_sale')} inputProps={{ 'aria-label': 'primary checkbox' }}/>
          <p className={styles.checkboxText}>Notificar quando uma compra for aprovada</p>
        </div>
        <div className={styles.checkboxArea}>
          <Checkbox checked={settings['send_email_sale']} onChange={(event) => onUpdateForm(event.target.checked, 'send_email_sale')} inputProps={{ 'aria-label': 'primary checkbox' }}/>
          <p className={styles.checkboxText}>Enviar emails para o usuário quando os status de sua compra for alterado</p>
        </div>
        <div style={{display: 'flex', marginTop: '25px', marginLeft: '25px', marginBottom: '25px'}}>
          <Button style={{fontFamily: 'Josefin Sans'}} color="primary" variant="contained" onClick={handleUpdateSettings}>Salvar</Button>
          <Button style={{marginLeft: '10px', backgroundColor: 'red', color: 'white', fontFamily: 'Josefin Sans'}} variant="contained" onClick={handleTestWebhook}>Testar webhook</Button>
        </div>
      </div>
    </div>
  )
}