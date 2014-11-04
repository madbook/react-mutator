
var Foo = React.createClass({
  render: function() {
    return ( <div className="foo">
      <header>
        <h1>This is a foo!</h1>
      </header>
      <Content>
        A foo has a header and some content.
      </Content>
    </div> );
  },
});

var Content = React.createClass({
  render: function() {
    return ( <div className="content" {...this.props} /> );
  },
});


/**
 * returns a React class with the given mutator functions applied
 * @param  {React class} ElementClass a class define with React.createClass
 * @param  {function[]} any number of functions to mutate the result of the 
 *                          ElementClass's render function
 * @return {React class}              
 */
function mutate(ElementClass /* ...mutators */) {
  var mutators = Array.prototype.slice.call(arguments, 1);
  return React.createClass({
    render: function() {
      var renderedElement = (
        <ElementClass {...this.props} />
      ).type.prototype.render.call(this);
      
      return mutators.reduce(function(element, mutator) {
          mutator.call(element);  
          return element;
        }, 
        renderedElement  
      );
    },
  });
}

function elementIsType(element, type) {
  if (!element.type) {
    return false;
  } else if (typeof element.type === 'string') {
    return element.type === type;
  } else if (element.type.displayName) {
    return element.type.displayName === type;
  } else {
    return false;
  }
}

function query(element, type) {
  var results = [];
  
  if (elementIsType(element, type)) {
    results.push(element);
  }

  if (element.props && element.props.children) {
    if (Array.isArray(element.props.children)) {
      results = element.props.children.reduce(function(results, child) {
        return results.concat(query(child, type));
      }, results);
    } else {
      results = results.concat(query(element.props.children, type));
    }
  }

  return results;
}

/**
 * add a footer to a react element
 */
var Bar = function() {
  this.props.children.push( <footer>
    The Bar mutator adds a footer in!
  </footer> );
};

/**
 * take each Content child, wrap its current children in a <del> tag, then
 * add a <div.new-content> element with some new content.
 */
var Baz = function() {
  query(this, 'Content').forEach(function(element) {
    element.props.children = [
      ( <del>{ element.props.children }</del> ),
      ( <div class="new-content">
        The Baz mutator replaces Content elements!
      </div> )
    ];
  });
};

var Bat = function() {
  query(this, 'del').forEach(function(element) {
    element.props.onClick = function() {
      alert('You clicked a <del> element!');
    }
  });
};

// replace the original <Foo> with a class mutated by Bar and Baz
Foo = mutate(Foo, Bar, Baz, Bat);


window.onReady(function() {
  var mountNode = document.getElementById('app');
  React.render(
    ( <Foo /> ),
    mountNode
  );
});
