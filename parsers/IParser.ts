interface IParser {

  canParse(url: URL): boolean

  parse(url: URL): Promise<string>
}
