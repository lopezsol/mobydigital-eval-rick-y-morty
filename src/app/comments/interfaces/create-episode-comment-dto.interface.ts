export interface CreateCommentDto {
  content: string;
  idUser: string;
  userName: string;
  avatarUrl?: string;
}
