/**
 * .umirc.(js|ts) 和 config/config.(js|ts)
 * 编译时配置文件，二选一，不可共存。
 */

 // ref: https://umijs.org/config/
export default {
    treeShaking: true,
    routes: [
      {
        path: '/',
        component: '../layouts/index',
        routes: [
          {
            path: '/tt',
            component: './tt',
          },
          {
            path: '/',
            component: '../pages/index',
          },
        ],
      },
    ],
    plugins: [
      // ref: https://umijs.org/plugin/umi-plugin-react.html
      [
        'umi-plugin-react',
        {
          antd: true,
          dva: false,
          dynamicImport: false,
          title: 'myapp',
          dll: false,
          routes: {
            exclude: [/components\//],
          },
        },
      ],
    ],
  };
  