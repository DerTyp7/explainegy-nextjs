import { marked } from "marked";
export default async function Page({
	params,
}: {
	params: { tutorial: string };
}) {
	const requestData = await fetch(`http://127.0.0.1:3000/test.json`, {
		cache: "no-store", //! Just for dev
		/*next: {   revalidate: 10  }*/
	});
	const data = await requestData.json();

	return (
		<div
			dangerouslySetInnerHTML={{
				__html: marked.parse(data.markdown) ?? "",
			}}
		></div>
	);
}
