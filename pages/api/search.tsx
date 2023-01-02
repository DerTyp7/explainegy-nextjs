import prisma from "../../lib/prisma";

export default async function search(req, res) {
	res.setHeader("Content-Type", "application/json");
	let query: string = req.query?.q ?? "";

	query = query.toLowerCase().replaceAll("%20", "");
	query = query.toLowerCase().replaceAll(" ", "");

	if (query.length > 1) {
		const articles = await prisma.article.findMany({
			select: { title: true, name: true },
			take: 5,
		}); //TODO order by most viewed

		let result = [];

		articles.forEach((a) => {
			let title = a.title.toLowerCase().replaceAll(" ", "");
			title = title.toLowerCase().replaceAll("%20", "");

			if (title.includes(query)) {
				result.push(a);
			}
		});

		res.end(JSON.stringify(result));
	} else {
		res.end(JSON.stringify([]));
	}
}
