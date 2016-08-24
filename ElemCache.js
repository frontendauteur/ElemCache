
window.ElemCache = function () {
  var Self = this
  var settings = {}
  var objsCache = {}
  var $container

  // performs the jQuery selection and then caches and returns it
  function cacheObj (key) {
    var elem = settings.elems[key]
    var $parent

    // if the selector is an ID, don't bother with parent
    if (elem.selector.indexOf('#') === 0) {
      objsCache[elem.key] = window.jQuery(elem.selector)

      return objsCache[elem.key]
    }

    // set the parent to search in
    if (typeof (elem.parentKey) === 'string' && typeof (objsCache[elem.parentKey]) !== 'undefined') {
      $parent = objsCache[elem.parentKey]
    } else {
      $parent = $container
    }

    objsCache[elem.key] = $parent.find(elem.selector)

    return objsCache[elem.key]
  }

  // checks for a cached version of the jQuery object defined by `key` and returns it if found
  function getObj (key) {
    // check for a cached version of the requested object
    if (typeof (objsCache[key]) !== 'undefined') {
      return objsCache[key]
    }

    return cacheObj(key)
  }

  // closure function for creating a getter/setter for each elem
  function setupObj (key) {
    // TODO - this was here to keep track of an elem's key, but it does not appear to be necessary
    // settings.elems[key].key = key

    Object.defineProperty(Self, key, {
      get: function () {
        return getObj(key)
      },
      set: function (newElem) {
        settings.elems[key] = newElem

        delete objsCache[key]
      }
    })
  }

  // public
  Self.init = function (options) {
    var defaults = {
      elems: {},
      container: 'body'
    }
    var key

    // TODO - replace with non jQuery
    window.jQuery.extend(settings, defaults, options)

    // a global container as a default parent for searching
    $container = window.jQuery(settings.container)

    // loops over the elems list and creates a getter for each
    for (key in settings.elems) {
      setupObj(key)
    }
  }

  return Self
}
