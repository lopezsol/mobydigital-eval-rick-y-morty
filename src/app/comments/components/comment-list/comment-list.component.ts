import { Component, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, of, tap } from 'rxjs';
import { CommentService } from '@comments/services/comment.service';
import type { Post } from '@comments/interfaces/post.interface';
import { CommentCardComponent } from "../comment-card/comment-card.component";

@Component({
  selector: 'comment-list',
  imports: [CommentCardComponent],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css',
})
export class CommentListComponent {
  commentService = inject(CommentService);

  $id = toSignal(
    inject(ActivatedRoute).params.pipe(map((params) => params['id']))
  );
  $post = signal<Post | null>(null);
  $comments = computed(() => this.$post()?.comments);
  $totalComments = computed(() => this.$post()?.comments.length);

  commentResource = rxResource({
    request: () => {
      return { id: this.$id() };
    },
    loader: ({ request }) => {
      if (!request.id) return of(null);

      return this.commentService
        .getPostByEpisodeId(this.$id())
        .pipe(tap((post) => this.$post.set(post)));
    },
  });
}
