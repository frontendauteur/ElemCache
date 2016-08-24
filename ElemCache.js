
window.ElemCache = function () {
  var Self = this
  var Settings = {}
  var ObjsCache = {}
  var $container

  // performs the jQuery selection and then caches and returns it
  function cacheObj (Elem) {
    var $parent

    // if the selector is an ID, don't bother with parent
    if (Elem.selector.indexOf('#') === 0) {
      ObjsCache[Elem.key] = window.jQuery(Elem.selector)

      return ObjsCache[Elem.key]
    }

    // set the parent to search in
    if (typeof (Elem.parentKey) === 'string' && typeof (ObjsCache[Elem.parentKey]) !== 'undefined') {
      $parent = ObjsCache[Elem.parentKey]
    } else {
      $parent = $container
    }

    ObjsCache[Elem.key] = $parent.find(Elem.selector)

    return ObjsCache[Elem.key]
  }

  // checks for a cached version of the jQuery object defined by `key` and returns it if found
  function getObj (Elem) {
    // check for a cached version of the requested object
    if (typeof (ObjsCache[Elem.key]) !== 'undefined') {
      return ObjsCache[Elem.key]
    }

    return cacheObj(Elem)
  }

  // closure function for creating a getter for each elem
  function setupObj (Elem) {
    Object.defineProperty(Self, Elem.key, {
      get: function () {
        return getObj(Elem)
      }
    })
  }

  // public
  Self.init = function (Options) {
    var Defaults = {
      Elems: [],
      container: 'body'
    }
    var i = 0
    var Elem

    // TODO - replace with non jQuery
    window.jQuery.extend(Settings, Defaults, Options)

    // a global container as a default parent for searching
    $container = window.jQuery(Settings.container)

    // loops over the elems list and creates a getter for each
    for (i; i < Settings.Elems.length; i++) {
      Elem = Settings.Elems[i]

      // because we need a closure
      setupObj(Elem)
    }
  }

  return Self
}
