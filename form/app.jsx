/** @jsx plastiq.html */
var plastiq = require('plastiq')
var sortBy = require('lowscore/sortBy')
var countries = sortBy(require('country-data').countries.all, 'name');

class Person {
  constructor() {
    this.address = {};
  }
}

function datepicker(binding, vdom) {
  binding = plastiq.html.binding(binding);

  vdom.binding = binding;

  return plastiq.html.component(
    {
      onadd(input) {
        this.datepicker = window.$(input).datepicker().change(function () {
          binding.set(window.$(this).val());
        });

        this.onupdate();
      },

      onupdate() {
        this.datepicker.val(binding.get());
      }
    },
    vdom
  )
}

class App {
  constructor() {
    this.person = new Person();
  }

  field(name, binding) {
    return <div class="field">
      <input class="field-input" placeholder={name} type="text" binding={binding} />
    </div>
  }

  render() {
    return <div class="form">
      <h2>Your Details</h2>
      <div class="fields">
        {this.field('First Name', [this.person, 'firstName'])}
        {this.field('Last Name', [this.person, 'lastName'])}
      </div>
      <div class="field">
        <input class="field-input" placeholder="Phone Number" type="text" binding={[this.person, 'phoneNumber']} />
      </div>
      {this.field('Email Address', [this.person, 'emailAddress'])}
      <div class="field">
        {datepicker([this.person, 'dateOfBirth'], <input class="field-input" placeholder="Date of Birth" type="text" />)}
      </div>
      {this.field('Date of Birth', [this.person, 'dateOfBirth'])}
      <h2>Address</h2>
      {this.field('Street Address 1', [this.person.address, 'line1'])}
      {this.field('Street Address 2', [this.person.address, 'line2'])}
      {this.field('City', [this.person.address, 'city'])}
      <div class="field">
        <select class="field-input" binding={[this.person.address, 'country']}>
          {
            countries.map(country => {
              return <option value={country.alpha2}>{country.name}</option>
            })
          }
        </select>
      </div>
      {this.field('Country', [this.person.address, 'country'])}
      <pre><code>
        {JSON.stringify(this, null, 2)}
      </code></pre>
    </div>
  }
}

plastiq.append(document.body, new App())
