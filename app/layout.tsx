import "../styles/globals.scss";
import "../styles/variables_colors.scss";
import "../styles/variables.scss";
import Link from "next/link";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { FetchManager } from "../manager/fetchManager";
import AdminNav from "../components/AdminNav";
import AdminControl from "../components/AdminControl";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html style={{ scrollBehavior: "smooth" }}>
      <head></head>

      <body className="body">
        <header>
          <Nav categories={await FetchManager.Category.list()} />
          <AdminNav />
          <AdminControl />
        </header>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
