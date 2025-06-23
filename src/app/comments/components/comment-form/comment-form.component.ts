import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { of, tap } from 'rxjs';
import { FormUtils } from '@utils/form-utils';
import { CommentService } from '@comments/services/comment.service';
import type { EpisodeComment } from '@comments/interfaces/episode-comment.interface';
import type { CreateCommentDto } from '@comments/interfaces/create-episode-comment-dto.interface';
import type { User } from '@auth/interfaces/user.interface';
import { SnackbarErrorComponent } from "../../../shared/components/snackbar-error/snackbar-error.component";
import { LoaderComponent } from "../../../shared/components/loader/loader.component";

@Component({
  selector: 'comment-form',
  imports: [ReactiveFormsModule, SnackbarErrorComponent, LoaderComponent],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.css',
})
export class CommentFormComponent {
  fb = inject(FormBuilder);
  commentService = inject(CommentService);
  $newComment = signal<CreateCommentDto | null>(null);
  $user = input.required<User>();
  $postId = input.required<string>();
  $commentCreated = output<EpisodeComment>();

  $focused = signal(false);

  formUtils = FormUtils;

  commentForm = this.fb.group({
    content: [
      '',
      [
        Validators.required,
        Validators.maxLength(500),
        FormUtils.noWhitespaceValidator,
        FormUtils.minTrimmedLength(1),
      ],
    ],
  });

  onSubmit() {
    const content = this.commentForm.value.content?.trim();
    if (!content) return;
    const newComment: CreateCommentDto = this.buildCreateCommentDto(content);
    this.$newComment.set(newComment!);
    this.commentForm.reset();
  }

  onBlur() {
    const content = this.commentForm.get('content')?.value;
    if (!content) {
      this.$focused.set(false);
    }
  }

  onCancel() {
    this.commentForm.reset();
    this.$focused.set(false);
  }

  buildCreateCommentDto(content: string): CreateCommentDto {
    const newComment: CreateCommentDto = {
      content,
      idUser: this.$user().id,
      userName: this.$user().name,
      avatarUrl: this.$user().avatarUrl,
    };
    return newComment;
  }

  createCommentResource = rxResource({
    request: () => {
      return { comment: this.$newComment() };
    },
    loader: ({ request }) => {
      if (!request.comment) return of(null);

      return this.commentService
        .createComment(this.$postId(), request.comment)
        .pipe(tap((comment) => this.$commentCreated.emit(comment)));
    },
  });
}
