import { Episode } from '../interfaces/episode.interface';
import { RestEpisode } from '../interfaces/rest-episode.interface';

export class EpisodeMapper {
  static mapRestEpisodeToEpisode(restEpisode: RestEpisode): Episode {
    return {
      id: restEpisode.id,
      name: restEpisode.name,
      url: restEpisode.url
    };
  }
}
