import { FC, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";

import styles from "./manageservers.module.css";

import Card from "components/Card/Card";
import Layout from "components/Layout";
import router from "lib/router";

import { useContext } from "react";
import ToastContext from "context/ToastContext";
import {
  addServer,
  getAllServersWithRcon,
  updateServer,
  deleteServer,
} from "services/ServerService";
import { ThemeContext } from "context/ThemeContext";
import { makeStyles } from "@material-ui/styles";
import { IUser } from "types";

const useStyles = makeStyles({
  textField: (props: any) => ({
    "& > *": {
      color: props.textColor,
      fontFamily: "Josefin Sans",
    },
    "& > .MuiFormLabel-root ": {
      color: props.textSecondary,
    },
    "& > *::before": {
      borderBottomColor: `${props.textSecondary}`,
    },
    marginBottom: "10px",
    marginLeft: "25px",
    marginRight: "25px",
  }),
  accordion: (props: any) => ({
    "& > *": {
      color: props.textColor,
      borderBottomColor: props.borderBottomColor,
      fontFamily: "Josefin Sans",
    },
    color: props.textColor,
    borderBottomColor: props.borderBottomColor,
    fontFamily: "Josefin Sans",
  }),
});

interface Props {
  user: IUser;
}
const ManageServers = ({ user }: Props) => {
  const theme = useContext(ThemeContext);
  const classes = useStyles(theme.data);
  const toast = useContext(ToastContext);
  const [servers, setServers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [addInputs, setAddInputs] = useState<any>({});
  const handleAddChange = (e) =>
    setAddInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  const [updateInputs, setUpdateInputs] = useState({});
  const handleUpdateChange = (e, server) => {
    let newState = { ...updateInputs };
    if (!newState[server.name]) newState[server.name] = {};
    newState[server.name][e.target.name] = e.target.value;
    setUpdateInputs(newState);
  };

  useEffect(() => {
    updateServers();
  }, []);

  useEffect(() => {
    if (servers.length > 0) {
      let formValues = {};
      for (let server of servers) {
        formValues[server.name] = {
          ...server,
        };
      }
      setUpdateInputs(formValues);
    }
  }, [servers]);

  const updateServers = () => {
    setIsLoading(true);
    getAllServersWithRcon().then((response) => {
      setServers(response.data.body);
      setIsLoading(false);
    });
  };

  const handleUpdateServer = async (event, server) => {
    event.preventDefault();
    try {
      const updatedServer = await updateServer(updateInputs[server.name]);
      toast.success(updatedServer.data.message);
      updateServers();
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  const handleAddServer = async () => {
    try {
      const addedServer = await addServer(addInputs);
      toast.success(addedServer.data.message);
      updateServers();
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  const handleDeleteServer = async (server) => {
    try {
      const deletedServer = await deleteServer(server);
      toast.success(deletedServer.data.message);
      updateServers();
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  return (
    <>
      <Layout user={user}>
        <div
          className={styles.cardsContainer}
          style={{ color: theme.data.textColor }}
        >
          <div className={styles.cardWrapper}>
            <p className={styles.cardTitle}>Adicionar servidor</p>
            <Card
              style={{
                width: "100%",
                backgroundColor: theme.data.backgroundPrimary,
              }}
            >
              <form className={styles.inputGroup}>
                <TextField
                  className={classes.textField}
                  name="full_name"
                  onChange={handleAddChange}
                  required
                  label="Nome do servidor"
                />
                <TextField
                  className={classes.textField}
                  name="name"
                  onChange={handleAddChange}
                  required
                  label="Nome do servidor (definido na cfg do plugin, sem espaços)"
                />
                <TextField
                  className={classes.textField}
                  name="ip"
                  onChange={handleAddChange}
                  required
                  label="IP do servidor"
                />
                <TextField
                  className={classes.textField}
                  name="port"
                  onChange={handleAddChange}
                  required
                  label="Porta do servidor"
                />
                <TextField
                  className={classes.textField}
                  name="rcon_pass"
                  onChange={handleAddChange}
                  required
                  label="Senha RCON"
                />
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "10px" }}
                  onClick={handleAddServer}
                >
                  Adicionar
                </Button>
              </form>
            </Card>
          </div>
          <div className={styles.cardWrapper}>
            <p className={styles.cardTitle}>Alterar servidor</p>
            <Card
              style={{
                width: "100%",
                backgroundColor: theme.data.backgroundPrimary,
              }}
            >
              {isLoading ? (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress
                    style={{ height: "100px", width: "100px" }}
                  />
                </div>
              ) : (
                <>
                  {servers.length > 0 ? (
                    servers.map((server) => {
                      if (updateInputs[server.name])
                        return (
                          <Accordion
                            key={server.id}
                            className={classes.accordion}
                          >
                            <AccordionSummary
                              expandIcon={
                                <FontAwesomeIcon icon={faCaretDown} />
                              }
                              style={{
                                backgroundColor: theme.data.backgroundPrimary,
                              }}
                            >
                              <Typography
                                style={{
                                  fontFamily: "Josefin Sans",
                                  color: theme.data.textAccent,
                                }}
                              >
                                {server.full_name}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                              style={{
                                backgroundColor: theme.data.backgroundPrimary,
                              }}
                            >
                              <form
                                className={styles.inputGroup}
                                onSubmit={(event) =>
                                  handleUpdateServer(event, server)
                                }
                                style={{
                                  width: "100%",
                                  marginTop: "0",
                                  backgroundColor: theme.data.backgroundPrimary,
                                }}
                              >
                                <TextField
                                  className={classes.textField}
                                  inputProps={{ maxLength: 100 }}
                                  name="full_name"
                                  value={updateInputs[server.name].full_name}
                                  onChange={(event) =>
                                    handleUpdateChange(event, server)
                                  }
                                  required
                                  label="Nome do servidor"
                                />
                                <TextField
                                  className={classes.textField}
                                  inputProps={{ maxLength: 100 }}
                                  name="name"
                                  value={updateInputs[server.name].name}
                                  onChange={(event) =>
                                    handleUpdateChange(event, server)
                                  }
                                  required
                                  label="Nome do servidor (definido na cfg do plugin)"
                                />
                                <TextField
                                  className={classes.textField}
                                  inputProps={{ maxLength: 100 }}
                                  name="ip"
                                  value={updateInputs[server.name].ip}
                                  onChange={(event) =>
                                    handleUpdateChange(event, server)
                                  }
                                  required
                                  label="IP do servidor"
                                />
                                <TextField
                                  className={classes.textField}
                                  inputProps={{ maxLength: 100 }}
                                  name="port"
                                  value={updateInputs[server.name].port}
                                  onChange={(event) =>
                                    handleUpdateChange(event, server)
                                  }
                                  required
                                  label="Porta do servidor"
                                />
                                <TextField
                                  className={classes.textField}
                                  inputProps={{ maxLength: 100 }}
                                  name="rcon_pass"
                                  value={updateInputs[server.name].rcon_pass}
                                  onChange={(event) =>
                                    handleUpdateChange(event, server)
                                  }
                                  required
                                  label="Senha RCON"
                                />
                                <div
                                  style={{ display: "flex", marginTop: "10px" }}
                                >
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                  >
                                    Alterar
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteServer(server)}
                                    variant="contained"
                                    color="secondary"
                                    style={{
                                      backgroundColor: "red",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    Deletar
                                  </Button>
                                </div>
                              </form>
                            </AccordionDetails>
                          </Accordion>
                        );
                    })
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "200px",
                      }}
                    >
                      <p style={{ fontSize: "30px", fontWeight: 300 }}>
                        Nenhum servidor encontrado.
                      </p>
                    </div>
                  )}
                </>
              )}
            </Card>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ManageServers;

export async function getServerSideProps({ req, res }) {
  await router.run(req, res);
  if (!req.user || req.user.user_type < 1) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { user: req.user || null } };
}
