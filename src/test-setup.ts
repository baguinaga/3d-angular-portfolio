import 'jest-preset-angular/setup-jest';

// Global test configuration
Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: ['-webkit-appearance'],
    };
  },
});

Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  configurable: true,
  value: 1,
});
Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  value: 1,
});
