import { FC, useContext } from "react";
import Layout from "../../components/Layout";
import ToastContext from "../../context/ToastContext";
import router from "../../lib/router";
import styles from './manageusers.module.css'



const ManageCargos: FC<any> = (props) => {
  const toast = useContext(ToastContext)

  return(
    <>
      <Layout user={props.user}>
        <p>ManageUsers</p>
      </Layout>
    </>
  )
}

export default ManageCargos

export async function getServerSideProps({ req, res}) {
	await router.run(req, res);
  if(!req.user || req.user.user_type < 1) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
	return { props: { user: req.user || null } };
}