"use client";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import LoadMarkdown from "./articles/[categoryName]/[articleName]/LoadMarkdown";

export default function Markdown({ value }: { value: any }) {
  return (
    <div>
      <ReactMarkdown
        // eslint-disable-next-line react/no-children-prop
        children={value}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                // eslint-disable-next-line react/no-children-prop
                children={String(children).replace(/\n$/, "")}
                style={oneDark}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
      <LoadMarkdown />
    </div>
  );
}

Markdown.propTypes = {
  value: PropTypes.string.isRequired,
};
