import { Button } from "@material-ui/core";
import { FC, useState } from "react";
import Layout from "../../components/Layout";
import NotificationSettings from "../../components/Settings/NotificationSettings";
import router from "../../lib/router";
import styles from './panelsettings.module.css'

const renderSwitch = (param) => {
  switch(param) {
    case 'notifications': {
      return <NotificationSettings/>
    }
  }
}

const PanelSettings: FC<any> = (props) => {
  const [selectedScope, setSelectedScope] = useState<string>('notifications')

  const handleScopeChange = (scope) => {
    setSelectedScope(scope)
  }

  return (
    <>
      <Layout user={props.user}>
        <div className={styles.container}>
          <p className={styles.title}>Configurações do painel</p>
          <div className={styles.buttonsContainer}>
            <Button onClick={() => handleScopeChange('notifications')} color="primary" variant="contained" className={styles.button}>
              Notificações
            </Button>
          </div>
          <div className={styles.content}>
            {renderSwitch(selectedScope)}
          </div>
        </div>
      </Layout>
    </>
  )
}

export default PanelSettings

export async function getServerSideProps({ req, res}) {
	await router.run(req, res);
  if(!req.user || req.user.user_type < 2) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
	return { props: { user: req.user || null } };
}