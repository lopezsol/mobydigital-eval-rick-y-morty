export interface EpisodeComment {
  id: string;
  content: string;
  postId: string;
  createdAt: string;
  author: {
    name: string;
    userId: string;
    avatarUrl: string;
  };
}
