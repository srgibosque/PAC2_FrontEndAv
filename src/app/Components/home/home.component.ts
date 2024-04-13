import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PostDTO } from 'src/app/Models/post.dto';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  posts!: PostDTO[];
  showButtons: boolean;

  constructor(
    private postService: PostService,
    private sharedService: SharedService,
    private store: Store<AppState>,
    private router: Router,
  ) {
    this.showButtons = false;
    this.loadPosts();
  }

  ngOnInit(): void {
    this.store.select('authApp').subscribe((authResponse) => {
      if(authResponse.credentials.access_token){
        this.showButtons = true;
      } else {
        this.showButtons = false;
      }
    })
  }
  private loadPosts(): void {
    let errorResponse: any;
    
    this.postService.getPosts()
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

  like(postId: string): void {
    let errorResponse: any;
    this.postService.likePost(postId)
    .subscribe(
      () => {
        this.loadPosts();
      },
      (error: any) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    )
  }

  dislike(postId: string): void {
    let errorResponse: any;
    this.postService.dislikePost(postId)
    .subscribe(
      () => {
        this.loadPosts();
      },
      (error: any) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    )
  }
}
