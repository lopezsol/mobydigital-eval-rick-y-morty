import type { Comment } from './comment.interface';

export interface Post {
  id: string;
  idEpisode: number;
  enabled: boolean;
  comments: Comment[];
}
