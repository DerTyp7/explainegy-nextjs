import { GetTutorialMeta, TutorialMeta } from "./page";
export default async function Head({
	params,
}: {
	params: { tutorialId: string };
}) {
	const tutorialId: string = params.tutorialId;
	const tutorialMeta: TutorialMeta = await GetTutorialMeta(tutorialId);
	return (
		<>
			<title>{tutorialMeta.title}</title>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
		</>
	);
}
