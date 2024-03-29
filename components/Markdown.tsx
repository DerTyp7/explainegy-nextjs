"use client";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/cjs/styles/prism/one-dark";
import oneLight from "react-syntax-highlighter/dist/cjs/styles/prism/one-light";
import styles from "../styles/modules/markdown.module.scss";
import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import remarkStringify from "remark-stringify";

import React from "react";

import { formatTextToUrlName } from "../utils";

function flatten(text: string, child: any): any {
  return typeof child === "string" ? text + child : React.Children.toArray(child.props.children).reduce(flatten, text);
}

function HeadingRenderer({ children, level }: { children: any; level: any }) {
  children = React.Children.toArray(children);
  const text = children.reduce(flatten, "");
  return React.createElement("h" + level, { id: formatTextToUrlName(text) }, children);
}

export default function Markdown({ value }: { value: any }) {
  return (
    <div>
      <ReactMarkdown
        className={styles.markdown}
        //@ts-ignore
        remarkPlugins={[remarkGfm, remarkGemoji, remarkStringify]}
        //@ts-ignore
        components={{
          h1: HeadingRenderer,
          h2: HeadingRenderer,
          h3: HeadingRenderer,
          h4: HeadingRenderer,
          h5: HeadingRenderer,
          h6: HeadingRenderer,
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline ? (
              <>
                <div className={styles.toolbar}>
                  <div
                    onClick={() => {
                      navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
                    }}
                    className={styles.copyBtn}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path d="M502.6 70.63l-61.25-61.25C435.4 3.371 427.2 0 418.7 0H255.1c-35.35 0-64 28.66-64 64l.0195 256C192 355.4 220.7 384 256 384h192c35.2 0 64-28.8 64-64V93.25C512 84.77 508.6 76.63 502.6 70.63zM464 320c0 8.836-7.164 16-16 16H255.1c-8.838 0-16-7.164-16-16L239.1 64.13c0-8.836 7.164-16 16-16h128L384 96c0 17.67 14.33 32 32 32h47.1V320zM272 448c0 8.836-7.164 16-16 16H63.1c-8.838 0-16-7.164-16-16L47.98 192.1c0-8.836 7.164-16 16-16H160V128H63.99c-35.35 0-64 28.65-64 64l.0098 256C.002 483.3 28.66 512 64 512h192c35.2 0 64-28.8 64-64v-32h-47.1L272 448z" />
                    </svg>
                  </div>
                </div>

                <SyntaxHighlighter
                  // @ts-ignore
                  style={oneDark}
                  language={match ? match[1] : ""}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </>
            ) : (
              <code>{children}</code>
            );
          },
        }}
      >
        {value}
      </ReactMarkdown>
    </div>
  );
}

Markdown.propTypes = {
  value: PropTypes.string.isRequired,
};
