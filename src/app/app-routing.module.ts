import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/posts-list/post-list.component';

const appRoutes: Routes = [
  {
    path: '', 
    component: PostListComponent
  },
  {
    path: 'create', 
    component: PostCreateComponent
  },
  {
    path: 'edit/:postId', component: PostCreateComponent
  }
]
@NgModule({
  imports:[
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}