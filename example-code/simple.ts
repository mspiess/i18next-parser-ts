const t = (_key: string) => {};
let a: 'a' | 'b';
a = Math.random() > .5 ? 'a' : 'b';
const c = `a${a}` as const;

t('someKey');
t(`otherKey${1 + 2}`);
t(`otherKey${a}` as const);
t(`otherKey${a}${c}` as const);