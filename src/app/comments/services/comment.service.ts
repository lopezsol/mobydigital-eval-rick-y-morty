import { map, of } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import type { Post } from '../interfaces/post.interface';
import type { CreateCommentDto } from '@comments/interfaces/comment/create-comment-dto.interface';
import type { EpisodeComment } from '@comments/interfaces/comment/comment.interface';
import type { UpdateCommentDto } from '@comments/interfaces/comment/update-comment-dto.interface';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CommentResponse } from '@comments/interfaces/comment/comment-response.interface';
import { environment } from 'src/environments/environment';
import { AuthService } from '@auth/services/auth.service';
import { PostResponse } from '@comments/interfaces/post-response.interface copy';
import { CreateCommentResponse } from '@comments/interfaces/comment/create-comment-response.interface';

const apiUrl = environment.AUTH_API_URL;

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getPostByEpisodeId(episodeId: number) {
    const token = this.authService.token();

    const headers = new HttpHeaders({
      'auth-token': token ?? '',
    });

    return this.http
      .get<PostResponse>(`${apiUrl}/post/${episodeId}`, { headers })
      .pipe(map((response) => response.data?.newPost ?? null));
  }

  getAllCommentsByPostId(postId: string, page = 1, limit = 20) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    const token = this.authService.token();

    const headers = new HttpHeaders({
      'auth-token': token ?? '',
    });

    return this.http
      .get<CommentResponse>(`${apiUrl}/comment/${postId}`, { params, headers })
      .pipe(
        map((response) => {
          console.log(response.data?.comments);
          return {
            comments: response.data?.comments ?? [],
            totalComments: response.data?.info?.totalComments ?? 0,
          };
        })
      );
  }

  createComment(postId: string, content: string) {
    const token = this.authService.token();

    const headers = new HttpHeaders({
      'auth-token': token ?? '',
      'Content-Type': 'application/json',
    });

    const body = {
      postId,
      content,
    };

    return this.http
      .post<CreateCommentResponse>(`${apiUrl}/comment/create`, body, {
        headers,
      })
      .pipe(map((res) => res.data?.newComment ?? null));
  }

  editComment(id: string, content: string) {
    const token = this.authService.token();

    const headers = new HttpHeaders({
      'auth-token': token ?? '',
      'Content-Type': 'application/json',
    });

    const body = {
      id,
      content,
    };

    return this.http.put<{ header: any; data: any }>(
      `${apiUrl}/comment/update`,
      body,
      {
        headers,
      }
    );
  }

  deleteComment(idComment: string) {
    const token = this.authService.token();

    const headers = new HttpHeaders({
      'auth-token': token ?? '',
      'Content-Type': 'application/json',
    });

    const body = {
      id: idComment,
    };

    return this.http.request<{ header: any; data: any }>(
      'DELETE',
      `${apiUrl}/comment/delete`,
      {
        headers,
        body,
      }
    );
  }

  updatePostEnabledStatus(postId: string, enabled: boolean) {
    const token = this.authService.token();

    const headers = new HttpHeaders({
      'auth-token': token ?? '',
      'Content-Type': 'application/json',
    });

    const body = {
      id: postId,
      enabled,
    };

    return this.http.put<{ header: any; data: any }>(
      `${apiUrl}/post/update`,
      body,
      { headers }
    );
  }
}
