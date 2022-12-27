import "../styles/globals.scss";
import "../styles/colorVariables.scss";
import "../styles/variables.scss";
import Nav from "./Nav";
import Footer from "./Footer";
import { Category } from "@prisma/client";
import prisma from "../lib/prisma";

export async function GetCategories(): Promise<Category[]> {
	return await prisma.category.findMany();
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
					<Nav categories={await GetCategories()} />
				</header>
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	);
}
