import { Component, input, output } from '@angular/core';
import { AvatarFallbackPipe } from '@shared/pipes/avatar-fallback.pipe';
import { CommentDropdown } from '@shared/enums/comment-dropdown.enum';
import { DropdownComponent } from '@shared/components/dropdown/dropdown.component';
import type { User } from '@auth/interfaces/user.interface';
import type { EpisodeComment } from '@comments/interfaces/episode-comment.interface';

@Component({
  selector: 'comment-card',
  imports: [AvatarFallbackPipe, DropdownComponent],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.css',
})
export class CommentCardComponent {
  $comment = input.required<EpisodeComment>();
  $isAdmin = input.required<boolean>();
  $user = input.required<User>();
  $editComment = output<string>();
  $deleteComment = output<string>();

  commentDropdown = CommentDropdown;

  isCommentAuthor(): boolean {
    if (this.$user().id === this.$comment().idUser) return true;
    return false;
  }

  onDelete() {
    console.log('me borro');
    this.$deleteComment.emit(this.$comment().id);
  }
  onEdit() {
    console.log('me edito');
    this.$editComment.emit(this.$comment().id);
  }
}
