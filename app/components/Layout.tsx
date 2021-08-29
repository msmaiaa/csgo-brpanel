import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGem } from '@fortawesome/free-solid-svg-icons';


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
        <MenuItem icon={<FontAwesomeIcon icon={faGem} />}>
          <Link href="/">Início</Link>
        </MenuItem>
        {children.user ? 
          <>
            <MenuItem icon={<FontAwesomeIcon icon={faGem} />}>
              <Link href="/store">Loja</Link>
            </MenuItem>
            <MenuItem icon={<FontAwesomeIcon icon={faGem} />}>
              <Link href="/managecargos">Gerenciar cargos</Link>
            </MenuItem>
            <MenuItem icon={<FontAwesomeIcon icon={faGem} />}>
              <Link href="/panelsettings">Configurações do painel</Link>
            </MenuItem>
            <MenuItem icon={<FontAwesomeIcon icon={faGem} />}>
              <Link href="/salesrecord">Histórico de vendas</Link>
            </MenuItem>
            <MenuItem icon={<FontAwesomeIcon icon={faGem} />}>
              <Link href="/logs">Logs</Link>
            </MenuItem>
            <MenuItem icon={<FontAwesomeIcon icon={faGem} />}>
              <a onClick={handleLogout}>Sair</a>
            </MenuItem>
          </>
          :
            <MenuItem icon={<FontAwesomeIcon icon={faGem} />}>
              <a onClick={handleLogin}>Entrar</a>
            </MenuItem>
        }
        <MenuItem icon={<FontAwesomeIcon icon={faGem} />}>
          <Link href="/about">Sobre</Link>
        </MenuItem>
      </Menu>
    </ProSidebar>
    {children.children}
    </div>
  )
}