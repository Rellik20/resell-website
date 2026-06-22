import Link from "next/link";
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
}: {
  fileName: string;
  eyebrow: string;
}) {
  const filePath = path.join(process.cwd(), "content", fileName);
  const markdown = fs.readFileSync(filePath, "utf8");
  const html = markdownToHtml(markdown);

  return (
    <main className="site-shell">
      <nav className="nav">
        <Link className="brand" href="/">
          <span className="brand-mark">R</span>
          <span>ReSell Marketplace</span>
        </Link>
        <div className="nav-links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/support">Support</Link>
        </div>
      </nav>

      <article className="legal-card">
        <p className="eyebrow">{eyebrow}</p>
        <div className="legal-content" dangerouslySetInnerHTML={{ __html: html }} />
      </article>

      <footer className="footer">
        <div>© {new Date().getFullYear()} ReSell Marketplace</div>
        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/delete-account">Delete Account</Link>
          <Link href="/support">Support</Link>
        </div>
      </footer>
    </main>
  );
}
