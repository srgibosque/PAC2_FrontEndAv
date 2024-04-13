import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { AuthState } from 'src/app/Auth/reducers';
import { PostDTO } from 'src/app/Models/post.dto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent {
  posts!: PostDTO[];
  constructor(
    private postService: PostService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private store: Store<AppState>
  ) {
    this.loadPosts();
  }

  private loadPosts(): void {
    let errorResponse: any;
    // const userId = this.localStorageService.get('user_id');
    this.store.select('authApp').pipe(
      map((response: AuthState) => response.credentials.user_id),
      take(1)
    ).subscribe((userId) => {
      if (userId) {
        this.postService.getPostsByUserId(userId)
        .subscribe(
          (posts) => {
            this.posts = posts;
          },
          (error: any) => {
            errorResponse = error.error;
            this.sharedService.errorLog(errorResponse);
          }
        )
      }
    })
  }

  createPost(): void {
    this.router.navigateByUrl('/user/post/');
  }

  updatePost(postId: string): void {
    this.router.navigateByUrl('/user/post/' + postId);
  }

  deletePost(postId: string): void {
    let errorResponse: any;

    // show confirmation popup
    let result = confirm('Confirm delete post with id: ' + postId + ' .');
    if (result) {
      this.postService.deletePost(postId)
      .subscribe(
        (rowsAffected) => {
          if(rowsAffected.affected > 0){
            this.loadPosts();
          }
        },
        (error: any) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      )
    }
  }
}
