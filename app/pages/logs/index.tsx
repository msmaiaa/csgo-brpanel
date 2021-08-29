import { FC } from "react";
import Layout from "../../components/Layout";
import router from "../../lib/router";

const LogsPage: FC<any> = (props) => {
  return (
    <>
      <Layout user={props.user}>
        <p>LogsPage</p>
      </Layout>
    </>
  )
}

export default LogsPage

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