import { defineConfig } from '@umijs/max';
import routes from './configs/routes';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: routes,
  npmClient: 'pnpm',
  utoopack: {},

  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      ws: true,
      // pathRewrite: { '^/api': '' },
    },
  },
});
