import { parseHTML } from 'linkedom'
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { scrape } from "./scraper"

export function elementToMarkdown(element: HTMLElement | null) {
  let html = element?.innerHTML || ""
  let content = NodeHtmlMarkdown.translate(html).trim()
  return content
}

export class DefaultParser implements IParser {

  protected _url?: URL | null = null

  canParse(url: URL) {
    if (url)
      return true
    return false
  }

  async parse(url: URL) {

    this._url = url
    let txt = await scrape(url)

    const { document } = parseHTML(txt)

    this.preParse(document)

    let article = this.getArticleNode(document)
    let content = elementToMarkdown(article)
    let header = this.parseHeader(document)
    content = header + content
    return content
  }

  protected preParse(document: Document) {

    // parse embeds
    document.querySelectorAll('iframe').forEach(iframe => {
      if (!iframe.src)
        return

      const url = new URL(iframe.src)
      const type = url.host
      const name = url.pathname

      const p = document.createElement("p")
      const n = document.createTextNode(`{% ${type} ${name} %}`)
      p.appendChild(n)

      iframe.parentNode?.insertBefore(p, iframe)
    })
  }

  protected getArticleNode(document: Document): HTMLElement | null {
    return (
      document.querySelector('article') ||
      document.querySelector('body')
    )
  }

  protected parseHeader(document: Document) {

    let header = '---\n'

    let title = (document.querySelector('h1')?.textContent || '').trim()
    if (title) {
      header += `title: ${title}\n`
    }

    let tagSelector = this.getTagSelector()
    let tags = [...document.querySelectorAll(tagSelector)]
      .map(a => (a.textContent || '').trim().toLowerCase())
      .filter(t => t)
      .map(a => a.replace('node.js', 'node'))
    if (tags.length > 0) {
      tags.sort()
      let t = [...new Set(tags)].join(", ")
      header += `tags: [${t}]\n`
    }

    let canonical = document.querySelector('link[rel=canonical]')?.getAttribute("href") || this._url
    if (canonical) {
      header += `canonical_url: ${canonical}\n`
    }

    header += '---\n\n'

    return header
  }

  protected getTagSelector() {
    return ".categories a, .tags a"
  }
}
