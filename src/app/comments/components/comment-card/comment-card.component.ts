import { Component, input } from '@angular/core';
import { Comment } from '@comments/interfaces/comment.interface';
import { AvatarFallbackPipe } from '@shared/pipes/avatar-fallback.pipe';

@Component({
  selector: 'comment-card',
  imports: [AvatarFallbackPipe],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.css',
})
export class CommentCardComponent { 
  $comment = input.required<Comment>()
}
