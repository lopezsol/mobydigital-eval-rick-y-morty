import {
  booleanAttribute,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { of, tap } from 'rxjs';
import { FormUtils } from '@utils/form-utils';
import { CommentService } from '@comments/services/comment.service';
import { SnackbarErrorComponent } from '@shared/components/snackbar-error/snackbar-error.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { AvatarFallbackPipe } from '@shared/pipes/avatar-fallback.pipe';
import type { EpisodeComment } from '@comments/interfaces/episode-comment.interface';
import type { CreateCommentDto } from '@comments/interfaces/create-episode-comment-dto.interface';
import type { UpdateCommentDto } from '@comments/interfaces/update-episode-comment-dto.interface copy';
import type { User } from '@auth/interfaces/user.interface';

@Component({
  selector: 'comment-form',
  imports: [
    ReactiveFormsModule,
    SnackbarErrorComponent,
    LoaderComponent,
    AvatarFallbackPipe,
  ],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.css',
})
export class CommentFormComponent {
  fb = inject(FormBuilder);
  commentService = inject(CommentService);

  $createComment = signal<CreateCommentDto | null>(null);
  $updateComment = signal<UpdateCommentDto | null>(null);

  $user = input.required<User>();
  $postId = input.required<string>();
  $commentToUpdate = input<UpdateCommentDto>();

  $commentCreated = output<EpisodeComment>();
  $commentUpdated = output<EpisodeComment>();

  $focused = signal(false);

  $editMode = input(false, {
    transform: booleanAttribute,
    alias: 'editMode',
  });
  $editModeCanceled = output();

  formUtils = FormUtils;

  ngOnInit() {
    console.log(this.$editMode());
    this.setFormValue();
  }

  setFormValue() {
    this.commentForm.reset({
      content: this.$commentToUpdate()?.content || '',
    });
  }

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

    if (this.$commentToUpdate()) {
      const updatedComment: UpdateCommentDto =
        this.buildEditCommentDto(content);
      this.$updateComment.set(updatedComment!);
    } else {
      const newComment: CreateCommentDto = this.buildCreateCommentDto(content);
      this.$createComment.set(newComment!);
    }

    this.commentForm.reset();
  }

  onBlur() {
    const content = this.commentForm.get('content')?.value;
    if (!content) {
      this.$focused.set(false);
    }
  }

  onCancel() {
    if (this.$editMode()) this.$editModeCanceled.emit();
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

  buildEditCommentDto(content: string): UpdateCommentDto {
    const editedComment: UpdateCommentDto = {
      ...this.$commentToUpdate()!,
      id: this.$commentToUpdate()!.id,
      content,
    };
    return editedComment;
  }

  createCommentResource = rxResource({
    request: () => {
      return { comment: this.$createComment() };
    },
    loader: ({ request }) => {
      if (!request.comment) return of(null);

      return this.commentService
        .createComment(this.$postId(), request.comment)
        .pipe(tap((comment) => this.$commentCreated.emit(comment)));
    },
  });

  updateCommentResource = rxResource({
    request: () => {
      return { comment: this.$updateComment() };
    },
    loader: ({ request }) => {
      if (!request.comment) return of(null);

      return this.commentService
        .editComment(this.$postId(), request.comment)
        .pipe(tap((comment) => this.$commentUpdated.emit(comment)));
    },
  });
}
