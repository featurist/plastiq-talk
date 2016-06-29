/** @jsx plastiq.html */
var plastiq = require('plastiq')
var router = require('plastiq-router');
var Reader = require('./reader');

var routes = {
  home: router.route('/'),
  article: router.route('/:id')
};

class Menu {
  constructor(reader) {
    this.reader = reader
  }

  render() {
    return <ul>
      {
        this.reader.articles.map(article => {
          return <li class={{selected: article == this.reader.currentArticle}}>
            {routes.article({id: article.id}).link(article.title)}
          </li>
        })
      }
    </ul>
  }
}

class Article {
  constructor(reader) {
    this.reader = reader
  }

  render() {
    var article = this.reader.currentArticle;

    if (article) {
      return <article>
        <h1>{article.title}</h1>
        {plastiq.html.rawHtml('div.body', article.body)}
      </article>
    }
  }
}

class App {
  constructor() {
    router.start();

    this.reader = new Reader()

    this.menu = new Menu(this.reader)
    this.article = new Article(this.reader)

    setInterval(() => {
      this.time = new Date();
      this.refresh();
    }, 1000);
  }

  render() {
    this.refresh = plastiq.html.refresh;

    return <div>
      <h1>{routes.home().link('Blog')}</h1>
      {this.time}

      {
        routes.home({
          onarrival: () => {
            return this.reader.load()
          }
        }, () => <div>
          {this.menu.render()}
        </div>)
      }
      {
        routes.article({
          onarrival: params => {
            return this.reader.loadArticle(params.id)
          }
        }, () => <div>
          {this.menu.render()}
          {this.article.render()}
        </div>)
      }
    </div>
  }
}

plastiq.append(document.body, new App())
