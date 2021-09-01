import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './Layout.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faMoneyBillAlt, 
  faListAlt, 
  faCog, 
  faHome, 
  faSignOutAlt, 
  faSignInAlt, 
  faFileInvoiceDollar,
  faHistory,
  faInfoCircle
 } from '@fortawesome/free-solid-svg-icons';


export default function Layout(children) {
  const router = useRouter()
  const handleLogin = () => {
    router.push('/api/auth/login')
  }

  const handleLogout = () => {
    router.push('/api/auth/logout')
  }

  return (
    <div style={{display: 'flex', height: '100%', width: '100%', alignItems: 'center'}}>
    <ProSidebar style={{height: '100%'}}>
      <Menu iconShape="round">
        <MenuItem className={styles.menu_item} icon={<FontAwesomeIcon  className={styles.menu_icon} icon={faHome} />}>
          <Link href="/"><p className={styles.menulink}>Início</p></Link>
        </MenuItem>
        {children.user ? 
          <>
            <MenuItem className={styles.menu_item} icon={<FontAwesomeIcon  className={styles.menu_icon} icon={faMoneyBillAlt} />}>
              <Link href="/store"><p className={styles.menulink}>Loja</p></Link>
            </MenuItem>
            <MenuItem className={styles.menu_item} icon={<FontAwesomeIcon  className={styles.menu_icon} icon={faListAlt} />}>
              <Link href="/managecargos"><p className={styles.menulink}>Gerenciar cargos</p></Link>
            </MenuItem>
            <MenuItem className={styles.menu_item} icon={<FontAwesomeIcon  className={styles.menu_icon} icon={faListAlt} />}>
              <Link href="/manageservers"><p className={styles.menulink}>Gerenciar servidores</p></Link>
            </MenuItem>
            <MenuItem className={styles.menu_item} icon={<FontAwesomeIcon  className={styles.menu_icon}  icon={faCog} />}>
              <Link href="/panelsettings"><p className={styles.menulink}>Configurações do painel</p></Link>
            </MenuItem>
            {children.user.user_type > 1 &&
              <>
                <MenuItem className={styles.menu_item} icon={<FontAwesomeIcon  className={styles.menu_icon} icon={faFileInvoiceDollar} />}>
                  <Link href="/salesrecord"><p className={styles.menulink}>Histórico de vendas</p></Link>
                </MenuItem>
                <MenuItem className={styles.menu_item} icon={<FontAwesomeIcon  className={styles.menu_icon} icon={faHistory} />}>
                  <Link href="/logs"><p className={styles.menulink}>Logs</p></Link>
                </MenuItem>
              </>
            }
            <MenuItem className={styles.menu_item} icon={<FontAwesomeIcon  className={styles.menu_icon} icon={faInfoCircle} />}>
              <Link href="/about"><p className={styles.menulink}>Sobre</p></Link>
            </MenuItem>
            <MenuItem className={styles.menu_item} icon={<FontAwesomeIcon  className={styles.menu_icon} icon={faSignOutAlt} />}>
              <a className={styles.menulink} onClick={handleLogout}>Sair</a>
            </MenuItem>
          </>
          :
            <MenuItem className={styles.menu_item} icon={<FontAwesomeIcon  className={styles.menu_icon} icon={faSignInAlt} />}>
              <a className={styles.menulink} onClick={handleLogin}>Entrar</a>
            </MenuItem>
        }
      </Menu>
    </ProSidebar>
    <div style={{width: '80%', height: '95%'}}>
      {children.children}
    </div>
    </div>
  )
}