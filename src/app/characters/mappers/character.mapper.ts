import { Character } from '../interfaces/character.interface';
import { RestCharacter } from '../interfaces/paginated-characters.interface';

export class CharacterMapper {
  static mapRestCharacterToCharacter(restCharacter: RestCharacter): Character {
    return {
      id: restCharacter.id,
      name: restCharacter.name,
      status: restCharacter.status,
      species: restCharacter.species,
      type: restCharacter.type,
      gender: restCharacter.gender,
      origin: restCharacter.origin,
      location: restCharacter.location,
      image: restCharacter.image,
      episode: restCharacter.episode,
      url: restCharacter.url,
      created: restCharacter.created,
    };
  }

  static mapRestCharactersToCharacterArray(
    restCharacters: RestCharacter[]
  ): Character[] {
    return restCharacters.map(this.mapRestCharacterToCharacter);
  }
}
