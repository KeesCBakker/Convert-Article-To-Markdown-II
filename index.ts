import readline from 'readline-sync'
import { DefaultParser } from './parsers/DefaultParser'
import { DevToParser } from './parsers/DevToParser'
import { KeesTalksTechParser, NrcParser } from './parsers/KeesTalksTechParser'
import { LeukeReceptenParser } from "./parsers/recipes/LeukeReceptenParser"
import { VoedingsCentrumParser } from "./parsers/recipes/VoedingsCentrumParser"


async function run() {

  var parsers = [
    new DevToParser(),
    new KeesTalksTechParser(),
    new LeukeReceptenParser(),
    new NrcParser(),
    new VoedingsCentrumParser(),
    new DefaultParser()
  ]

  while (true) {

    console.log()
    console.log("CONVERT ARTICLE TO MARKDOWN")
    console.log("---------------------------")
    console.log()

    try {

      let url = readline.question(`Please enter URL: `);
      let u = new URL(url)
      let content = ''

      for (let p of parsers) {
        if (p.canParse(u)) {
          content = await p.parse(u)
          break
        }
      }

      console.log()
      console.log()
      console.log(content)
      console.log()
      console.log()

    } catch (error) {
      console.log()
      console.log()
      console.log("Sorry, all I got was:", error.message)
      console.log()
      console.log()
    }

  }
}

run()