import { SiteHeader, SiteFooter } from "./SiteChrome";
import fs from "fs";
import path from "path";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function inlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}

function markdownToHtml(markdown: string) {
  const lines = markdown.split("\n");
  const html: string[] = [];
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      continue;
    }

    if (line.startsWith("### ")) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`);
      continue;
    }

    if (line.startsWith("## ")) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
      continue;
    }

    if (line.startsWith("# ")) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`);
      continue;
    }

    if (line.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inlineMarkdown(line.slice(2))}</li>`);
      continue;
    }

    if (inList) {
      html.push("</ul>");
      inList = false;
    }

    html.push(`<p>${inlineMarkdown(line)}</p>`);
  }

  if (inList) html.push("</ul>");

  return html.join("\n");
}

export default function LegalPage({
  fileName,
  eyebrow,
  plain = false,
}: {
  fileName: string;
  eyebrow: string;
  plain?: boolean;
}) {
  const filePath = path.join(process.cwd(), "content", fileName);
  const markdown = fs.readFileSync(filePath, "utf8");
  const html = markdownToHtml(markdown);

  return (
    <main className="site-shell resell-interior">
      <SiteHeader />
      <article className={`rs-prose rs-rise${plain ? " rs-credits" : ""}`}>
        <p className="rs-eyebrow">{eyebrow}</p>
        <div
          className="legal-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
      <SiteFooter />
    </main>
  );
}
