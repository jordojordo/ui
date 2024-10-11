import { config, RouterLinkStub } from '@vue/test-utils';

import cleanTooltipDirective from '@shell/directives/clean-tooltip';
import cleanHtmlDirective from '@shell/directives/clean-html';

config.global.productionTip = false;

config.global.directives = {
  ...config.global.directives,
  t: {
    mounted(el, binding) {
      el.textContent = `%${ binding.value }%`;
    },
    updated(el, binding) {
      el.textContent = `%${ binding.value }%`;
    }
  },
  'clean-tooltip': cleanTooltipDirective,
  'clean-html':    cleanHtmlDirective,
};

config.global.mocks = {
  $store: { getters: { 'i18n/t': jest.fn() } },
  t: (key) => `%${ key }%`
};

config.global.stubs = {
  'router-link': RouterLinkStub
};

beforeAll(() => {
  // matchMedia and getContext methods aren't included in jest's version of jsdom for us to mock
  // implemented as per jest documentation: https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
  Object.defineProperty(window, 'matchMedia', { value: jest.fn().mockImplementation(() => ({ addListener: jest.fn() })) });
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: jest.fn().mockImplementation(() => ({
      createLinearGradient: jest.fn(),
      fillRect:             jest.fn(),
      getImageData:         jest.fn(() => ({ data: [] }))
    }))
  });
});

beforeEach(() => {
  jest.restoreAllMocks();
});
