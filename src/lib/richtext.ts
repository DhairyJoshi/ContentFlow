/**
 * Rich Text Renderer for Contentful
 * Converts Contentful rich text format to HTML string
 */

interface RichTextMark {
  type: string;
}

interface RichTextNode {
  nodeType: string;
  data: Record<string, any>;
  marks?: RichTextMark[];
  value?: string;
  content?: RichTextNode[];
}

interface RichTextDocument {
  nodeType: string;
  data: Record<string, any>;
  content: RichTextNode[];
}

/**
 * Converts Contentful rich text to HTML string
 * @param richText - The rich text document from Contentful
 * @returns HTML string representation
 */
export function richTextToHtml(
  richText: RichTextDocument | string | null
): string {
  if (!richText) return "";
  
  // If it's already a string, return as-is (legacy support)
  if (typeof richText === "string") {
    return richText;
  }

  if (!richText.content || !Array.isArray(richText.content)) {
    return "";
  }

  return richText.content.map((node) => nodeToHtml(node)).join("");
}

function nodeToHtml(node: RichTextNode): string {
  switch (node.nodeType) {
    case "document":
      return (node.content || []).map((child) => nodeToHtml(child)).join("");

    case "paragraph":
      const paragraphContent = (node.content || [])
        .map((child) => nodeToHtml(child))
        .join("");
      return `<p>${paragraphContent}</p>`;

    case "heading-1":
      const h1Content = (node.content || [])
        .map((child) => nodeToHtml(child))
        .join("");
      return `<h1>${h1Content}</h1>`;

    case "heading-2":
      const h2Content = (node.content || [])
        .map((child) => nodeToHtml(child))
        .join("");
      return `<h2>${h2Content}</h2>`;

    case "heading-3":
      const h3Content = (node.content || [])
        .map((child) => nodeToHtml(child))
        .join("");
      return `<h3>${h3Content}</h3>`;

    case "heading-4":
      const h4Content = (node.content || [])
        .map((child) => nodeToHtml(child))
        .join("");
      return `<h4>${h4Content}</h4>`;

    case "heading-5":
      const h5Content = (node.content || [])
        .map((child) => nodeToHtml(child))
        .join("");
      return `<h5>${h5Content}</h5>`;

    case "heading-6":
      const h6Content = (node.content || [])
        .map((child) => nodeToHtml(child))
        .join("");
      return `<h6>${h6Content}</h6>`;

    case "unordered-list":
      const ulContent = (node.content || [])
        .map((child) => nodeToHtml(child))
        .join("");
      return `<ul>${ulContent}</ul>`;

    case "ordered-list":
      const olContent = (node.content || [])
        .map((child) => nodeToHtml(child))
        .join("");
      return `<ol>${olContent}</ol>`;

    case "list-item":
      const liContent = (node.content || [])
        .map((child) => nodeToHtml(child))
        .join("");
      return `<li>${liContent}</li>`;

    case "blockquote":
      const blockquoteContent = (node.content || [])
        .map((child) => nodeToHtml(child))
        .join("");
      return `<blockquote>${blockquoteContent}</blockquote>`;

    case "hr":
      return "<hr>";

    case "text":
      return applyMarks(node.value || "", node.marks || []);

    case "hyperlink":
      const linkContent = (node.content || [])
        .map((child) => nodeToHtml(child))
        .join("");
      const url = node.data?.uri || "#";
      return `<a href="${escapeHtml(url)}">${linkContent}</a>`;

    case "asset-hyperlink":
    case "entry-hyperlink":
    case "embedded-asset-block":
    case "embedded-entry-block":
      return `<!-- ${node.nodeType} -->`; 

    default:
      if (node.content) {
        return (node.content as RichTextNode[])
          .map((child) => nodeToHtml(child))
          .join("");
      }
      return "";
  }
}

function applyMarks(text: string, marks: RichTextMark[]): string {
  let html = escapeHtml(text);

  for (const mark of marks) {
    switch (mark.type) {
      case "bold":
        html = `<strong>${html}</strong>`;
        break;
      case "italic":
        html = `<em>${html}</em>`;
        break;
      case "underline":
        html = `<u>${html}</u>`;
        break;
      case "code":
        html = `<code>${html}</code>`;
        break;
      case "superscript":
        html = `<sup>${html}</sup>`;
        break;
      case "subscript":
        html = `<sub>${html}</sub>`;
        break;
    }
  }

  return html;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}