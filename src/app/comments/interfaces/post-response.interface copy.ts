import { EpisodeComment } from './episode-comment.interface';
import { Post } from './post.interface';

export interface PostResponse {
  header: {
    message?: string;
    resultCode: number;
    error?: string;
  };
  data?: {
    newPost: Post;
  };
}
