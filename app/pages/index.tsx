import { FC } from "react";
import Layout from "../components/Layout";
import router from "../lib/router";

const HomePage: FC<any> = (props) => {
  return (
    <>
      <Layout user={props.user}>
        <p>HomePage</p>
      </Layout>
    </>
  )
}

export default HomePage

export async function getServerSideProps({ req, res}) {
	await router.run(req, res);
	return { props: { user: req.user || null } };
}