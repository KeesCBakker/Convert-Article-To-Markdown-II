import { DefaultParser } from './DefaultParser';

export class DevToParser extends DefaultParser {

    canParse(url: URL) {
        return url.hostname == "dev.to";
    }

    protected getArticleNode(document: Document): HTMLElement | null {
      return document.querySelector('article .crayons-article__main')
    }

    protected getTagSelector() {
        return ".crayons-tag";
    }
}
