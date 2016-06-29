var http = require('httpism');
var find = require('lowscore/find');

class Reader {
  constructor() {
    this.articles = [];
    this.currentArticle = undefined;
  }

  load() {
    this.currentArticle = undefined
    return this._load = this._load || http.get('/articles.json').then(response => {
      this.articles = response.body
    })
  }

  loadArticle(id) {
    return this.load().then(() => {
      var article = find(this.articles, a => a.id == id)

      this.currentArticle = article;

      if (!this.currentArticle.body) {
        return http.get(`/articles/${id}.html`).then(response => {
          this.currentArticle.body = response.body
        })
      }
    })
  }
}

module.exports = Reader
