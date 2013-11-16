/**!
 * @author Branko Vukelic <banko@brankovukelic.com>
 * @license MIT
 */

define = ((root) ->
  if typeof root.define is 'function' and root.define.amd
    root.define
  else if typeof module is 'object' and module.exports
    (factory) ->
      module.exports = factory!
  else
    (factory) ->
      root.testjs = factory!
) this

define ->

  output = (out, msgs) ->
    out.apply console, msgs
    void

  debug = ->
    output (console.debug or console.log), &
    void

  error = ->
    output (console.error or console.log), &
    void

  log = ->
    output console.log, &
    void

  info = ->
    output (console.info or console.log), &
    void

  class AssertionError extends Error
    (@message, @data) ->
      @name = 'AssertionError'

  class TestError extends Error
    (@message) ->
      @name = 'TestError'

  assert: assert = (expr, message, data) ->
    throw new AssertionError message, data if not expr

  assert.assert = assert

  assert.true = (expr, message = "#{expr} should be true") ->
    @assert !!expr, message

  assert.false = (expr, message = "#{expr} should be false") ->
    @assert !expr, message

  assert.equal = (v1, v2, message = "#{v1} should equal #{v2}") ->
    @assert v1 is v2, message

  assert.not-equal = (v1, v2, message = "#{v1} should not equal #{v2}") ->
    @assert v1 isnt v2, message

  assert.similar = (v1, v2, message = "#{v1} should be similar to #{v2}") ->
    @assert v1 ~= v2, message

  assert.array = (a1, a2, message = "#{a1} should be same as #{a2}") ->
    return @assert false, message if (not a1?) or (not a2?)
    lengths = a1.length is a2.length
    members = a1.every (i, idx) -> a2[idx] is i
    @assert (lengths and members), message,
      got: a1
      expected: a2

  assert.deep-equal = (o1, o2, message) ->
    try
      o1s = JSON.stringify o1
      o2s = JSON.stringify o2
    catch
      o1s = o1
      o2s = o2
    message ?= "#{o1s} should deep-equal #{o2s}"

    if o1 === o2
      ## This surely means o1 and o2 are identical
      return

    compare = (o1, o2) ~>
      if not o1? or not o2?
        @assert false, message, [o1s, o2s]

      if typeof! o1 isnt typeof! o2
        @assert false, message, [o1s, o2s]

      if o1 === o2
        return true

      if Object.keys o1 .length isnt Object.keys o2 .length
        @assert false, message, [o1s, o2s]

      for own key of o1
        if not o2[key]?
          @asser false, message, [o1s, o2s]
        compare o1[key], o2[key]

    compare o1, o2

  assert.defined = (v, message = "#{v} should be defined") ->
    @assert typeof v isnt 'undefined', message

  assert.undef = (v, message = "#{v} should be undefined") ->
    @assert typeof v is 'undefined', message

  assert.ctor = (obj, ctor, message = "#{obj} should be instance of #{ctor}") ->
    @assert obj instanceof ctor, message

  assert.element = (obj, message = "#{obj} should be a DOM node") ->
    @assert obj instanceof window.Element, message

  assert.elements = (obj, message = "#{obj} should be a node list") ->
    is-node-list = obj instanceof window.Node-list
    is-html-collection = obj instanceof window.HTML-elements-collection
    @assert (is-node-list or is-html-collection), message

  assert.element-type = (obj, type, message = "#{obj} should be a node of type #{type}") ->
    @assert obj.tag-name.to-lower-case! is type, message

  assert.attribute-value = (obj, name, value, message = "#{obj} should have #{name} attribute with value of #{value}") ->
    attr = obj.get-attribute name
    @equal attr, value, message

  assert.type = (v, type, message = "#{v} should be #{type}") ->
    @assert typeof! v is type, message

  assert.method = (obj, method, message = "#{obj} should have method #{method}") ->
    method = obj[method]
    @assert (method? and typeof! method is 'Function'), message

  assert.exception = (fn, exception, msg, string, message) ->
    try
      fn!
      @assert false, (message or "#{fn} should throw an exception")
    catch err
      if exception?
        @assert err instanceof exception, (message or "#{fn} shoud throw #{exception}"), err
      if msg?
        @equal err.message, msg, (message or "#{fn} should throw #{msg}"), err
      if string?
        @equal '' + err, string, (message or "#{fn} should throw #{string}"), err

  assert.format = (rxp, s, message = "#{s} should match #{rxp}") ->
    @assert m = (rxp.test s), message, m

  assert.match = (rxp, s, matches, message = "#{s} match against #{rxp} should return #{matches}") ->
    @array (s.match rxp), matches, message

  assert.capturing = (rxp, s, matches, message = "#{s} match against #{rxp} should capture #{matches}") ->
    @array (s.match rxp .slice 1), matches, message

  assert.except = assert.throw = assert.throwing = assert.exception
  assert.regexp = assert.format
  assert.matches = assert.match
  assert.capture = assert.captured = assert.capturing

  assert.not = (expr, message, data) ->
    if not /should not/.test message
      message = message.replace 'should', 'should not'
    throw new AssertionError message, data if expr

  assert.not <<< assert
  assert.not.assert = assert.not

  dom = (id) ->
    document.get-element-by-id id

  dom.by-class = (cls) ->
    document.get-elements-by-class-name cls

  dom.by-query = (query) ->
    document.query-selector query

  dom.all-by-query = (query) ->
    document.query-selector-all query

  Test: class Test
    (@subject, @desc, @fn, @set) ->
      @it = @subject ## alias

    timeout: 10_000ms
    later: 10ms
    timer: null
    log-pass: true

    start-timer: ->
      @timer = set-timeout ~>
        @fail 'timed out'
      , @timeout

    stop-timer: ->
      clear-timeout @timer if @timer?

    run-test: (fn = @fn) ->
      @stop-timer!
      try
        @start-timer!
        start = Date.now!
        fn.call @
        end = Date.now!
        @pass end - start
        @stop-timer!
        void
      catch err
        @stop-timer!
        @fail err
        void

    execute: ->
      if @fn.length is 0
        ## Syncrhonous test
        @run-test!
      else
        ## Asynchronous test
        @start-timer!
        @fn (fn) -> @run-test fn

    pass: (duration) ->
      return if not @log-pass
      info "\u2713 #{@desc} (#{duration}ms)"
      @set.pass @
      void

    fail: (err) ->
      error "FAIL: #{@desc}: #{err.message or err}"
      debug 'error:', err
      debug 'test:', @fn
      debug 'subject:', @subject if @subject?
      @set.fail @
      void

    later: (fn) ->
      set-timeout fn, @later
      void

    noop: ->
      void

    is: assert
    assert: assert
    should: assert

    get: dom
    find: dom
    fetch: dom

  TestSet: class TestSet
    (@name, @suite, @delay = 0, @fixture = void) ->
      @suite?.add @
      @tests = []
      @before-test = []
      @after-test = []
      @before-set = []
      @after-set = []
      @count = 0
      @ran = 0
      @success = 0
      @error = 0
      @start = null
      @end = null

    before-all: (fn) ->
      @before-set.push fn

    before-each: (fn) ->
      @before-test.push fn

    after-all: (fn) ->
      @after-set.push fn

    after-each: (fn) ->
      @after-test.push fn

    test: (subject, desc, fn) ->
      if &.length is 2
        fn = desc
        desc = subject
        subject = null
      @tests.push new Test subject, desc, fn, @
      @count += 1

    run: ->
      log "\n\u25FC #{@name} test set\n"
      @load-fixture (err) ~>
        throw new TestError 'error loading fixture' if err?
        set-timeout ~>
          for fn in @before-set then fn.call @
          @start = new Date!
          @next!
        , @delay

    fetch: (url, callback) ->
      new XML-http-request!
        ..onreadystatechange = ->
          if ..ready-state is 4
            document.body.innerHTML = ..response-text
            if ..status is 200
              callback!
            else
              callback 'failed'
        ..open 'GET', @fixture
        ..send!

    load-fixture: (callback) ->
      if not @fixture or not XML-http-request?
        callback!
      else
        log "\u25CF Loading fixtures for #{@name} set"
        @fetch @fixture, callback

    done: ->
      for fn in @after-test then fn.call @
      @end = new Date!
      info "\u25CF #{@count} in #{@name} with #{@success} passing and #{@error} failing (#{@end - @start}ms)"
      @suite?.next @success, @error

    next: ->
      if @ran is @count
        @done!
      else
        for fn in @before-test then fn.call @
        @tests[@ran].execute()
        for fn in @after-test then fn.call @

    pass: (test) ->
      @ran += 1
      @success += 1
      @next!

    fail: (test) ->
      @ran += 1
      @error += 1
      @next!

  TestSuite: class TestSuite
    ->
      @sets = []
      @count = 0
      @ran = 0
      @start = 0
      @end = 0
      @success = 0
      @error = 0

    add: (set) ->
      @sets.push set
      @count += 1

    run: ->
      log "\u25BA Starting all test sets"
      @start = new Date!
      @next!

    next: (success = 0, error = 0) ->
      @success += success
      @error += error
      if @ran is @count
        @done!
      else
        @sets[@ran].run()
        @ran += 1

    done: ->
      @end = new Date!
      log '============================================'
      info "Total run:    #{@end - @start}ms"
      info "Total sets:   #{@ran}"
      info "Passing:      #{@success}"
      info "Failing:      #{@error}" if @error
      log '============================================'
