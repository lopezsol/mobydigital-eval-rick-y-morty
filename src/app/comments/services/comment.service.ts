import { map, of } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import type { Post } from '../interfaces/post.interface';
import type { CreateCommentDto } from '@comments/interfaces/create-episode-comment-dto.interface';
import type { EpisodeComment } from '@comments/interfaces/episode-comment.interface';
import type { UpdateCommentDto } from '@comments/interfaces/update-episode-comment-dto.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommentResponse } from '@comments/interfaces/comment-response.interface';
import { environment } from 'src/environments/environment';

const apiUrl = environment.AUTH_API_URL;

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http = inject(HttpClient);

  //TODO: implementar cuando este la BE hecha
  getPostByEpisodeId(id: number) {
    return of();
  }

  getAllCommentsByPostId(postId: string, page = 1, limit = 20) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http
      .get<CommentResponse>(`${apiUrl}/comment/${postId}`, { params })
      .pipe(
        map((response) => {
          return {
            comments: response.data?.comments ?? [],
            totalComments: response.data?.info?.totalComments ?? 0,
          };
        })
      );
  }

  //TODO: implementar cuando este la BE hecha
  createComment(postId: string, comment: CreateCommentDto) {
    console.log('me cree: ', postId, comment);
    return of({} as EpisodeComment);
  }

  editComment(postId: string, comment: UpdateCommentDto) {
    console.log('me edite: ', postId, comment);
    return of({} as EpisodeComment);
  }

  //TODO: implementar cuando este la BE hecha
  deleteComment(postId: string, idComment: string) {
    return of(true);
  }

  //TODO: implementar cuando este la BE hecha
  updatePostEnabledStatus(postId: string, enabled: boolean) {
    return of(true);
  }
}
