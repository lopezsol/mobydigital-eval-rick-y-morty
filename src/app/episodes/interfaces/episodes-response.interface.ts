import type { PaginationInfo } from '@characters/interfaces/pagination-info.interface';
import type { EpisodeResponse } from './episode-response.interface';

export interface EpisodesResponse {
  info: PaginationInfo;
  results: EpisodeResponse[];
}
