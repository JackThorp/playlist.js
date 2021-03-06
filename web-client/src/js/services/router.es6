import crossroads from 'crossroads';
import hasher from 'hasher';
import _ from 'lodash';

class Router {

  constructor(auth, events) {
    this.auth = auth;
    this.events = events;
  }

  initialise(path) {
    // looks like hasher watches hash and emits signals
    // Here we declare how to handle initial hash and any
    // further changes.
    hasher.initialized.add(this.parseHash);
    hasher.changed.add(this.parseHash);
    hasher.init();

    // Navigate to app entry point(path) if there is no #fragment
    if(!hasher.getHash()) {
      hasher.setHash(path)
    }
    // bypassed callbacks are run everytime a route cuold not be found to match the request.
    // Writing like this capture this in the closure?
    crossroads.bypassed.add(() => this.bypassedHandler());
  }

  addRoute(path, view) {
    // addRoute method to register a handler to a path. 
    // Here, _.bind sets the function invocation context (this) of view.render to view
    
    view.render_h = () => {
      view.render(hasher.getHash());
    }
    
    let route = crossroads.addRoute(path, _.bind(view.render_h, view));
    
    // Attach a handler for the switch event
    route.matched.add(() => this.matchedHandler(path, view));
    route.switched.add(() => this.switchedHandler(view));
  }

  bypassedHandler(){
    this.events.routing.notFound.dispatch();
  }

  switchedHandler(view) {
    view.unrender();
  }

  matchedHandler(path, view) {
    // Can't transition to protected route if not logged in.
    if(view.isProtected() && !this.auth.loggedInUser()) {
      view.unrender().then(() => this.events.routing.accessDenied.dispatch(path));
    }
    // Don't allow transition to login page if user is logged in.
    if(path == 'login' && this.auth.loggedInUser()) {
      this.events.routing.transitionTo.dispatch('home', view);
    }
  }

  parseHash(newHash, oldHash) {
    // Whenever the hash changes crossroads will perform routing
    // based on configured routes. Rendering and tearing down pages.
    crossroads.parse(newHash)
  }

  currentHash() {
    return hasher.getHash();
  }

  transitionTo(path){
    hasher.setHash(path);
  }
}

export default Router
