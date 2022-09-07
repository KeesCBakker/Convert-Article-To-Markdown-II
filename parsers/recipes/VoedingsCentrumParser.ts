import { RecipeParser, remove } from './RecipeParser';
import { capitalizeFirstLetterEndWithDot } from "./common"

export class VoedingsCentrumParser extends RecipeParser {

  canParse(url: URL) {
    return (
      url.hostname == "voedingscentrum.nl" ||
      url.hostname == "www.voedingscentrum.nl"
    );
  }

  protected parseHeader(document: Document) {
    let header = super.parseHeader(document)

    let subHeader = ""

    let porties = (document.querySelector('.informatie .personen')?.textContent || '').trim()
    if (porties) {
      porties = porties.replace(/\s+(personen|porties)\s+/i, '')
      subHeader += `porties: ${porties}\n`
    }

    let timing = (document.querySelector('.informatie .bereiding')?.textContent || '').trim()
    if (timing) {
      subHeader += `tijd: ${timing}\n`
    }

    let calories = (document.querySelector('*[itemprop=calories]')?.textContent || '').trim()
    if (calories) {
      calories = calories.replace(/\s+/, " ")
      subHeader += `energie: ${calories}\n`
    }

    subHeader += "---\n\n"

    return header.replace("---\n\n", subHeader)
  }


  protected preParse(document: Document) {
    ['.ingredienten h3'].forEach(selector => remove(document, selector))
  }

  protected getTagSelector() {
    return ".infomatie .gerecht";
  }

  protected getIngredientsNode(document: Document): HTMLElement | null {
    return document.querySelector(".ingredienten")
  }

  protected getStepsNode(document: Document): HTMLElement | null {
    return document.querySelector("*[itemprop=recipeInstructions]")
  }

  protected getDescriptionNode(document: Document): HTMLElement | null {
    return document.querySelector("*[itemprop=description]")
  }

  protected getTipsNode(document: Document): HTMLElement | null {
    return null
  }
}
