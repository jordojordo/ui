import { Component } from 'vue';
import { shallowMount, ComponentMountingOptions, VueWrapper } from '@vue/test-utils';

/**
 * Creates a wrapper factory function for a given component and common options.
 *
 * @param component - The Vue component to be mounted.
 * @param commons - Default options to be applied to the component during mounting.
 * @returns A function that takes an optional `MountingOptions` parameter for overrides.
 */
export function createWrapper<Props = {}>(
  component: Component,
  commons: ComponentMountingOptions<Props> = {}
) {
  return (overrides: ComponentMountingOptions<Props> = {}): VueWrapper<any> => {
    const mountOptions: ComponentMountingOptions<Props> = {
      ...commons,
      ...overrides,
    };

    return shallowMount(component, mountOptions);
  };
}
