import { 
    Component, Input, OnInit, OnDestroy 
} from "@angular/core";
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.less']
})
export class PostListComponent implements OnInit, OnDestroy {
    // posts = [
    //     {title: 'First Post', content: 'This is the first post\'s content'},
    //     {title: 'Second Post', content: 'This is the second post\'s content'},
    //     {title: 'Third Post', content: 'This is the second post\'s content'}
    // ]
    @Input('receivedPosts') posts: Post[] = [];
    private postsSub: Subscription;
    isLoading = false;
    constructor(private postsService: PostService) {}

    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts();
        this.postsSub = this.postsService.getPostUpdateListener()
            .subscribe(posts=>{
                this.isLoading = false;
                 this.posts = posts;
            });
    }
    onDelete(id: string) {
        this.postsService.deletePost(id);
    }
    ngOnDestroy() {
        this.postsSub.unsubscribe();
    }
}