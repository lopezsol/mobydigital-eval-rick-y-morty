import type { EpisodeComment } from './episode-comment.interface';

export interface Post {
  id: string;
  episodeId: number;
  enabled: boolean;
  // comments?: EpisodeComment[];
}
