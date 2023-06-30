import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { map, catchError } from "rxjs/operators";
import { Subject, throwError } from "rxjs";


@Injectable({providedIn: 'root'})
export class PostService {

  error = new Subject();

    constructor(private http: HttpClient){}

    createAndStorePost(title: string, content: string){
        const postData: Post = {title: title, content: content }
        this.http.post<{name: string}>('https://ng-http-request-6ea93-default-rtdb.europe-west1.firebasedatabase.app/posts.json', postData).subscribe(responseData =>{
          console.log(responseData);
        }, error => { 
          this.error.next(error.message)
        });
    }

    fetchPosts(){
        return this.http.get<{ [key: string]: Post }>('https://ng-http-request-6ea93-default-rtdb.europe-west1.firebasedatabase.app/posts.json')
        .pipe(
          map( responseData => {
            const postsArray: Post[] = [];
            for (const key in responseData){
              if (responseData.hasOwnProperty(key)){
                postsArray.push({...responseData[key], id:key});
              }
            }
            return postsArray;
          }),
          catchError(errResp => {
            // Send to analytics server
            return throwError(errResp)
          })
        )
    }

    clearPosts(){
        return this.http.delete<{name: string}>('https://ng-http-request-6ea93-default-rtdb.europe-west1.firebasedatabase.app/posts.json')
    }
}