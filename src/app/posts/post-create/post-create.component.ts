import { 
  Component,
  EventEmitter,
  OnInit
} from '@angular/core';

import { 
  NgForm 
} from '@angular/forms';
import { 
  Post 
} from '../post.model';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.less']
})
export class PostCreateComponent implements OnInit{
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId: string;
  public post: Post;
  isLoading: boolean = false;
  constructor(private postService: PostService,
      public route: ActivatedRoute){}
  onAddPost(form: NgForm) {
    if(form.invalid) {
      return;
    }
    console.log('Hello')
    this.isLoading = true;
    if(this.mode === 'create') {
      this.postService.addPost(form.value.title, form.value.content);
    } else {
      this.postService.updatePost(this.postId,form.value.title, form.value.content);
    }
   
   form.resetForm();
  }
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('postId')) {

        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content}
        });
      }else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
}