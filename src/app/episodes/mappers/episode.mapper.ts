import type { EpisodeResponse } from '@episodes/interfaces/episode-response.interface';
import type { Episode } from '../interfaces/episode.interface';

export class EpisodeMapper {
  static mapEpisodeResponseToEpisode(
    episodeResponse: EpisodeResponse
  ): Episode {
    return {
      id: episodeResponse.id,
      name: episodeResponse.name,
      url: episodeResponse.url,
      air_date: episodeResponse.air_date,
      characters: episodeResponse.characters,
      episode: episodeResponse.episode,
    };
  }

  static mapEpisodesResponseToEpisodesArray(
    episodesResponse: EpisodeResponse[]
  ): Episode[] {
    return episodesResponse.map(this.mapEpisodeResponseToEpisode);
  }
}
