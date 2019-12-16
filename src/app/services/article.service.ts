import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

	private headers;
	private username;

	authenticate() {
		return this.http.post('http://localhost:3000/auth/login', {email: "test@example.com", password: "test123"})
	}
	
	private url = "http://localhost:3000/articles/";

  private options;

  constructor(private http: HttpClient) {

  }

  setOptions(authKey, username) {
  	 this.headers= new HttpHeaders({"Authorization": authKey});
   	 this.options = { headers: this.headers};
   	 this.username = username
  }

  getArticles() {
	  return this.http.get(this.url, this.options)
  }

  saveArticle(formObj) { 
  	formObj['username'] = this.username
  	if (formObj.id) {
			return this.http.patch(this.url + formObj.id.toString(), formObj, this.options);
		} else {
			return this.http.post(this.url, formObj, this.options);
		}
  }

  deleteArticle(id) {
  	return this.http.delete(this.url + id, this.options);
  }



}
