export interface EpisodeComment {
  id: string;
  content: string;
  idUser: string;
  userName: string;
  avatarUrl?: string;
  createdAt: string;
}
