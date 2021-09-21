import { useContext, useEffect, useState } from 'react'
import Card from '../Card/Card'
import styles from './ServerCard.module.css'
import { getServerStatus } from 'services/ServerService'
import { Button, CircularProgress } from '@material-ui/core'
import Link from 'next/link'
import { ThemeContext } from 'context/ThemeContext'
import { makeStyles } from '@material-ui/styles'

interface IServerInfo {
  online?: boolean,
  data?: IResponseData
}

interface IRawData {
  protocol: number
  folder: string
  game: string
  appId: number
  numplayers: number
  numbots: number
  listentype: string
  environment: string
  secure: 1
  version: string
  steamid: string
  tags: Array<string>
}

interface IPlayerData {
  name: string
  raw: {
    score: number
    time: number
  }
}
interface IResponseData {
  name: string
  map: string
  password: boolean
  raw: IRawData
  maxplayers: number
  players: Array<IPlayerData>
  bots: Array<any>
  connect: string
  ping: number
}

const useStyles = makeStyles({
  card: (props: any) => ({
    boxShadow: props.boxShadowCard
  })
})

export default function ServerCard ({ server, style }) {
  const theme = useContext(ThemeContext)
  const classes = useStyles(theme)
  const [isLoading, setIsLoading] = useState(true)
  const [serverInfo, setServerInfo] = useState<IServerInfo>({})

  useEffect(() => {
    let isMounted = true
    getServerStatus(server)
    .then((response) => {
      if(isMounted) {
        const responseData: IResponseData | any = {...response.data.body}
        setServerInfo({
          online: true,
          data: responseData
        })
        setIsLoading(false)
      }
    })
    .catch((error) => {
      if(!isMounted) return
      setServerInfo({
        online: false,
      })
      setIsLoading(false)
    })
    return () => {
      isMounted = false
    }
  }, [])

  if(isLoading) {
    return <div style={{...style, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', boxShadow: theme.data.boxShadowCard}} className={classes.card}>
      <CircularProgress style={{height: '50px', width: '50px'}}/>
    </div>
  }
  return (
    <div style={{...style, borderRadius: '10px', boxShadow: theme.data.boxShadowCard}} className={classes.card}>
      <div style={{margin: '25px'}} className={classes.card}>
        {serverInfo.online ?
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <p className={styles.cardTitle}>{server.full_name}</p>
            <p className={styles.cardStatusOnline}>online</p>
          </div>
          <div className={styles.cardFooter}>
            <p className={styles.players}>Jogadores online: <span className={styles.players_num}>{serverInfo.data.raw.numplayers}</span></p>
            <p className={styles.players}>Mapa atual: <span className={styles.players_num}>{serverInfo.data.map}</span></p>
              <Link href={`steam://connect/${serverInfo.data.connect}`}>
                <Button variant="contained" color="primary" style={{width: '95px', height: '30px', fontFamily: 'Josefin Sans'}}>
                  Conectar
                </Button>
              </Link>
          </div>
        </div>
        : 
        <>
        <p className={styles.cardTitle}>{server.full_name}</p>
        <p className={styles.cardStatusOffline}>offline</p>
        </>
        }
      </div>
    </div>
  )
}