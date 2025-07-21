import { TestBed } from '@angular/core/testing';
import { Component, output } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CommentFormComponent } from './comment-form.component';
import { CommentService } from '@comments/services/comment.service';
import { of } from 'rxjs';
import { User } from '@auth/interfaces/user.interface';

import { fakeAsync, tick } from '@angular/core/testing';
import { EpisodeComment } from '@comments/interfaces/comment/comment.interface';

const mockCommentResponse: EpisodeComment = {
  id: 'c1',
  content: 'Hola',
  postId: 'p1',
  createdAt: new Date().toISOString(),
  author: {
    userId: 'u1',
    name: 'Test User',
    avatarUrl: 'https://example.com/avatar.png',
  },
};

const mockCommentService = {
  createComment: jasmine
    .createSpy('createComment')
    .and.returnValue(of(mockCommentResponse)),
  editComment: jasmine
    .createSpy('editComment')
    .and.returnValue(of(mockCommentResponse)),
};

describe('CommentFormComponent', () => {
  @Component({
    template: `
      <comment-form
        [$user]="mockUser"
        [$postId]="mockPostId"
        [editMode]="mockEditMode"
        [$commentToUpdate]="mockCommentToUpdate"
        ($commentCreated)="onCommentCreated()"
        ($commentUpdated)="onCommentUpdated()"
      ></comment-form>
    `,
    standalone: true,
    imports: [CommentFormComponent],
  })
  class CommentFormWrapperComponent {
    mockUser: User = {
      id: 'u1',
      name: 'Test User',
      mail: 'test@example.com',
      role: 'user',
      avatarUrl: 'https://example.com/avatar.png',
    };
    mockPostId: string = 'p1';
    mockEditMode: boolean = false;
    mockCommentToUpdate = undefined;

    $commentCreated = output();
    $commentUpdated = output();

    onCommentCreated() {
      this.$commentCreated.emit();
    }
    onCommentUpdated() {
      this.$commentUpdated.emit();
    }
  }

  let fixture: any;
  let wrapper: any;
  let component: CommentFormComponent;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [CommentFormWrapperComponent],
      providers: [{ provide: CommentService, useValue: mockCommentService }],
    }).createComponent(CommentFormWrapperComponent);

    wrapper = fixture.componentInstance;
    fixture.detectChanges();
    component = fixture.debugElement.query(
      By.directive(CommentFormComponent)
    ).componentInstance;
  });

  it('should initialize form with empty content by default', () => {
    expect(component.commentForm.value.content).toBe('');
  });

  it('should mark form as invalid if content is empty or whitespace', () => {
    component.commentForm.setValue({ content: '   ' });
    expect(component.commentForm.invalid).toBeTrue();
  });

  it('should build createComment DTO when not in edit mode and emit signal', () => {
    wrapper.mockEditMode = false;
    fixture.detectChanges();

    component.commentForm.setValue({ content: 'Comentario nuevo' });
    component.onSubmit();

    expect(component.$createComment()).toEqual({
      content: 'Comentario nuevo',
      postId: wrapper.mockPostId,
    });
  });

  it('should build updateComment DTO when in edit mode and emit signal', () => {
    wrapper.mockEditMode = true;
    wrapper.mockCommentToUpdate = { id: 'c1', content: 'previo' };
    fixture.detectChanges();

    component.commentForm.setValue({ content: 'Editado' });

    component.onSubmit();

    expect(component.$updateComment()).toEqual({
      id: 'c1',
      content: 'Editado',
    });
  });

  it('should reset the form and focus on cancel', () => {
    wrapper.mockEditMode = true;
    fixture.detectChanges();

    spyOn(component.$editCanceled, 'emit');

    component.commentForm.setValue({ content: 'algo' });
    component.$focused.set(true);

    component.onCancel();

    expect(component.commentForm.value.content).toBe(null);
    expect(component.$focused()).toBeFalse();
    expect(component.$editCanceled.emit).toHaveBeenCalled();
  });

  it('should focus the input when in edit mode', () => {
    wrapper.mockEditMode = true;
    fixture.detectChanges();

    const focusSpy = jasmine.createSpy();
    component.contentInput = {
      nativeElement: { focus: focusSpy },
    } as any;

    component.setFocus();

    expect(focusSpy).toHaveBeenCalled();
  });

  it('should return early in onSubmit if content is empty', () => {
    const setCreateSpy = spyOn(component.$createComment, 'set');
    const setUpdateSpy = spyOn(component.$updateComment, 'set');

    component.commentForm.setValue({ content: '    ' }); // solo espacios
    component.onSubmit();

    expect(setCreateSpy).not.toHaveBeenCalled();
    expect(setUpdateSpy).not.toHaveBeenCalled();
  });

  it('should not call createComment service if $createComment is null', fakeAsync(() => {
    mockCommentService.createComment.calls.reset();

    // Este set activa el recurso porque el request depende de este signal
    component.$createComment.set(null);

    tick();

    expect(mockCommentService.createComment).not.toHaveBeenCalled();
  }));

  it('should call createComment service and emit event on successful creation', fakeAsync(() => {
    const emitSpy = spyOn(component.$commentCreated, 'emit');
    const resetSpy = spyOn(component.commentForm, 'reset');
    const focusSpy = spyOn(component.$focused, 'set');

    component.commentForm.setValue({ content: 'Un nuevo comentario' });
    component.$createComment.set({
      content: 'Un nuevo comentario',
      postId: 'p1',
    });

    tick(300); // esperar debounce si lo hay
    fixture.detectChanges();

    expect(mockCommentService.createComment).toHaveBeenCalledWith(
      'p1',
      'Un nuevo comentario'
    );
    expect(emitSpy).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalledWith(false);
  }));

  it('should not call editComment service if $updateComment is null', fakeAsync(() => {
    mockCommentService.editComment.calls.reset();

    // Este set activa el recurso porque el request depende de este signal
    component.$updateComment.set(null);

    tick();

    expect(mockCommentService.editComment).not.toHaveBeenCalled();
  }));

  it('should call editComment service and emit event on successful update', fakeAsync(() => {
    const emitSpy = spyOn(component.$commentUpdated, 'emit');
    const resetSpy = spyOn(component.commentForm, 'reset');
    const focusSpy = spyOn(component.$focused, 'set');

    wrapper.mockEditMode = true;
    wrapper.mockCommentToUpdate = { id: 'c1', content: 'Comentario original' };
    fixture.detectChanges();

    // Setea el formulario con el contenido editado
    component.commentForm.setValue({ content: 'Comentario editado' });

    // Ejecuta el método onSubmit que dispara la señal
    component.onSubmit();

    // Simula el paso del tiempo para que rxResource lance la llamada HTTP
    tick();

    fixture.detectChanges();
    const lastArgs = mockCommentService.editComment.calls.mostRecent().args;

    expect(mockCommentService.editComment).toHaveBeenCalledWith(
      'c1',
      'Comentario editado'
    );
    expect(emitSpy).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalledWith(false);
  }));
});
