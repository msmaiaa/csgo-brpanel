import { Button, CircularProgress, TextField, withStyles } from '@material-ui/core'
import { useContext, useEffect, useState } from 'react'
import ToastContext from '../../context/ToastContext'
import { getSteamUserData } from '../../services/SteamService'
import styles from './steamform.module.css'

interface ISteamApiUser {
  avatar: string
  avatarfull: string
  avatarhash: string
  avatarmedium: string
  commentpermission?: number
  communityvisibilitystate?: number
  lastlogoff: number
  loccountrycode?: string
  personaname: string
  personastate: number
  personastateflags: number
  primaryclanid: string
  profilestate: number
  profileurl: string
  realname?: string
  steamid: string
  steamid64: string
  timecreated: number
}

interface Props {
  onUserSearch(steamid: string)
}

const StyledTextField = withStyles({
  root: {
    '& > *': {
      fontFamily: 'Josefin Sans',
      height: '30px'
    },
  },
  
})(TextField)

export default function SteamSearchForm({ onUserSearch }: Props) {
  const toast = useContext(ToastContext)
  const [steamInput, setSteamInput] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<ISteamApiUser>()

  const handleSearch = async(event) => {
    event.preventDefault()
    setIsLoading(true)
    try{
      const foundSteamData = await getSteamUserData(steamInput)
      setUserData(foundSteamData.data.body[0])
    }catch(e) {
      console.log(e)
      toast.error(e.response.data.message)
    }
  }
  
  useEffect(() => {
    if(userData && isLoading) {
      setIsLoading(false)
      onUserSearch(userData.steamid)
    }
  }, [userData])

  return (
    <div style={{height: '100%', width: '100%', borderRadius: '10px'}}>
      <form onSubmit={(event) => handleSearch(event)} className={styles.form}>
        <StyledTextField 
        onChange={(event) => setSteamInput(event.target.value)} 
        style={{fontFamily: 'Josefin Sans', width: '50%', marginRight: '20px' }} 
        label="SteamID/SteamID3/SteamID64/Url"
        />
        <Button style={{width:'85px', height: '30px', fontSize: '12px', fontFamily: 'Josefin Sans', marginRight: '20px'}} color="primary" variant="contained" type="submit">Pesquisar</Button>
      </form>
      <div style={{height: '85%'}}>
        {isLoading &&
          <div style={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <CircularProgress style={{height: '100px', width: '100px'}}/>
          </div>
        }
        {userData && !isLoading && 
          <div style={{display: 'flex', width: '100%', height: '100%'}}>
            <div style={{display: 'flex', alignItems: 'center', }}>
              <img style={{width: '150px', marginLeft: '60px', borderRight:'3px solid #7ca038', boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.71)', }} src={userData.avatarfull}/>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%'}}>
              <div style={{height: '150px', marginLeft: '20px'}}>
                <p className={styles.info_key}>
                  Nome: <span  className={styles.info_value}>{userData.personaname}</span>
                </p>
                <p className={styles.info_key}>
                  SteamID: <span className={styles.info_value}>{userData.steamid}</span>
                </p>
                <p className={styles.info_key}>
                  SteamID64: <span className={styles.info_value}>{userData.steamid64}</span>
                </p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}