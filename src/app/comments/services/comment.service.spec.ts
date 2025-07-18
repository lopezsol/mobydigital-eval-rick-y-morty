import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CommentService } from './comment.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '@auth/services/auth.service';
import { PostResponse } from '@comments/interfaces/post-response.interface copy';
import { CommentResponse } from '@comments/interfaces/comment/comment-response.interface';
import { CreateCommentResponse } from '@comments/interfaces/comment/create-comment-response.interface';

const mockToken = 'mock-token';

const mockAuthService = {
  token: () => mockToken,
};
const baseUrl = environment.AUTH_API_URL;

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        CommentService,
      ],
    });

    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Normal behavior', () => {
    it('should retrieve post by episodeId', () => {
      const mockResponse = {
        header: { resultCode: 0 },
        data: { newPost: { id: 'abc123', episodeId: 1, enabled: true } },
      };

      service.getPostByEpisodeId(1).subscribe((post) => {
        expect(post).toEqual(mockResponse.data.newPost);
      });

      const req = httpMock.expectOne(`${baseUrl}/post/1`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('auth-token')).toBe('mock-token');
      req.flush(mockResponse);
    });

    it('should retrieve comments by postId', () => {
      const postId = 'abc123';
      const mockResponse = {
        data: {
          comments: [{ id: 'c1', content: 'Nice!' }],
          info: { totalComments: 1 },
        },
      };

      service.getAllCommentsByPostId(postId, 1, 20).subscribe((res) => {
        expect(res.comments.length).toBe(1);
        expect(res.totalComments).toBe(1);
      });

      const req = httpMock.expectOne(
        `${baseUrl}/comment/${postId}?page=1&limit=20`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('auth-token')).toBe('mock-token');
      req.flush(mockResponse);
    });

    it('should create a comment', () => {
      const postId = 'abc123';
      const content = 'Nuevo comentario';
      const mockResponse = {
        header: {},
        data: {
          newComment: {
            id: 'c1',
            content,
            postId,
            createdAt: '2024-06-01T12:00:00Z',
            author: {
              name: 'Test User',
              userId: 'u1',
              avatarUrl: 'https://example.com/avatar.png',
            },
          },
        },
      };

      service.createComment(postId, content).subscribe((comment) => {
        expect(comment).toEqual(mockResponse.data.newComment);
      });

      const req = httpMock.expectOne(`${baseUrl}/comment/create`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should edit a comment', () => {
      const mockResponse = { header: {}, data: {} };

      service.editComment('c1', 'Texto editado').subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/comment/update`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ id: 'c1', content: 'Texto editado' });
      req.flush(mockResponse);
    });

    it('should delete a comment', () => {
      const mockResponse = { header: {}, data: {} };

      service.deleteComment('c1').subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/comment/delete`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual({ id: 'c1' });
      req.flush(mockResponse);
    });

    it('should update post enabled status', () => {
      const mockResponse = { header: {}, data: {} };

      service.updatePostEnabledStatus('p1', true).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/post/update`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ id: 'p1', enabled: true });
      req.flush(mockResponse);
    });
  });

  describe('Edge cases and null responses', () => {
    it('should return null if newPost is undefined', () => {
      const mockResponse: PostResponse = {
        header: { resultCode: 0 }, //TODO: revisar cual es el resultCode si no se pudo crear
      };

      service.getPostByEpisodeId(1).subscribe((post) => {
        expect(post).toBeNull();
      });

      const req = httpMock.expectOne(`${baseUrl}/post/1`);
      req.flush(mockResponse);
    });

    it('should return [] and 0 if comments and totalComments are undefined', () => {
      const mockResponse: CommentResponse = {
        header: { resultCode: 0 }, //TODO: revisar cual es el resultCode si no se pudo crear
      };
      service.getAllCommentsByPostId('p1').subscribe((res) => {
        expect(res.comments).toEqual([]);
        expect(res.totalComments).toBe(0);
      });

      const req = httpMock.expectOne(`${baseUrl}/comment/p1?page=1&limit=20`);
      req.flush(mockResponse);
    });

    it('should return null if newComment is undefined', () => {
      const mockResponse: CreateCommentResponse = {
        header: { resultCode: 0 }, //TODO: revisar cual es el resultCode si no se pudo crear
      };

      service.createComment('p1', 'Texto').subscribe((res) => {
        expect(res).toBeNull();
      });

      const req = httpMock.expectOne(`${baseUrl}/comment/create`);
      req.flush(mockResponse);
    });
  });
});

describe('CommentService - Token variations', () => {
  [
    { desc: 'undefined token', token: undefined, expected: '' },
    { desc: 'null token', token: null, expected: '' },
    { desc: 'empty string token', token: '', expected: '' },
    { desc: 'valid token', token: 'mock-token', expected: 'mock-token' },
  ].forEach(({ desc, token, expected }) => {
    describe(`with ${desc}`, () => {
      let service: CommentService;
      let httpMock: HttpTestingController;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],
          providers: [
            { provide: AuthService, useValue: { token: () => token } },
            CommentService,
          ],
        });

        service = TestBed.inject(CommentService);
        httpMock = TestBed.inject(HttpTestingController);
      });

      afterEach(() => {
        httpMock.verify();
      });

      it('should call getPostByEpisodeId with correct auth-token header', () => {
        const episodeId = 1;
        const mockResponse = {
          data: { newPost: { id: 'p1', episodeId: 1, enabled: true } },
        };

        service.getPostByEpisodeId(episodeId).subscribe((post) => {
          expect(post).toEqual(mockResponse.data.newPost);
        });

        const req = httpMock.expectOne(`${baseUrl}/post/${episodeId}`);
        expect(req.request.headers.get('auth-token')).toBe(expected);
        req.flush(mockResponse);
      });

      it('should call getAllCommentsByPostId with correct auth-token header', () => {
        const postId = '123';
        const mockResponse = {
          data: {
            comments: [{ id: 'c1', content: 'Comment' }],
            info: { totalComments: 1 },
          },
        };

        service.getAllCommentsByPostId(postId).subscribe((res) => {
          expect(res.comments.length).toBe(1);
          expect(res.totalComments).toBe(1);
        });

        const req = httpMock.expectOne(
          `${baseUrl}/comment/${postId}?page=1&limit=20`
        );
        expect(req.request.headers.get('auth-token')).toBe(expected);
        req.flush(mockResponse);
      });

      it('should call createComment with correct auth-token header', () => {
        const postId = '123';
        const content = 'Nuevo comentario';
        const mockResponse = {
          data: { newComment: { id: 'c1', content } },
        };

        service.createComment(postId, content).subscribe((res) => {
          expect(res?.content).toBe(content);
        });

        const req = httpMock.expectOne(`${baseUrl}/comment/create`);
        expect(req.request.method).toBe('POST');
        expect(req.request.headers.get('auth-token')).toBe(expected);
        req.flush(mockResponse);
      });

      it('should call editComment with correct auth-token header', () => {
        const id = 'c1';
        const content = 'Comentario editado';

        service.editComment(id, content).subscribe((res) => {
          expect(res.data).toBeTruthy();
        });

        const req = httpMock.expectOne(`${baseUrl}/comment/update`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.headers.get('auth-token')).toBe(expected);
        req.flush({ header: {}, data: { updated: true } });
      });

      it('should call deleteComment with correct auth-token header', () => {
        const idComment = 'c1';

        service.deleteComment(idComment).subscribe((res) => {
          expect(res.data).toBeTruthy();
        });

        const req = httpMock.expectOne(`${baseUrl}/comment/delete`);
        expect(req.request.method).toBe('DELETE');
        expect(req.request.headers.get('auth-token')).toBe(expected);
        req.flush({ header: {}, data: { deleted: true } });
      });

      it('should call updatePostEnabledStatus with correct auth-token header', () => {
        const postId = 'p1';
        const enabled = true;

        service.updatePostEnabledStatus(postId, enabled).subscribe((res) => {
          expect(res.data).toBeTruthy();
        });

        const req = httpMock.expectOne(`${baseUrl}/post/update`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.headers.get('auth-token')).toBe(expected);
        req.flush({ header: {}, data: { updated: true } });
      });
    });
  });
});
