import { useEffect, useState } from 'react'
import Card from '../Card/Card'
import styles from './ServerCard.module.css'
import { getServerStatus } from '../../services/ServerService'
import { Button } from '@material-ui/core'
import Link from 'next/link'

interface IServerInfo {
  online?: boolean,
  data?: IResponseData
}

interface IResponseData {
  bots: []
  connect: string
  map: string
  maxplayers: number
  name: string
  password: boolean
  ping: number
  players: [any]
  raw: any
}

export default function ServerCard ({ server, style }) {
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
      }
    })
    .catch((error) => {
      if(!isMounted) return
      setServerInfo({
        online: false,
      })
    })
    return () => {
      isMounted = false
    }
  }, [])
  return (
    <Card style={{...style}}>
      {serverInfo.online ?
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <p className={styles.cardTitle}>{server.full_name}</p>
          <p className={styles.cardStatusOnline}>online</p>
        </div>
        <div className={styles.cardFooter}>
          <p className={styles.players}>Jogadores online: <span className={styles.players_num}>{serverInfo.data.raw.numplayers}</span></p>
            <Link href={`steam://connect/${serverInfo.data.connect}`}>
              <Button variant="contained" color="secondary">
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
    </Card>
  )
}