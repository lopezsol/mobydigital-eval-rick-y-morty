import { Component, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, of, tap } from 'rxjs';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { CommentService } from '@comments/services/comment.service';
import { AuthService } from '@auth/services/auth.service';
import { Role } from '@auth/enums/role.enum';
import { DropdownComponent } from '@shared/components/dropdown/dropdown.component';
import { CommentDropdown } from '@shared/enums/comment-dropdown.enum';
import type { EpisodeComment } from '@comments/interfaces/comment/comment.interface';
import type { Post } from '@comments/interfaces/post.interface';

@Component({
  selector: 'comment-list',
  imports: [CommentCardComponent, CommentFormComponent, DropdownComponent],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css',
})
export class CommentListComponent {
  commentService = inject(CommentService);
  authService = inject(AuthService);
  commentDropdown = CommentDropdown;

  $commentRefreshTrigger = signal<boolean | null>(null);
  $commentIdToDelete = signal<string | null>(null);
  $postEnabledStatusToUpdate = signal<boolean | null>(null);

  $episodeId = toSignal(
    inject(ActivatedRoute).params.pipe(map((params) => params['id']))
  );
  $post = signal<Post | null>(null);
  $comments = signal<EpisodeComment[] | null>(null);
  $totalComments = signal<number>(0);
  $isAdmin = computed(() => this.authService.user()?.role === Role.Admin);

  onDisableComments() {
    this.$postEnabledStatusToUpdate.set(!this.$post()?.enabled);
  }

  postResource = rxResource({
    request: () => {
      return {
        episodeId: this.$episodeId(),
      };
    },
    loader: ({ request }) => {
      if (!request.episodeId) return of(null);

      return this.commentService
        .getPostByEpisodeId(request.episodeId)
        .pipe(tap((post) => this.$post.set(post)));
    },
  });

  commentResource = rxResource({
    request: () => {
      return {
        postId: this.$post()?.id,
        refresh: this.$commentRefreshTrigger(),
      };
    },
    loader: ({ request }) => {
      if (!request.postId) return of(null);
      if (request.refresh === false) return of(null);

      return this.commentService.getAllCommentsByPostId(request.postId).pipe(
        tap((res) => {
          this.$comments.set(res.comments);
          this.$totalComments.set(res.totalComments);
        }),
        tap(() => this.$commentRefreshTrigger.set(false))
      );
    },
  });

  postEnabledStatusResource = rxResource({
    request: () => {
      return {
        enabled: this.$postEnabledStatusToUpdate(),
      };
    },
    loader: ({ request }) => {
      if (request.enabled === null) return of(null);

      return this.commentService
        .updatePostEnabledStatus(this.$post()?.id!, request.enabled)
        .pipe(
          tap(() =>
            this.$post.update((current) => {
              if (!current) return current;
              return {
                ...current,
                enabled: request.enabled!,
              };
            })
          )
        );
    },
  });

  deleteCommentResource = rxResource({
    request: () => {
      return { commentIdToDelete: this.$commentIdToDelete() };
    },
    loader: ({ request }) => {
      if (!request.commentIdToDelete) {
        return of(null);
      }

      return this.commentService
        .deleteComment(request.commentIdToDelete)
        .pipe(tap(() => this.$commentRefreshTrigger.set(true)));
    },
  });
}
