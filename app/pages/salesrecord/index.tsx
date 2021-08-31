import { FC } from "react";
import Layout from "../../components/Layout";
import router from "../../lib/router";

const SalesRecord: FC<any> = (props) => {
  return (
    <>
      <Layout user={props.user}>
        <p>SalesRecord</p>
      </Layout>
    </>
  )
}

export default SalesRecord

export async function getServerSideProps({ req, res}) {
	await router.run(req, res);
  if(!req.user || req.user.user_type < 2) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
	return { props: { user: req.user || null } };
}