import { CommentDropdown } from './../../../shared/enums/comment-dropdown.enum';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, of, tap } from 'rxjs';
import { CommentService } from '@comments/services/comment.service';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { AuthService } from '@auth/services/auth.service';
import { DropdownComponent } from '@shared/components/dropdown/dropdown.component';
import { Role } from '@auth/enums/role.enum';
import type { EpisodeComment } from '@comments/interfaces/episode-comment.interface';
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

  $postRefreshTrigger = signal<EpisodeComment | null>(null);

  $episodeId = toSignal(
    inject(ActivatedRoute).params.pipe(map((params) => params['id']))
  );
  $post = signal<Post | null>(null);
  $comments = computed(() => this.$post()?.comments);
  $totalComments = computed(() => this.$post()?.comments.length);
  $isAdmin = computed(() => this.authService.user()?.role === Role.Admin);
  $commentIdToDelete = signal<string | null>(null); //TODO: ver si cambiar nombre
  $postEnabledStatus = signal<boolean | null>(null);

  role = Role.Admin;

  onDisableComments() {
    console.log('me deshabilito');
    this.$postEnabledStatus.update((current) => !current);
  }

  postResource = rxResource({
    request: () => {
      return {
        episodeId: this.$episodeId(),
        refresh: this.$postRefreshTrigger(),
      };
    },
    loader: ({ request }) => {
      if (!request.episodeId) return of(null);

      return this.commentService
        .getPostByEpisodeId(request.episodeId)
        .pipe(tap((post) => this.$post.set(post)));
    },
  });

  postEnabledStatusResource = rxResource({
    request: () => {
      return {
        enabled: this.$postEnabledStatus(),
      };
    },
    loader: ({ request }) => {
      if (!request.enabled) return of(null);

      return this.commentService.updatePostEnabledStatus(
        this.$post()?.id!,
        request.enabled
      );
    },
  });

  // deleteCommentResource = rxResource({
  //   request: () => {
  //     return { commentIdToDelete: this.$commentIdToDelete() };
  //   },
  //   loader: ({ request }) => {
  //     if (!request.commentIdToDelete) {
  //       return of(null);
  //     }

  //     return this.commentService.deleteComment(this.$post()?.id!, this.$commentIdToDelete()!);
  //   },
  // });
}
