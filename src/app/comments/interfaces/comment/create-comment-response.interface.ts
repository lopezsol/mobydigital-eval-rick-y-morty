import { EpisodeComment } from "./comment.interface";

export interface CreateCommentResponse {
  header: {
    message?: string;
    resultCode: number;
    error?: string;
  };
  data?: {
    newComment: EpisodeComment;
  };
}
