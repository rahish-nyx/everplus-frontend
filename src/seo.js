export function applyPageMeta(title, description) {
  if (title) document.title = title;

  if (description) {
    let tag = document.head.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", description);
  }
}
