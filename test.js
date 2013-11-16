// Generated by LiveScript 1.2.0
/**!
 * @author Branko Vukelic <banko@brankovukelic.com>
 * @license MIT
 */
(function(){
  var define, toString$ = {}.toString;
  define = function(root){
    if (typeof root.define === 'function' && root.define.amd) {
      return root.define;
    } else if (typeof module === 'object' && module.exports) {
      return function(factory){
        return module.exports = factory();
      };
    } else {
      return function(factory){
        return root.testjs = factory();
      };
    }
  }(this);
  define(function(){
    var output, debug, error, log, info, AssertionError, TestError, assert, dom, Test, TestSet, TestSuite;
    output = function(out, msgs){
      out.apply(console, msgs);
    };
    debug = function(){
      output(console.debug || console.log, arguments);
    };
    error = function(){
      output(console.error || console.log, arguments);
    };
    log = function(){
      output(console.log, arguments);
    };
    info = function(){
      output(console.info || console.log, arguments);
    };
    AssertionError = (function(superclass){
      var prototype = extend$((import$(AssertionError, superclass).displayName = 'AssertionError', AssertionError), superclass).prototype, constructor = AssertionError;
      function AssertionError(message, data){
        this.message = message;
        this.data = data;
        this.name = 'AssertionError';
      }
      return AssertionError;
    }(Error));
    TestError = (function(superclass){
      var prototype = extend$((import$(TestError, superclass).displayName = 'TestError', TestError), superclass).prototype, constructor = TestError;
      function TestError(message){
        this.message = message;
        this.name = 'TestError';
      }
      return TestError;
    }(Error));
    ({
      assert: assert = function(expr, message, data){
        if (!expr) {
          throw new AssertionError(message, data);
        }
      }
    });
    assert.assert = assert;
    assert['true'] = function(expr, message){
      message == null && (message = expr + " should be true");
      return this.assert(!!expr, message);
    };
    assert['false'] = function(expr, message){
      message == null && (message = expr + " should be false");
      return this.assert(!expr, message);
    };
    assert.equal = function(v1, v2, message){
      message == null && (message = v1 + " should equal " + v2);
      return this.assert(v1 === v2, message);
    };
    assert.notEqual = function(v1, v2, message){
      message == null && (message = v1 + " should not equal " + v2);
      return this.assert(v1 !== v2, message);
    };
    assert.similar = function(v1, v2, message){
      message == null && (message = v1 + " should be similar to " + v2);
      return this.assert(v1 == v2, message);
    };
    assert.array = function(a1, a2, message){
      var lengths, members;
      message == null && (message = a1 + " should be same as " + a2);
      if (a1 == null || a2 == null) {
        return this.assert(false, message);
      }
      lengths = a1.length === a2.length;
      members = a1.every(function(i, idx){
        return a2[idx] === i;
      });
      return this.assert(lengths && members, message, {
        got: a1,
        expected: a2
      });
    };
    assert.deepEqual = function(o1, o2, message){
      var o1s, o2s, e, compare, this$ = this;
      try {
        o1s = JSON.stringify(o1);
        o2s = JSON.stringify(o2);
      } catch (e$) {
        e = e$;
        o1s = o1;
        o2s = o2;
      }
      message == null && (message = o1s + " should deep-equal " + o2s);
      if (deepEq$(o1, o2, '===')) {
        return;
      }
      compare = function(o1, o2){
        var key, own$ = {}.hasOwnProperty, results$ = [];
        if (o1 == null || o2 == null) {
          this$.assert(false, message, [o1s, o2s]);
        }
        if (toString$.call(o1).slice(8, -1) !== toString$.call(o2).slice(8, -1)) {
          this$.assert(false, message, [o1s, o2s]);
        }
        if (deepEq$(o1, o2, '===')) {
          return true;
        }
        if (Object.keys(o1).length !== Object.keys(o2).length) {
          this$.assert(false, message, [o1s, o2s]);
        }
        for (key in o1) if (own$.call(o1, key)) {
          if (o2[key] == null) {
            this$.asser(false, message, [o1s, o2s]);
          }
          results$.push(compare(o1[key], o2[key]));
        }
        return results$;
      };
      return compare(o1, o2);
    };
    assert.defined = function(v, message){
      message == null && (message = v + " should be defined");
      return this.assert(typeof v !== 'undefined', message);
    };
    assert.undef = function(v, message){
      message == null && (message = v + " should be undefined");
      return this.assert(typeof v === 'undefined', message);
    };
    assert.ctor = function(obj, ctor, message){
      message == null && (message = obj + " should be instance of " + ctor);
      return this.assert(obj instanceof ctor, message);
    };
    assert.element = function(obj, message){
      message == null && (message = obj + " should be a DOM node");
      return this.assert(obj instanceof window.Element, message);
    };
    assert.elements = function(obj, message){
      var isNodeList, isHtmlCollection;
      message == null && (message = obj + " should be a node list");
      isNodeList = obj instanceof window.NodeList;
      isHtmlCollection = obj instanceof window.HTMLElementsCollection;
      return this.assert(isNodeList || isHtmlCollection, message);
    };
    assert.elementType = function(obj, type, message){
      message == null && (message = obj + " should be a node of type " + type);
      return this.assert(obj.tagName.toLowerCase() === type, message);
    };
    assert.attributeValue = function(obj, name, value, message){
      var attr;
      message == null && (message = obj + " should have " + name + " attribute with value of " + value);
      attr = obj.getAttribute(name);
      return this.equal(attr, value, message);
    };
    assert.type = function(v, type, message){
      message == null && (message = v + " should be " + type);
      return this.assert(toString$.call(v).slice(8, -1) === type, message);
    };
    assert.method = function(obj, method, message){
      message == null && (message = obj + " should have method " + method);
      method = obj[method];
      return this.assert(method != null && toString$.call(method).slice(8, -1) === 'Function', message);
    };
    assert.exception = function(fn, exception, msg, string, message){
      var err;
      try {
        fn();
        return this.assert(false, message || fn + " should throw an exception");
      } catch (e$) {
        err = e$;
        if (exception != null) {
          this.assert(err instanceof exception, message || fn + " shoud throw " + exception, err);
        }
        if (msg != null) {
          this.equal(err.message, msg, message || fn + " should throw " + msg, err);
        }
        if (string != null) {
          return this.equal('' + err, string, message || fn + " should throw " + string, err);
        }
      }
    };
    assert.format = function(rxp, s, message){
      var m;
      message == null && (message = s + " should match " + rxp);
      return this.assert(m = rxp.test(s), message, m);
    };
    assert.match = function(rxp, s, matches, message){
      message == null && (message = s + " match against " + rxp + " should return " + matches);
      return this.array(s.match(rxp), matches, message);
    };
    assert.capturing = function(rxp, s, matches, message){
      message == null && (message = s + " match against " + rxp + " should capture " + matches);
      return this.array(s.match(rxp).slice(1), matches, message);
    };
    assert.except = assert['throw'] = assert.throwing = assert.exception;
    assert.regexp = assert.format;
    assert.matches = assert.match;
    assert.capture = assert.captured = assert.capturing;
    assert.not = function(expr, message, data){
      if (!/should not/.test(message)) {
        message = message.replace('should', 'should not');
      }
      if (expr) {
        throw new AssertionError(message, data);
      }
    };
    import$(assert.not, assert);
    assert.not.assert = assert.not;
    dom = function(id){
      return document.getElementById(id);
    };
    dom.byClass = function(cls){
      return document.getElementsByClassName(cls);
    };
    dom.byQuery = function(query){
      return document.querySelector(query);
    };
    dom.allByQuery = function(query){
      return document.querySelectorAll(query);
    };
    return {
      Test: Test = (function(){
        Test.displayName = 'Test';
        var prototype = Test.prototype, constructor = Test;
        function Test(subject, desc, fn, set){
          this.subject = subject;
          this.desc = desc;
          this.fn = fn;
          this.set = set;
          this.it = this.subject;
        }
        prototype.timeout = 10000;
        prototype.later = 10;
        prototype.timer = null;
        prototype.logPass = true;
        prototype.startTimer = function(){
          var this$ = this;
          return this.timer = setTimeout(function(){
            return this$.fail('timed out');
          }, this.timeout);
        };
        prototype.stopTimer = function(){
          if (this.timer != null) {
            return clearTimeout(this.timer);
          }
        };
        prototype.runTest = function(fn){
          var start, end, err;
          fn == null && (fn = this.fn);
          this.stopTimer();
          try {
            this.startTimer();
            start = Date.now();
            fn.call(this);
            end = Date.now();
            this.pass(end - start);
            this.stopTimer();
          } catch (e$) {
            err = e$;
            this.stopTimer();
            this.fail(err);
          }
        };
        prototype.execute = function(){
          if (this.fn.length === 0) {
            return this.runTest();
          } else {
            this.startTimer();
            return this.fn(function(fn){
              return this.runTest(fn);
            });
          }
        };
        prototype.pass = function(duration){
          if (!this.logPass) {
            return;
          }
          info("\u2713 " + this.desc + " (" + duration + "ms)");
          this.set.pass(this);
        };
        prototype.fail = function(err){
          error("FAIL: " + this.desc + ": " + (err.message || err));
          debug('error:', err);
          debug('test:', this.fn);
          if (this.subject != null) {
            debug('subject:', this.subject);
          }
          this.set.fail(this);
        };
        prototype.later = function(fn){
          setTimeout(fn, this.later);
        };
        prototype.noop = function(){};
        prototype.is = assert;
        prototype.assert = assert;
        prototype.should = assert;
        prototype.get = dom;
        prototype.find = dom;
        prototype.fetch = dom;
        return Test;
      }()),
      TestSet: TestSet = (function(){
        TestSet.displayName = 'TestSet';
        var prototype = TestSet.prototype, constructor = TestSet;
        function TestSet(name, suite, delay, fixture){
          var ref$;
          this.name = name;
          this.suite = suite;
          this.delay = delay != null ? delay : 0;
          this.fixture = fixture != null ? fixture : void 8;
          if ((ref$ = this.suite) != null) {
            ref$.add(this);
          }
          this.tests = [];
          this.beforeTest = [];
          this.afterTest = [];
          this.beforeSet = [];
          this.afterSet = [];
          this.count = 0;
          this.ran = 0;
          this.success = 0;
          this.error = 0;
          this.start = null;
          this.end = null;
        }
        prototype.beforeAll = function(fn){
          return this.beforeSet.push(fn);
        };
        prototype.beforeEach = function(fn){
          return this.beforeTest.push(fn);
        };
        prototype.afterAll = function(fn){
          return this.afterSet.push(fn);
        };
        prototype.afterEach = function(fn){
          return this.afterTest.push(fn);
        };
        prototype.test = function(subject, desc, fn){
          if (arguments.length === 2) {
            fn = desc;
            desc = subject;
            subject = null;
          }
          this.tests.push(new Test(subject, desc, fn, this));
          return this.count += 1;
        };
        prototype.run = function(){
          var this$ = this;
          log("\n\u25FC " + this.name + " test set\n");
          return this.loadFixture(function(err){
            if (err != null) {
              throw new TestError('error loading fixture');
            }
            return setTimeout(function(){
              var i$, ref$, len$, fn;
              for (i$ = 0, len$ = (ref$ = this$.beforeSet).length; i$ < len$; ++i$) {
                fn = ref$[i$];
                fn.call(this$);
              }
              this$.start = new Date();
              return this$.next();
            }, this$.delay);
          });
        };
        prototype.fetch = function(url, callback){
          var x$;
          x$ = new XMLHttpRequest();
          x$.onreadystatechange = function(){
            if (x$.readyState === 4) {
              document.body.innerHTML = x$.responseText;
              if (x$.status === 200) {
                return callback();
              } else {
                return callback('failed');
              }
            }
          };
          x$.open('GET', this.fixture);
          x$.send();
          return x$;
        };
        prototype.loadFixture = function(callback){
          if (!this.fixture || (typeof XMLHttpRequest == 'undefined' || XMLHttpRequest === null)) {
            return callback();
          } else {
            log("\u25CF Loading fixtures for " + this.name + " set");
            return this.fetch(this.fixture, callback);
          }
        };
        prototype.done = function(){
          var i$, ref$, len$, fn;
          for (i$ = 0, len$ = (ref$ = this.afterTest).length; i$ < len$; ++i$) {
            fn = ref$[i$];
            fn.call(this);
          }
          this.end = new Date();
          info("\u25CF " + this.count + " in " + this.name + " with " + this.success + " passing and " + this.error + " failing (" + (this.end - this.start) + "ms)");
          return (ref$ = this.suite) != null ? ref$.next(this.success, this.error) : void 8;
        };
        prototype.next = function(){
          var i$, ref$, len$, fn, results$ = [];
          if (this.ran === this.count) {
            return this.done();
          } else {
            for (i$ = 0, len$ = (ref$ = this.beforeTest).length; i$ < len$; ++i$) {
              fn = ref$[i$];
              fn.call(this);
            }
            this.tests[this.ran].execute();
            for (i$ = 0, len$ = (ref$ = this.afterTest).length; i$ < len$; ++i$) {
              fn = ref$[i$];
              results$.push(fn.call(this));
            }
            return results$;
          }
        };
        prototype.pass = function(test){
          this.ran += 1;
          this.success += 1;
          return this.next();
        };
        prototype.fail = function(test){
          this.ran += 1;
          this.error += 1;
          return this.next();
        };
        return TestSet;
      }()),
      TestSuite: TestSuite = (function(){
        TestSuite.displayName = 'TestSuite';
        var prototype = TestSuite.prototype, constructor = TestSuite;
        function TestSuite(){
          this.sets = [];
          this.count = 0;
          this.ran = 0;
          this.start = 0;
          this.end = 0;
          this.success = 0;
          this.error = 0;
        }
        prototype.add = function(set){
          this.sets.push(set);
          return this.count += 1;
        };
        prototype.run = function(){
          log("\u25BA Starting all test sets");
          this.start = new Date();
          return this.next();
        };
        prototype.next = function(success, error){
          success == null && (success = 0);
          error == null && (error = 0);
          this.success += success;
          this.error += error;
          if (this.ran === this.count) {
            return this.done();
          } else {
            this.sets[this.ran].run();
            return this.ran += 1;
          }
        };
        prototype.done = function(){
          this.end = new Date();
          log('============================================');
          info("Total run:    " + (this.end - this.start) + "ms");
          info("Total sets:   " + this.ran);
          info("Passing:      " + this.success);
          if (this.error) {
            info("Failing:      " + this.error);
          }
          return log('============================================');
        };
        return TestSuite;
      }())
    };
  });
  function extend$(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function deepEq$(x, y, type){
    var toString = {}.toString, hasOwnProperty = {}.hasOwnProperty,
        has = function (obj, key) { return hasOwnProperty.call(obj, key); };
    var first = true;
    return eq(x, y, []);
    function eq(a, b, stack) {
      var className, length, size, result, alength, blength, r, key, ref, sizeB;
      if (a == null || b == null) { return a === b; }
      if (a.__placeholder__ || b.__placeholder__) { return true; }
      if (a === b) { return a !== 0 || 1 / a == 1 / b; }
      className = toString.call(a);
      if (toString.call(b) != className) { return false; }
      switch (className) {
        case '[object String]': return a == String(b);
        case '[object Number]':
          return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
        case '[object Date]':
        case '[object Boolean]':
          return +a == +b;
        case '[object RegExp]':
          return a.source == b.source &&
                 a.global == b.global &&
                 a.multiline == b.multiline &&
                 a.ignoreCase == b.ignoreCase;
      }
      if (typeof a != 'object' || typeof b != 'object') { return false; }
      length = stack.length;
      while (length--) { if (stack[length] == a) { return true; } }
      stack.push(a);
      size = 0;
      result = true;
      if (className == '[object Array]') {
        alength = a.length;
        blength = b.length;
        if (first) { 
          switch (type) {
          case '===': result = alength === blength; break;
          case '<==': result = alength <= blength; break;
          case '<<=': result = alength < blength; break;
          }
          size = alength;
          first = false;
        } else {
          result = alength === blength;
          size = alength;
        }
        if (result) {
          while (size--) {
            if (!(result = size in a == size in b && eq(a[size], b[size], stack))){ break; }
          }
        }
      } else {
        if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) {
          return false;
        }
        for (key in a) {
          if (has(a, key)) {
            size++;
            if (!(result = has(b, key) && eq(a[key], b[key], stack))) { break; }
          }
        }
        if (result) {
          sizeB = 0;
          for (key in b) {
            if (has(b, key)) { ++sizeB; }
          }
          if (first) {
            if (type === '<<=') {
              result = size < sizeB;
            } else if (type === '<==') {
              result = size <= sizeB
            } else {
              result = size === sizeB;
            }
          } else {
            first = false;
            result = size === sizeB;
          }
        }
      }
      stack.pop();
      return result;
    }
  }
}).call(this);
