import { marked } from "marked";
import { db, storage } from "../../../firebase-config";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import ContentTable from "./ContentTable";
import Sidebar from "./Sidebar";
import styles from "../../../styles/Tutorial.module.scss";
import LoadMarkdown from "./LoadMarkdown";
import Head from "next/head";

export type ContentTable = {
	anchor: string;
	title: string;
};

export type TutorialMeta = {
	id: string;
	title: string;
	contentTable: ContentTable[];
};

export async function GetTutorialMeta(
	tutorialId: string
): Promise<TutorialMeta> {
	const firebaseData = await getDoc(doc(db, "tutorials", tutorialId));
	const firebaseJsonData = firebaseData.data();

	const tutorial: TutorialMeta = {
		id: tutorialId,
		title: firebaseJsonData?.title ?? "Tutorial not found!",
		contentTable: firebaseJsonData?.contentTable ?? [],
	};
	return tutorial;
}

async function FetchTutorialMarkdown(tutorialId: string) {
	try {
		const url = await getDownloadURL(
			ref(storage, `markdowns/${tutorialId}.md`)
		);
		const data = await fetch(url, {
			next: { revalidate: 30 * 60 },
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

//* MAIN
export default async function Tutorial({
	params,
}: {
	params: { tutorialId: string };
}) {
	const tutorialId: string = params.tutorialId;
	const tutorialMeta: TutorialMeta = await GetTutorialMeta(tutorialId);
	const markdown: string = await FetchTutorialMarkdown(tutorialId);

	return (
		<div className={styles.tutorial}>
			<ContentTable tutorialMeta={tutorialMeta} />
			<div className={styles.tutorialContent}>
				<div className={styles.head}>
					<h1>{tutorialMeta.title}</h1>
				</div>
				<div
					className="markdown"
					dangerouslySetInnerHTML={{
						__html: ParseMarkdown(markdown),
					}}
				></div>
				<LoadMarkdown />
			</div>
			<Sidebar />
		</div>
	);
}

export async function generateStaticParams() {
	const data = await getDocs(collection(db, "tutorials"));

	return data.docs.map((doc) => ({
		tutorialId: doc.id,
	}));
}
