module.exports = api => {
  api.cache(true);

  return {
    presets: ['@babel/preset-env'],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-class-properties',
    ],
  };
};
