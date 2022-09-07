import { DefaultParser, elementToMarkdown } from '../DefaultParser'
import { parseHTML } from 'linkedom'
import removeMd from 'remove-markdown'
import { scrape } from "../scraper"

export function toMarkdown(el: HTMLElement | null) {
  let content = elementToMarkdown(el)

  // remove bolds
  return content.replace(/\*\*/g, '')
}

export abstract class RecipeParser extends DefaultParser {

  protected parseHeader(document: Document) {
    let header = super.parseHeader(document)

    let subHeader = ""

    let featureImage = (
      document.querySelector('meta[property=og\\:image]')?.getAttribute("content") ||
      document.querySelector('link[rel=image_src]')?.getAttribute("href")
    )
    if (featureImage) {
      subHeader += `image: ${featureImage}\n`
    }

    subHeader += `created: ${new Date().toISOString()}\n`
    subHeader += "---\n\n"

    return header.replace("---\n\n", subHeader)
  }

  abstract canParse(url: URL): boolean

  async parse(url: URL) {

    this._url = url

    let txt = await scrape(url)
    const { document } = parseHTML(txt)
    this.preParse(document)

    let ingredients = toMarkdown(this.getIngredientsNode(document))
    let steps = toMarkdown(this.getStepsNode(document))
    let tips = toMarkdown(this.getTipsNode(document))
    let title = toMarkdown(this.getTitleNode(document))
    let description = toMarkdown(this.getDescriptionNode(document))

    let content = ""

    if (title) {
      title = removeMd(title)
      content += `# ${title}\n`
    }

    if (description) {
      description = removeMd(description)
      content += description
      content += "\n\n"
    }

    if (ingredients) {

      ingredients = ingredients.split("* ")
        .map(x => processIngredients(x))
        .map(x => multiplyIngredients(x, 1))
        .join("* ")

      content += "## Ingrediënten\n"
      content += ingredients
      content += "\n\n"
    }

    if (steps) {
      content += "## Stappen\n"
      content += steps
      content += "\n\n"
    }

    if (tips) {
      content += "## Tips\n"
      content += tips
      content += "\n\n"
    }

    content = content.trim()

    let header = this.parseHeader(document)

    return header + content
  }

  protected abstract getIngredientsNode(document: Document): HTMLElement | null
  protected abstract getStepsNode(document: Document): HTMLElement | null
  protected abstract getTipsNode(document: Document): HTMLElement | null
  protected abstract getDescriptionNode(document: Document): HTMLElement | null

  protected getTitleNode(document: Document): HTMLElement | null {
    return document.querySelector("h1")
  }

}

export function remove(document: Document, selector: string) {
  document.querySelectorAll(selector).forEach(el => {
    el.remove()
  })
}

export function processIngredients(line: string) {
  return line
    .replace('to maten', 'tomaten')
    .replace(/ eetl /g, ' el ')
    .replace(/ g /g, ' gr ')
    .replace('gram', 'gr')
    .replace('theelepel', 'tl')
    .replace('theel', 'tl')
    .replace('tls', 'tl')
    .replace('milliliter', 'ml')
    .replace('mililtr', 'ml')
    .replace('liter', 'ltr')
    .replace('eetlepels', 'el')
    .replace('eetlepel', 'el')
    .replace(/([Pp]eper) en zout/i, '$1 & zout')
    .replace(/1½/, '1.5')
    .replace(/1\/2/g, '0.5')
    .replace(/1\/4/g, '0.25')
    .replace(/½/g, '0.5')
    .replace(/¼/g, '0.25')
}


export function multiplyIngredients(item: string, multiplier: number) {
  let isOne = /(^| )(1) /.test(item)

  item = item.replace(/^[Ss]nuf /, 'snufje ')

  if (multiplier > 1) {
    item = item
      .replace(
        /^([Hh]andje|[Ss]cheutje|[Kk]lontje|[Zz]akje|[Ss]neetje|[Ss]nufje)/,
        '1 $1s',
      )
      .replace(/^[Kk]lont /, '1 klontjes ')
      .replace(/^[Pp]aar /, '1 handjes ')
      .replace(/ml\/gr/g, 'gr')
      .replace(/(\d+),(\d+)/g, '$1.$2')
      .replace(/1½/, '1.5')
      .replace(/1\/2/g, '0.5')
      .replace(/1\/4/g, '0.25')
      .replace(/½/g, '0.5')
      .replace(/¼/g, '0.25')
      .replace(/⅓/g, '0.333333333333')
      .replace(/(?<!a\s(\d+)?)\d+(\.\d+)?/g, function(match, capture) {
        if (match.includes('.')) {
          let f = parseFloat(match) * multiplier
          return f.toFixed(2).replace(/\.?0+$/, '')
        }

        return (parseInt(match) * multiplier).toString()
      })
      .replace(/(\d{4,}) gr /g, function(match, capture) {
        return parseInt(match) / 1000 + ' kg '
      })
      .replace(/(\d{4,}) ml /g, function(match, capture) {
        return parseInt(match) / 1000 + ' ltr '
      })
  }

  item = item
    .replace(/ml\/gr/g, 'gr.')
    .replace(/( (ml|gr|kg|el|tl|ltr)) /g, '$1. ')

  //check if something has a unit, but skip constructions like "a 100 ml"
  let hasUnit =
    /(?<!a\s(\d+)?)\d+(\.\d+) (ml|gr|kg|el|tl|ltr|stukken|stuks)/.test(item)

  if (isOne && !hasUnit && multiplier > 1) {
    item = item
      .replace(
        /(ui|limoen|citroen|meloen|prei|[Ss]cheut)( |$)/g,
        '$1' + 'en' + '$2',
      )
      .replace(
        /(uitje|appel|peper|bakje|sneetje|snufje|plak|courgette|handje|komkommer|teentje|blikje|zakje|klontje|blokje|wrap|kopje|lapje)( |$)/g,
        '$1' + 's' + '$2',
      )
      .replace(/(snee)( |$)/g, 'sneden$2')
      .replace(/(ei)( |$)/g, 'eieren$2')
      .replace(/(avocado)( |$)/g, "$1's$2")
      .replace(/(kop)( |$)/g, 'koppen$2')
      .replace(/(kool)( |$)/g, 'kolen$2')
      .replace(/(teen)( |$)/g, 'tenen$2')
      .replace(/(tablet)( |$)/g, 'tabletten$2')
      .replace(/(banaan)( |$)/g, 'bananen$2')
      .replace(/(peer)( |$)/g, 'peren$2')
      .replace(/(blik)( |$)/g, 'blikken$2')
      .replace(/(middelgroot)( |$)/, 'middelgrote$2')
      .replace(/(klein blikjes)( |$)/g, 'kleine blikjes$2')
  }

  return item
}
