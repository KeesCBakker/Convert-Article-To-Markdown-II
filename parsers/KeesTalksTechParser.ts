import { DefaultParser } from './DefaultParser';

export class KeesTalksTechParser extends DefaultParser {

  canParse(url: URL) {
    return url.hostname == "keestalkstech.com";
  }

  protected getArticleNode(document: Document): HTMLElement | null {
    return document.querySelector('article .entry-content')
  }

  protected preParse(document: Document) {
    super.preParse(document);

    // parse code fields
    document.querySelectorAll("pre code").forEach(code => {
      let lang = [...code.parentElement?.classList || []]
        .filter(x => x.startsWith("lang-"))
        .find(x => x);

      if (!lang)
        return;

      lang = lang.replace("lang-", "language-");
      code.classList.add(lang);
    });

  }
}

export function remove(document: Document, selector: string) {
  document.querySelectorAll(selector).forEach(el => {
    el.remove()
  })
}



export class NrcParser extends DefaultParser {

  canParse(url: URL) {
    return url.hostname == "nrc.nl" || url.hostname == "www.nrc.nl";
  }

  protected getArticleNode(document: Document): HTMLElement | null {
    return document.querySelector('.article__header-and-content')
  }


  protected preParse(document: Document) {
    [
      '.print-layout-warning'
    ].forEach(el => remove(document, el))
  }
}