import { EpisodeComment } from './episode-comment.interface';

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
      nextPage: number; //TODO: revisar si es number
    };
    comments: EpisodeComment[];
  };
}
