import type { EpisodeComment } from './episode-comment.interface';

export interface Post {
  id: string;
  idEpisode: number;
  enabled: boolean;
  comments: EpisodeComment[];
}
