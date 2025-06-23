import { Component, input, output } from '@angular/core';
import { AvatarFallbackPipe } from '@shared/pipes/avatar-fallback.pipe';
import type { EpisodeComment } from '@comments/interfaces/episode-comment.interface';

@Component({
  selector: 'comment-card',
  imports: [AvatarFallbackPipe],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.css',
})
export class CommentCardComponent {
  $comment = input.required<EpisodeComment>();
  $editComment = output<void>();
  $deleteComment = output<string>();

  onDelete() {
    this.$deleteComment.emit(this.$comment().id);
  }
  onEdit() {
    this.$editComment.emit();
  }
}
