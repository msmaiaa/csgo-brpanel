import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGem, faHeart } from '@fortawesome/free-solid-svg-icons';
import AboutPage from '../pages/about';
import HomePage from '../pages/home';
import LoginPage from '../pages/login';
import LogsPage from '../pages/logs';
import ManageCargos from '../pages/managecargos';
import PanelSettings from '../pages/panelsettings';
import SalesRecord from '../pages/salesrecord';
import StorePage from '../pages/store';

export default function Layout({ children }) {
  return (
    <div style={{display: 'flex', height: '100%'}}>
    <ProSidebar style={{height: '100%'}}>
      <Menu iconShape="round">
        <MenuItem icon={<FontAwesomeIcon icon={faGem} />}>
          <Link href="/home">Início</Link>
        </MenuItem>
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
          <Link href="/login">Entrar</Link>
        </MenuItem>
        <MenuItem icon={<FontAwesomeIcon icon={faGem} />}>
          <Link href="/login">Sair</Link>
        </MenuItem>
      </Menu>
    </ProSidebar>
    {children}
    </div>
  )
}