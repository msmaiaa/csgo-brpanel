import { FC } from "react";
import Layout from "../../components/Layout";
import router from "../../lib/router";

const ManageCargos: FC<any> = (props) => {
  return (
    <>
      <Layout user={props.user}>
        <p>ManageCargos</p>
      </Layout>
    </>
  )
}

export default ManageCargos

export async function getServerSideProps({ req, res}) {
	await router.run(req, res);
  if(!req.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
	return { props: { user: req.user || null } };
}