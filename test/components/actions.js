import context from '../../src/context.js';

export const incrementBy = context.action((state, value) => ({ someprop: state.someprop + value }));

export const decrementBy = context.action((state, value) => ({ someprop: state.someprop - value }));

export const setMultipleVar = context.asyncAction(async (_, value1, value2) => ({ value1, value2 }));
