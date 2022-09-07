import { RecipeParser, remove } from './RecipeParser';
import { capitalizeFirstLetterEndWithDot } from "./common"

export class LeukeReceptenParser extends RecipeParser {

  canParse(url: URL) {
    return (
      url.hostname == "leukerecepten.nl" ||
      url.hostname == "www.leukerecepten.nl"
    );
  }

  protected parseHeader(document: Document) {
    let header = super.parseHeader(document)

    let subHeader = ""

    let porties = (document.querySelector('.icon--servings')?.parentElement?.textContent || '').trim()
    if (porties) {
      porties = porties.replace(/\s+(personen|porties)\s+/i, '')
      subHeader += `porties: ${porties}\n`
    }

    let timing = (document.querySelector('.icon--clock')?.parentElement?.textContent || '').trim()
    if (timing) {
      subHeader += `timing: ${timing}\n`
    }

    subHeader += "---\n\n"

    return header.replace("---\n\n", subHeader)
  }


  protected preParse(document: Document) {
    [
      '.print\\:text-lg',
      '.fiu-button-wrapper',
      'button',
      '.info-balloon',
      '#bereiding > *:not(.step)',
      '.icon--difficulty',
      '.hidden',
      '.page-content__meta li:last-child',
      '.page-content__title',
      '.responsive-image',
      '.ingredient-group > .justify-between > strong'
    ].forEach(el => remove(document, el))
  }

  protected getArticleNode(document: Document): HTMLElement | null {
    return document.querySelector('.page-content');
  }

  protected getTagSelector() {
    return ".stream__tags a";
  }

  protected getIngredientsNode(document: Document): HTMLElement | null {
    return document.querySelector(".page-content__ingredients-sidebar")
  }

  protected getStepsNode(document: Document): HTMLElement | null {

    let ul = document.createElement("ul")
    let stop = false
    document.querySelectorAll("#bereiding .step").forEach(el => {

      if (stop || el.textContent?.startsWith("Tip:")) {
        stop = true
        return
      }

      let li = document.createElement("li")
      let n = document.createTextNode(el.textContent || '')
      li.appendChild(n)
      ul.appendChild(li)
    })

    return ul
  }

  protected getTipsNode(document: Document): HTMLElement | null {

    let ul = document.createElement("ul")
    let start = false;

    document.querySelectorAll("#bereiding .step").forEach(el => {

      if (el.textContent?.startsWith("Tip:")) {
        start = true;
      }
      else if (!start) {
        return
      }

      let txt = el.textContent?.replace('Tip:', '').trim() || '';
      txt = capitalizeFirstLetterEndWithDot(txt)

      let li = document.createElement("li");
      let n = document.createTextNode(txt)
      li.appendChild(n)
      ul.appendChild(li)
    })

    return ul

  }

  protected getDescriptionNode(document: Document): HTMLElement | null {
    return document.querySelector(".page-content > p")
  }
}
