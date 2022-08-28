import { Character } from 'app/app.component';
import { StringHelper } from './string-helper';

export class OrderBy {
  static removeItem<T>(chars: T[], char: T) {
    chars.splice(chars.indexOf(char), 1);
  }

  static appearance(chars: { episode: Character['episode'] }[]) {
    const orderedChars: { episode: Character['episode'] }[] = [];

    const charsAppear = chars
      .map(({ episode }) => +StringHelper.getSplittedStr(episode[0], '/', -1))
      .sort((a, b) => a - b);

    charsAppear.map((appear, index) => {
      if (index === chars.length - 1) return orderedChars.push(...chars);

      chars.forEach(char => {
        if (+StringHelper.getSplittedStr(char.episode[0], '/', -1) !== appear) return;

        orderedChars.push(char);
        this.removeItem(chars, char);
      });
    });

    return orderedChars as any as Character[];
  }

  static gender(chars: { gender: Character['gender'] }[], selectedGender: Character['gender']) {
    const orderedChars = chars.filter(char => {
      if (char.gender.toLowerCase() !== selectedGender) return;
      this.removeItem(chars, char);
      return true;
    });

    return [...orderedChars, ...chars] as any as Character[];
  }
}
