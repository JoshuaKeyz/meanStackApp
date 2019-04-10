import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { map, delay } from 'rxjs/operators'
import { Post } from './post.model';
import { stringify } from '@angular/core/src/util';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient, private router: Router) {}
  getPosts() {
    this.httpClient.get<{message: string, posts: any[]}>(
      'http://localhost:3000/api/posts'
      ).pipe(map((postData)=>{
        return postData.posts.map(post => {
          return {
            title: post.title, 
            content: post.content, 
            id: post._id
          }
        })
      }))
      .subscribe(posts=>{
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title, content
    };
    this.httpClient.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .pipe(delay(3000))
      .subscribe(data=> {
        const id = data.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
    this.router.navigate(['/'])
  }
  deletePost(postId: string) {
    this.httpClient.delete('http://localhost:3000/api/posts/'+ postId).subscribe(()=>{
      const updatedPosts = this.posts.filter(post=> post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }
  getPost(id: string) {
    return this.httpClient.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id).pipe(
      delay(3000)
    );
  }
  updatePost(id: string, title: string, content: string) {
    const post: Post = {
      id, title, content
    };
    this.httpClient.put('http://localhost:3000/api/posts/'+ id, post)
      .pipe(delay(3000))
      .subscribe(resp=> {
        const updatedPosts = [...this.posts];
        const oldPostINdex = updatedPosts.findIndex(p => p.id === post.id);
        // updatedPosts[oldPostINdex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      }, err=> {
        console.log(err);
      });
    
    this.router.navigate(['/'])
  }
}