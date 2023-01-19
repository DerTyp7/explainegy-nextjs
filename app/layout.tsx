import "../styles/globals.scss";
import "../styles/variables_colors.scss";
import "../styles/variables.scss";
import Nav from "./Nav";
import Footer from "./Footer";
import { Category } from "@prisma/client";
import urlJoin from "url-join";
import { apiUrl } from "./global";
import Link from "next/link";

async function getCategories(): Promise<Category[]> {
  const result: Response = await fetch(urlJoin(apiUrl, `categories`), {
    cache: "force-cache",
    next: { revalidate: 3600 },
  });

  return await result.json();
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html style={{ scrollBehavior: "smooth" }}>
      <head></head>

      <body className="body">
        <div>
          <Link href={"/admin"}> Admin</Link>
        </div>
        <header>
          <Nav categories={await getCategories()} />
        </header>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
