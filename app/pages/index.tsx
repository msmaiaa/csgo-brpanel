import Layout from "../components/Layout"

export default function Index() {
	return (
		<Layout>
			<p>Hello world</p>
		</Layout>
	)
}

// export async function getServerSideProps({ req, res}) {
// 	await router.run(req, res);
// 	return { props: { user: req.user || null } };
// }
