import { Button } from "@material-ui/core";
import { FC, useContext, useState } from "react";
import Layout from "components/Layout";
import NotificationSettings from "components/Settings/NotificationSettings";
import router from "lib/router";
import styles from "./panelsettings.module.css";
import { ThemeContext } from "context/ThemeContext";
import { IUser } from "types";

const renderSwitch = (param) => {
  switch (param) {
    case "notifications": {
      return <NotificationSettings />;
    }
  }
};

interface Props {
  user: IUser;
}

const PanelSettings = ({ user }: Props) => {
  const theme = useContext(ThemeContext);
  const [selectedScope, setSelectedScope] = useState<string>("notifications");

  const handleScopeChange = (scope) => {
    setSelectedScope(scope);
  };

  return (
    <>
      <Layout user={user}>
        <div className={styles.container}>
          <p className={styles.title} style={{ color: theme.data.textColor }}>
            Configurações do painel
          </p>
          <div className={styles.buttonsContainer}>
            <Button
              onClick={() => handleScopeChange("notifications")}
              color="primary"
              variant="contained"
              className={styles.button}
            >
              Notificações
            </Button>
          </div>
          <div
            className={styles.content}
            style={{
              backgroundColor: theme.data.backgroundPrimary,
              boxShadow: theme.data.boxShadowCard,
            }}
          >
            {renderSwitch(selectedScope)}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default PanelSettings;

export async function getServerSideProps({ req, res }) {
  await router.run(req, res);
  if (!req.user || req.user.user_type < 2) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { user: req.user || null } };
}
