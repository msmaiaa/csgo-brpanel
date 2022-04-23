import { useContext, useEffect, useState } from "react";
import { Button, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Link from "next/link";

import styles from "./ServerCard.module.css";
import { getServerStatus } from "services/ServerService";
import { ThemeContext } from "context/ThemeContext";
import { IServerQueryResponse } from "types";

const useStyles = makeStyles({
  card: (props: any) => ({
    boxShadow: props.boxShadowCard,
  }),
});

const ServerCard = ({ server, style }) => {
  const theme = useContext(ThemeContext);
  const classes = useStyles(theme);
  const [isLoading, setIsLoading] = useState(true);
  const [serverInfo, setServerInfo] = useState<IServerQueryResponse>({});

  useEffect(() => {
    let isMounted = true;
    getServerStatus(server)
      .then((response) => {
        if (isMounted) {
          const responseData: IServerQueryResponse | any = {
            ...response.data.body,
          };
          setServerInfo({
            online: true,
            data: responseData,
          });
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (!isMounted) return;
        setServerInfo({
          online: false,
        });
        setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          ...style,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "10px",
          boxShadow: theme.data.boxShadowCard,
        }}
        className={classes.card}
      >
        <CircularProgress style={{ height: "50px", width: "50px" }} />
      </div>
    );
  }
  return (
    <div
      style={{
        ...style,
        borderRadius: "10px",
        boxShadow: theme.data.boxShadowCard,
      }}
      className={classes.card}
    >
      <div style={{ margin: "25px" }} className={classes.card}>
        {serverInfo.online ? (
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <p className={styles.cardTitle}>{server.full_name}</p>
              <p className={styles.cardStatusOnline}>online</p>
            </div>
            <div className={styles.cardFooter}>
              <p className={styles.players}>
                Jogadores online:{" "}
                <span style={{ color: theme.data.textAccent }}>
                  {serverInfo.data.raw.numplayers}
                </span>
              </p>
              <p className={styles.players}>
                Mapa atual:{" "}
                <span style={{ color: theme.data.textAccent }}>
                  {serverInfo.data.map}
                </span>
              </p>
              <Link href={`steam://connect/${serverInfo.data.connect}`}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    width: "95px",
                    height: "30px",
                    fontFamily: "Josefin Sans",
                  }}
                >
                  Conectar
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className={styles.cardTitle}>{server.full_name}</p>
            <p className={styles.cardStatusOffline}>offline</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ServerCard;
