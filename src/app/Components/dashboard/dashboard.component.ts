import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { PostDTO } from 'src/app/Models/post.dto';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  posts!: PostDTO[];
  postsSubject = new Subject<PostDTO[]>();

  numLikes: number = 0;
  numDislikes: number = 0;

  constructor(
    private postService: PostService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    let errorResponse: any;
    this.postService.getPosts()
    .subscribe(
      (posts) => {
        this.posts = posts;
        this.postsSubject.next(this.posts);
      },
      (error: any) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    )

    this.postsSubject.subscribe((posts) => {
      posts.forEach((post) => {
        this.numLikes = this.numLikes + post.num_likes;
        this.numDislikes = this.numDislikes + post.num_dislikes;
      });
    })
    
  }

}
