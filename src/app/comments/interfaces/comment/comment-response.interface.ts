import { EpisodeComment } from './comment.interface';

export interface CommentResponse {
  header: {
    message?: string;
    resultCode: number;
    error?: string;
  };
  data?: {
    info: {
      totalComments: number;
      commentsPerPage: number;
      totalPages: number;
      page: number;
      nextPage: number; 
    };
    comments: EpisodeComment[];
  };
}
