import { FC } from "react";
import Layout from "../../components/Layout";
import router from "../../lib/router";

const PanelSettings: FC<any> = (props) => {
  return (
    <>
      <Layout user={props.user}>
        <p>PanelSettings</p>
      </Layout>
    </>
  )
}

export default PanelSettings

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