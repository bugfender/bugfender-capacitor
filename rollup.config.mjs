export default {
  input: 'dist/esm/index.js',
  output: [
    {
      file: 'dist/plugin.js',
      format: 'iife',
      name: 'capacitorBugfender',
      globals: {
        '@capacitor/core': 'capacitorExports',
        '@bugfender/sdk': 'Bugfender',
        '@bugfender/common': 'BugfenderCommon',
      },
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      file: 'dist/plugin.cjs.js',
      format: 'cjs',
      sourcemap: true,
      inlineDynamicImports: true,
      globals: {
        '@bugfender/sdk': 'Bugfender',
        '@bugfender/common': 'BugfenderCommon',
      },
    },
  ],
  external: [
    '@capacitor/core',
    '@bugfender/sdk',
    '@bugfender/common',
  ],
};
