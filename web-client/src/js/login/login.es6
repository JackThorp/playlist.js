import Ractive from 'ractive'
import html from './login.ract'

class Login {

  constructor(config) {

  }

  render() {

    this.ractive = new Ractive({
      el: '#view',
      template: html
    });

  }

  isProtected() {
    return false;
  }

  unrender() {
    return this.ractive.teardown();
  }

}

export default Login
