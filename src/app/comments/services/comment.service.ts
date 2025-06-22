import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Post } from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor() {}

  mockPost: Post = {
    id: 'post-001',
    idEpisode: 10,
    enabled: true,
    comments: [
      {
        id: 'comment-001',
        content: 'This episode was amazing! 🚀',
        idUser: 'user-123',
        userName: 'Morty Smith',
        avatarUrl:
          'https://image.api.playstation.com/cdn/UP0151/CUSA09971_00/FEs8B2BDAudxV3js6SM2t4vZ88vnxSi0.png?w=440&thumb=false',
        createdAt: '2025-06-20T14:30:00.000Z',
      },
      {
        id: 'comment-002',
        content: 'I love the character development here.',
        idUser: 'user-456',
        userName: 'Rick Sanchez',
        avatarUrl:
          'https://www.dolldivine.com/images/rick-and-morty-character-maker-app.png',
        createdAt: '2025-06-20T15:00:00.000Z',
      },
      {
        id: 'comment-003',
        content: 'Not my favorite episode, but still fun!',
        idUser: 'user-789',
        userName: 'Summer Smith',
        // Sin avatarUrl → usa la default en el frontend
        createdAt: '2025-06-21T08:45:00.000Z',
      },
    ],
  };

  //TODO: implementar cuando este la BE hecha
  getPostByEpisodeId(id: number) {
    return of(this.mockPost);
  }

  //TODO: implementar cuando este la BE hecha
  updatePostEnabledStatus(postId: string, enabled: boolean) {
    this.mockPost.enabled = !this.mockPost.enabled;
  }
}
