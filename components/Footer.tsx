import React from "react";
import styles from "@/styles/modules/Footer.module.scss";
import Image from "next/image";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.adContainer}>Future advertisement</div>
      <div className={styles.content}>
        <div className={styles.company}>
          <Image src={"/images/logo.svg"} width={190} height={52} alt={"Logo"} />
          <h1>Simple tutorials for everyone!</h1>
        </div>
        <div className={styles.links}>
          <div className={styles.grid}>
            <Link href="/articles">Categories</Link>
            <Link href="#">Contact</Link>
            <Link href="/about">About</Link>

            <a></a>
            <Link href="/bug">Report Bug</Link>
            <Link href="/legal">Legal</Link>

            <a></a>
            <Link href="/feedback">Feedback</Link>
            <Link href="/privacy">Privacy</Link>

            <a></a>
            <a></a>
            <Link href="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
