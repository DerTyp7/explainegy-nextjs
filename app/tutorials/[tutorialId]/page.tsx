import { marked } from "marked";
import { db, storage } from "../../../firebase-config";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import styles from "../../../styles/TutorialContent.module.scss";
import LoadPrism from "./LoadPrism";

type TutorialMeta = {
	title: string;
};

async function GetTutorialMeta(tutorialId: string): Promise<TutorialMeta> {
	const firebaseData = await getDoc(doc(db, "tutorials", tutorialId));
	const firebaseJsonData = firebaseData.data();

	const tutorial: TutorialMeta = {
		title: firebaseJsonData?.title ?? "Tutorial not found!",
	};

	return tutorial;
}

async function FetchTutorialMarkdown(tutorialId: string) {
	try {
		const url = await getDownloadURL(
			ref(storage, `markdowns/${tutorialId}.md`)
		);
		const data = await fetch(url, {
			next: { revalidate: 10 },
		});
		return await data.text();
	} catch {
		return "";
	}
}

function ParseMarkdown(markdown: string): string {
	let result = marked.parse(markdown);
	return result;
}

export default async function Tutorial({
	params,
}: {
	params: { tutorialId: string };
}) {
	const tutorialId: string = params.tutorialId;
	const tutorialMeta: TutorialMeta = await GetTutorialMeta(tutorialId);
	const markdown: string = await FetchTutorialMarkdown(tutorialId);

	return (
		<div className={styles.tutorialContent}>
			<div className={styles.head}>
				<h1>{tutorialMeta.title}</h1>
			</div>
			<div
				className={styles.markdown}
				dangerouslySetInnerHTML={{
					__html: ParseMarkdown(markdown),
				}}
			></div>
			<LoadPrism />
		</div>
	);
}

export async function generateStaticParams() {
	const data = await getDocs(collection(db, "tutorials"));

	return data.docs.map((doc) => ({
		tutorialId: doc.id,
	}));
}
