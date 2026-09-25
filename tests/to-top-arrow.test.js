import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function loadScriptWithDom() {
  const clickHandlers = [];
  const button = {
    addEventListener(type, handler) {
      if (type === 'click') clickHandlers.push(handler);
    },
    classList: {
      add() {},
      remove() {},
    },
    offsetHeight: 0,
  };

  const trigger = {
    classList: {
      add() {},
      remove() {},
    },
    querySelector(selector) {
      if (selector === '.to-top-arrow') return button;
      return null;
    },
  };

  let scrollToCall = null;
  const documentStub = {
    querySelector(selector) {
      if (selector === '.to-top-arrow-trigger') return trigger;
      if (selector === '.to-top-arrow') return button;
      return null;
    },
  };

  const observerInstances = [];
  const IntersectionObserverStub = class {
    constructor(callback) {
      this.callback = callback;
      observerInstances.push(this);
    }

    observe() {}
  };

  const context = {
    window: {
      scrollTo(args) {
        scrollToCall = args;
      },
    },
    document: documentStub,
    IntersectionObserver: IntersectionObserverStub,
  };

  vm.runInNewContext(fs.readFileSync(new URL('../js/common/to-top-arrow.js', import.meta.url), 'utf8'), context);

  return {
    clickHandlers,
    scrollToCall,
    observerInstances,
  };
}

test('to-top button binds a click handler that scrolls to the top', () => {
  const { clickHandlers, scrollToCall } = loadScriptWithDom();

  assert.equal(clickHandlers.length, 1, 'a click handler should be attached');

  clickHandlers[0]();

  assert.ok(scrollToCall, 'scrollTo should be called when the button is clicked');
  assert.equal(scrollToCall.top, 0, 'scroll should target the top of the page');
  assert.equal(scrollToCall.behavior, 'smooth', 'scroll should be smooth');
});
