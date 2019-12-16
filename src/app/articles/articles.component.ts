import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../services/article.service';

import { Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http'

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
	articles: any;
	isRead = true;
  constructor(private service: ArticleService) {
  	
  }

  form = new FormGroup({
  	id: new FormControl(),
		title: new FormControl('', Validators.required),
		description: new FormControl('', Validators.required)
	});

  get title(){
		return this.form.get('title').value;
	}

	get id() {
		return this.form.get('id').value;
	}

	get description() {
		return this.form.get('description').value;
	}

  getArticles(loadFormValues?) {
  	this.service.getArticles()
  		.subscribe(response => {
				this.articles = response;
				this.form.reset(); 
				this.isRead = true;
				if (loadFormValues) {
					this.form.setValue(loadFormValues);
				}
			}, 
			error => {
				alert('An unexpected error occured');
			});
  }

  ngOnInit() {
  	this.service.authenticate()
  			.subscribe(response => {
					this.service.setOptions(response['token'], response['username']);
				  this.getArticles();
			  });
  	
  }

  saveArticle() {
  	this.service.saveArticle(this.form.value)
  		.subscribe(response => {
				this.getArticles({'id': response['id'], 'title': response['title'], 'description': response['description']});
			}, 
			(error: Response) => {
					if (error.status === 422) {
						alert('Error: ' + error['error'].errors.join(', '));
					} else {
						alert('An unexpected error occured');
					}
					
			});
  }

	deleteArticle(id){
		this.service.deleteArticle(id)
				.subscribe(response => {
					this.getArticles();
					this.form.reset(); 
				},
				(error: Response) => {
					if (error.status === 422) {
						alert(error['errors']);
					}
					alert('An unexpected error occured');
				})
	}

	newRecord() {
		this.form.reset();
		this.isRead = false;
	}

	getArticleData(article) {
		this.form.get('id').setValue(article.id);
		this.form.get('title').setValue(article.title);
		this.form.get('description').setValue(article.description);
	}
}
