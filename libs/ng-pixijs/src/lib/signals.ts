import {
  assertInInjectionContext,
  CreateEffectOptions,
  effect,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core';

export function assertInjector(
  fn: () => unknown,
  injector: Injector | undefined | null,
  runner?: () => any
) {
  !injector && assertInInjectionContext(fn);
  const assertedInjector = injector ?? inject(Injector);

  if (!runner) return assertedInjector;
  return runInInjectionContext(assertedInjector, runner);
}

export function injectAutoEffect(injector?: Injector) {
  return assertInjector(injectAutoEffect, injector, () => {
    const assertedInjector = inject(Injector);
    const injectorOptions = { injector: assertedInjector };
    return (
      autoEffectCallback: (autoEffectInjector: Injector) => void | (() => void),
      options: Omit<CreateEffectOptions, 'injector'> = {}
    ) => {
      return effect((onCleanup) => {
        const maybeCleanup = autoEffectCallback(assertedInjector);
        if (typeof maybeCleanup === 'function') {
          onCleanup(() => maybeCleanup());
        }
      }, Object.assign(options, injectorOptions));
    };
  });
}
