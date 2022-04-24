import {
  Button,
  CircularProgress,
  FormControl,
  makeStyles,
  Select,
  TextField,
} from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { MenuItem } from "react-pro-sidebar";
import ToastContext from "context/ToastContext";
import { getSteamUserData } from "services/SteamService";
import { createUser } from "services/UserService";
import styles from "./steamform.module.css";
import { ThemeContext } from "context/ThemeContext";
import { ISteamApiUser } from "types";

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
  select: (props: any) => ({
    "& > *": {
      backgroundColor: `${props.backgroundPrimary} !important`,
      color: `${props.textColor} !important`,
    },
    backgroundColor: `${props.backgroundPrimary} !important`,
    color: `${props.textColor} !important`,
  }),
  menuitem: (props: any) => ({
    minHeight: "25px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: props.textColor,
    backgroundColor: props.backgroundPrimary,
    "&:not(:last-of-type)": {
      marginBottom: "10px",
    },
    "&:hover": {
      cursor: "pointer",
    },
  }),
});

interface Props {
  onAddUser: () => void;
}
const SteamSearchForm = ({ onAddUser }: Props) => {
  const toast = useContext(ToastContext);
  const theme = useContext(ThemeContext);
  const classes = useStyles(theme.data);
  const [steamInput, setSteamInput] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<ISteamApiUser>();

  const [userTypeInput, setUserTypeInput] = useState<number>(0);

  const handleSearch = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const foundSteamData = await getSteamUserData(steamInput);
      setUserData(foundSteamData.data.body[0]);
    } catch (e) {
      setIsLoading(false);
      toast.error("Não foi possível encontrar o usuário.");
    }
  };

  const handleSelectChange = (value) => {
    setUserTypeInput(value);
  };

  const handleAddUser = async () => {
    try {
      const createdUser = await createUser({
        steamid: userData.steamid,
        user_type: userTypeInput,
        username: userData.personaname,
      });
      onAddUser();
      toast.success(createdUser.data.message);
    } catch (e) {
      setIsLoading(false);
      toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    if (userData && isLoading) {
      setIsLoading(false);
    }
  }, [userData]);

  return (
    <div style={{ height: "100%", width: "100%", borderRadius: "10px" }}>
      <form onSubmit={(event) => handleSearch(event)} className={styles.form}>
        <TextField
          onChange={(event) => setSteamInput(event.target.value)}
          className={classes.textField}
          style={{
            fontFamily: "Josefin Sans",
            width: "50%",
            marginRight: "20px",
          }}
          label="SteamID/SteamID3/SteamID64/Url"
        />
        <Button
          style={{
            width: "85px",
            height: "30px",
            fontSize: "12px",
            fontFamily: "Josefin Sans",
            marginRight: "20px",
          }}
          color="primary"
          variant="contained"
          type="submit"
        >
          Pesquisar
        </Button>
      </form>
      <div style={{ height: "85%" }}>
        {isLoading && (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress style={{ height: "100px", width: "100px" }} />
          </div>
        )}
        {userData && !isLoading && (
          <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                style={{
                  width: "170px",
                  marginLeft: "45px",
                  borderRight: "3px solid #7ca038",
                  boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.71)",
                }}
                src={userData.avatarfull}
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", height: "100%" }}
            >
              <div
                style={{
                  height: "170px",
                  marginLeft: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <p style={{ color: theme.data.textAccent }}>
                  Nome:{" "}
                  <span style={{ color: theme.data.textColor }}>
                    {userData.personaname}
                  </span>
                </p>
                <p style={{ color: theme.data.textAccent }}>
                  SteamID:{" "}
                  <span style={{ color: theme.data.textColor }}>
                    {userData.steamid}
                  </span>
                </p>
                <p style={{ color: theme.data.textAccent }}>
                  SteamID64:{" "}
                  <span style={{ color: theme.data.textColor }}>
                    {userData.steamid64}
                  </span>
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "20px",
                  }}
                >
                  <p style={{ color: theme.data.textAccent }}>Permissões: </p>
                  <FormControl
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      height: "20px",
                      marginLeft: "15px",
                    }}
                  >
                    <Select
                      value={userTypeInput}
                      onChange={(event) =>
                        handleSelectChange(event.target.value)
                      }
                      className={classes.select}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            backgroundColor: theme.data.backgroundPrimary,
                          },
                        },
                      }}
                      style={{
                        fontFamily: "Josefin Sans",
                        minWidth: "80px",
                        height: "20px",
                      }}
                    >
                      <MenuItem value={0} className={classes.menuitem}>
                        Comum
                      </MenuItem>
                      <MenuItem value={1} className={classes.menuitem}>
                        Admin
                      </MenuItem>
                      <MenuItem value={2} className={classes.menuitem}>
                        Super Admin
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <Button
                  onClick={handleAddUser}
                  variant="contained"
                  color="primary"
                  style={{
                    height: "30px",
                    width: "90px",
                    fontFamily: "Josefin Sans",
                    fontSize: "12px",
                  }}
                >
                  Adicionar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SteamSearchForm;
