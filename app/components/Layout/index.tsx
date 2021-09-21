import { ProSidebar, Menu, MenuItem, SidebarHeader, SubMenu, SidebarFooter, SidebarContent } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import Link from 'next/link'
import Image from 'next/image'
import logoPic from 'public/logo.png'
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
  faHistory
 } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from 'context/ThemeContext';
import { FormControl, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';


const useStyles = makeStyles({
  sub_menu_item: (props: any) =>({
    backgroundColor: props.backgroundSecondary,
    '&:hover': {
      backgroundColor: props.backgroundTertiary,
      boxShadow: props.boxShadowHover
    }
  }),
  sub_menu: (props: any) => ({
    color: `${props.textColor} !important`,
    '& > .pro-inner-item > *:hover': {
      color: `${props.textColor} !important`,
    },
    '& > .pro-inner-item:hover': {
      color: `${props.textColor} !important`,
    },
    '& > *': {
      backgroundColor: `${props.backgroundPrimary} !important`,
      color: `${props.textColor} !important`,
    },
    '& > .pro-inner-item > *': {
      backgroundColor: `${props.backgroundPrimary} !important`
    },
    backgroundColor: `${props.backgroundPrimary} !important`
  }),
  sidebar_content: (props: any) => ({
    '& > nav > ul > .pro-sub-menu > .pro-inner-list-item': {
      backgroundColor: `${props.backgroundSecondary} !important`
    }
  }),
  select: (props: any) => ({
    '& > *': {
      backgroundColor: `${props.backgroundPrimary} !important`,
      color: `${props.textColor} !important`
    },
    backgroundColor: `${props.backgroundPrimary} !important`,
    color: `${props.textColor} !important`
  }),
  menu_item: (props: any) => ({
    color: `${props.textColor} !important`,
    minHeight: '25px',
    display: 'flex',
    alignItems: 'center',
    '&, *:hover': {
      color: `${props.textColor} !important`
    },
    '&:not(:last-of-type)': {
      marginBottom: '10px'
    },
    '& > .pro-inner-item > .pro-icon-wrapper': {
      backgroundColor: `${props.backgroundPrimary} !important`
    }
  }),
  menuitem: (props: any) => ({
    minHeight: '25px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:not(:last-of-type)': {
      marginBottom: '10px'
    },
    '&:hover': {
      cursor: 'pointer'
    }
  })
})

export default function Layout(children) {
  const router = useRouter()
  const theme = useContext(ThemeContext)
  const classes = useStyles(theme.data)
  const [newTheme, setNewTheme] = useState()
  const handleLogin = () => {
    router.push('/api/auth/login')
  }

  const handleLogout = () => {
    router.push('/api/auth/logout')
  }

  const handleThemeChange = (event) => {
    theme.setThemeFunction(event.target.value)
  }

  useEffect(() => {
    console.log(theme)
    if(theme) setNewTheme(theme.data.name)
  }, [theme])

  return (
    <div style={{display: 'flex', height: '100%', width: '100%', alignItems: 'center', backgroundColor: theme.data.backgroundSecondary}}>
    <ProSidebar style={{height: '100%'}}>
      <SidebarHeader style={{display: 'flex', justifyContent: 'center', backgroundColor: theme.data.backgroundPrimary}}>
        <Image src={logoPic} alt="Logo" width={100} height={100}/>
      </SidebarHeader>
      <SidebarContent style={{backgroundColor: theme.data.backgroundPrimary}} className={classes.sidebar_content}>
        <Menu iconShape="round" style={{backgroundColor: theme.data.backgroundPrimary}}>
          <MenuItem className={classes.menu_item} icon={<FontAwesomeIcon  className={styles.menu_icon} icon={faHome} />}>
            <Link href="/"><p className={styles.menulink}>Início</p></Link>
          </MenuItem>
          {children.user ? 
            <>
              <MenuItem className={classes.menu_item} icon={<FontAwesomeIcon  className={styles.menu_icon} icon={faMoneyBillAlt} />}>
                <Link href="/store"><p className={styles.menulink}>Loja</p></Link>
              </MenuItem>
              {children.user.user_type > 0 && 
                <SubMenu style={{color: theme.data.textColor, marginBottom: '10px'}} className={classes.sub_menu} title="Gerenciar" icon={<FontAwesomeIcon  className={styles.menu_icon} icon={faListAlt} />}>
                  <MenuItem className={`${classes.menu_item} ${classes.sub_menu_item}`}>
                    <Link href="/manageusers"><p className={styles.menulink}>Usuários</p></Link>
                  </MenuItem>
                  <MenuItem className={`${classes.menu_item} ${classes.sub_menu_item}`}>
                    <Link href="/managecargos"><p className={styles.menulink}>Cargos</p></Link>
                  </MenuItem>
                  <MenuItem className={`${classes.menu_item} ${classes.sub_menu_item}`}>
                    <Link href="/manageservers"><p className={styles.menulink}>Servidores</p></Link>
                  </MenuItem>
                </SubMenu>
              }
              {children.user.user_type == 2 &&
                <>
                  <MenuItem className={classes.menu_item} icon={<FontAwesomeIcon  className={styles.menu_icon}  icon={faCog} />}>
                    <Link href="/panelsettings"><p className={styles.menulink}>Configurações do painel</p></Link>
                  </MenuItem>
                  <MenuItem className={classes.menu_item} icon={<FontAwesomeIcon  className={styles.menu_icon} icon={faFileInvoiceDollar} />}>
                    <Link href="/salesrecord"><p className={styles.menulink}>Histórico de vendas</p></Link>
                  </MenuItem>
                  <MenuItem className={classes.menu_item} icon={<FontAwesomeIcon  className={styles.menu_icon} icon={faHistory} />}>
                    <Link href="/logs"><p className={styles.menulink}>Logs</p></Link>
                  </MenuItem>
                </>
              }
              <MenuItem className={classes.menu_item} icon={<FontAwesomeIcon  className={styles.menu_icon} icon={faSignOutAlt} />}>
                <a style={{color: theme.data.textColor}} className={styles.menulink} onClick={handleLogout}>Sair</a>
              </MenuItem>
            </>
            :
              <MenuItem className={classes.menu_item} icon={<FontAwesomeIcon  className={styles.menu_icon} icon={faSignInAlt} />}>
                <a style={{color: theme.data.textColor}} className={styles.menulink} onClick={handleLogin}>Entrar</a>
              </MenuItem>
          }
        </Menu>

      </SidebarContent>
      <SidebarFooter>
        {newTheme && 
          <div style={{display: 'flex', minHeight: '50px', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.data.backgroundPrimary}}>
            <p style={{marginRight: '15px', color: theme.data.textColor}}>Tema: </p>
            <FormControl style={{width: '100px', backgroundColor: theme.data.backgroundPrimary}}>
              <Select
                MenuProps={{
                  PaperProps: {
                    style: {
                      backgroundColor: theme.data.backgroundPrimary
                    },
                  },
                }}
                value={newTheme}
                onChange={handleThemeChange}
                className={classes.select}
                style={{fontFamily: 'Josefin Sans', minWidth: '50'}}
              >
                <MenuItem style={{color: theme.data.textColor, backgroundColor: theme.data.backgroundPrimary}} className={classes.menuitem} value="light">Claro</MenuItem>
                <MenuItem style={{color: theme.data.textColor, backgroundColor: theme.data.backgroundPrimary}} className={classes.menuitem} value="dark">Escuro</MenuItem>
              </Select>
            </FormControl>
          </div>
        }
      </SidebarFooter>
    </ProSidebar>
    <div style={{width: '100%', height: '100%', overflowX: 'hidden'}}>
      {children.children}
    </div>
    </div>
  )
}