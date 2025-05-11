import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Pharos Pro | 非官方",
  description: "目前为 iOS 平台上对 Mihomo 的最佳实现，不仅完美兼容其核心功能，还在此基础上进行了功能扩展，带来更流畅、更强大的使用体验，是高级用户与网络优化爱好者的理想选择。",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '配置文档', link: '/config/' },
      { text: 'App Store', link: 'https://apps.apple.com/us/app/pharos-pro/id1456610173' },
      { text: '常见问题', link: '/faq' },
      { text: '关于', link: '/about' }
    ],

    sidebar: {
      '/config/': [
        {
          text: '配置文档',
          items: [
            { text: '总览', link: '/config/' },
            {
              text: '语法',
              collapsed: false,
              items: [
                { text: 'YAML语法', link: '/config/syntax/yaml' },
                { text: '域名通配符', link: '/config/syntax/wildcards' }
              ]
            },
            { text: '全局配置', link: '/config/general' },
            { text: 'DNS', link: '/config/dns' },
            { text: '域名嗅探', link: '/config/rules' },
            { text: '入站', link: '/config/rules' },
            { text: '出站', link: '/config/rules' },
            { text: '代理集合', link: '/config/rules' },
            { text: '策略组', link: '/config/rules' },
            { text: '代理规则', link: '/config/rules' },
            { text: '规则集合', link: '/config/rules' },
            { text: '子规则', link: '/config/rules' },
            { text: '流量转发', link: '/config/rules' },
            { text: 'NTP 服务', link: '/config/rules' },
            { text: '实验性配置', link: '/config/rules' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/PharosProject/PharosPro' }
    ]
  }
})
