import "../styles/globals.scss";
import "../styles/colorVariables.scss";
import "../styles/variables.scss";
import Nav from "./Nav";
import Footer from "./Footer";
import { Category } from "@prisma/client";
import prisma from "../lib/prisma";
import { NavCategory } from "./Nav";

export async function GetNavCategories(): Promise<NavCategory[]> {
	const result: NavCategory[] = await prisma.category.findMany({
		select: { name: true, title: true },
	});
	return result;
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html style={{ scrollBehavior: "smooth" }}>
			<head></head>

			<body className="body">
				<header>
					<Nav categories={await GetNavCategories()} />
				</header>
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	);
}
