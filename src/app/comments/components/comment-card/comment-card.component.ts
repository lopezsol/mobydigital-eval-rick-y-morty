import { Component, input, output, signal } from '@angular/core';
import { AvatarFallbackPipe } from '@shared/pipes/avatar-fallback.pipe';
import { CommentDropdown } from '@shared/enums/comment-dropdown.enum';
import { DropdownComponent } from '@shared/components/dropdown/dropdown.component';
import type { User } from '@auth/interfaces/user.interface';
import type { EpisodeComment } from '@comments/interfaces/episode-comment.interface';
import type { UpdateCommentDto } from '@comments/interfaces/update-episode-comment-dto.interface';
import { CommentFormComponent } from '../comment-form/comment-form.component';

@Component({
  selector: 'comment-card',
  imports: [AvatarFallbackPipe, DropdownComponent, CommentFormComponent],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.css',
})
export class CommentCardComponent {
  $comment = input.required<EpisodeComment>();
  $isAdmin = input.required<boolean>();
  $user = input.required<User>();
  $postId = input.required<string>();

  $commentToDelete = output<string>();
  $commentUpdated = output();
  
  $isEditMode = signal<boolean>(false);

  commentDropdown = CommentDropdown;

  isCommentAuthor(): boolean {
    if (this.$user().id === this.$comment().author.userId) return true;
    return false;
  }

  onDelete() {
    this.$commentToDelete.emit(this.$comment().id);
  }
  onEdit() {
    this.$isEditMode.set(true);
  }
  onCommentUpdated() {
    this.$commentUpdated.emit();
    this.$isEditMode.set(false);
  }

}
