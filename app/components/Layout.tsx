import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import Link from 'next/link'
import { useRouter } from 'next/router'
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
    <div style={{display: 'flex', height: '100%'}}>
    <ProSidebar style={{height: '100%'}}>
      <Menu iconShape="round">
        <MenuItem icon={<FontAwesomeIcon icon={faHome} />}>
          <Link href="/">Início</Link>
        </MenuItem>
        {children.user ? 
          <>
            <MenuItem icon={<FontAwesomeIcon icon={faMoneyBillAlt} />}>
              <Link href="/store">Loja</Link>
            </MenuItem>
            <MenuItem icon={<FontAwesomeIcon icon={faListAlt} />}>
              <Link href="/managecargos">Gerenciar cargos</Link>
            </MenuItem>
            <MenuItem icon={<FontAwesomeIcon icon={faCog} />}>
              <Link href="/panelsettings">Configurações do painel</Link>
            </MenuItem>
            <MenuItem icon={<FontAwesomeIcon icon={faFileInvoiceDollar} />}>
              <Link href="/salesrecord">Histórico de vendas</Link>
            </MenuItem>
            <MenuItem icon={<FontAwesomeIcon icon={faHistory} />}>
              <Link href="/logs">Logs</Link>
            </MenuItem>
            <MenuItem icon={<FontAwesomeIcon icon={faInfoCircle} />}>
              <Link href="/about">Sobre</Link>
            </MenuItem>
            <MenuItem icon={<FontAwesomeIcon icon={faSignOutAlt} />}>
              <a onClick={handleLogout}>Sair</a>
            </MenuItem>
          </>
          :
            <MenuItem icon={<FontAwesomeIcon icon={faSignInAlt} />}>
              <a onClick={handleLogin}>Entrar</a>
            </MenuItem>
        }
      </Menu>
    </ProSidebar>
    {children.children}
    </div>
  )
}