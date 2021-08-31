import { FC } from "react";
import Layout from "../../components/Layout";
import router from "../../lib/router";

const AboutPage: FC<any> = (props) => {
  return (
    <>
      <Layout user={props.user}>
        <p>AboutPage</p>
      </Layout>
    </>
  )
}

export default AboutPage

export async function getServerSideProps({ req, res}) {
	await router.run(req, res);
	return { props: { user: req.user || null } };
}