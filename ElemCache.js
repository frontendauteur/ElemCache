var ElemCache = function() {
  var Self = this
  var Settings = {}
  var ObjsCache = {}
  var $container

  // Objs will be an object of functions, each named with an elem key
  Self.Objs = {}

  // checks for a cached version of the jQuery object defined by `selector` and returns it if found
  // performs the jQuery selection if the object was not already cached, and then caches it
  function getObj (Elem) {
    var $parent

    // check for a cached version of the requested object
    if (typeof(ObjsCache[Elem.key]) !== 'undefined') {
      return ObjsCache[Elem.key]
    }

    // if the selector is an ID, don't bother with parent
    if (Elem.selector.indexOf('#') === 0) {
      return ObjsCache[Elem.key] = $(Elem.selector)
    }

    // set the parent to search in
    if (typeof(Elem.parentKey) === 'string' && typeof(ObjsCache[Elem.parentKey]) !== 'undefined') {
      $parent = ObjsCache[Elem.parentKey]
    } else {
      $parent = $container
    }

    // we didn't find a cached object earlier, so set the cache and return the object
    return ObjsCache[Elem.key] = $parent.find(Elem.selector)
  }

  Self.init = function (Options) {
    var Defaults = {
        Elems: [],
        container: 'body'
    }

    $.extend(Settings, Defaults, Options)

    // a global container as a default parent for searching
    $container = $(Settings.container)

    // loops over the elems list and creates a wrapper function around `getObj()` for each
    $.each(Settings.Elems, function(i, Elem) {
      Self.Objs[Elem.key] = function() {
        return getObj(Elem)
      }
    })
  }

  return Self
}
