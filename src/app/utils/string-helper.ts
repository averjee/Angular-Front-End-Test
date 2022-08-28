export class StringHelper {
  static trimAndLower(value: string) {
    return value.trim().toLowerCase();
  }

  static getSplittedStr(string: string, splitter: string, index: number) {
    // @ts-ignore
    return string.split(splitter).at(index);
  }
}
