import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  title: "Pharos Pro | 非官方",
  description: "目前为 iOS 平台上对 Mihomo 的最佳实现，不仅完美兼容其核心功能，还在此基础上进行了功能扩展，带来更流畅、更强大的使用体验，是高级用户与网络优化爱好者的理想选择。",
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/logo.png' }],
  ],
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
            { text: 'Hosts 配置', link: '/config/hosts' },
            { text: '代理端口', link: '/config/ports' },
            {
              text: 'DNS',
              link: '/config/dns/',
              collapsed: true,
              items: [
                { text: '基本配置', link: '/config/dns/basic' },
                { text: '解析模式', link: '/config/dns/modes' },
                { text: 'DNS服务器', link: '/config/dns/servers' },
                { text: '域名策略', link: '/config/dns/policies' },
                { text: 'Fake-IP配置', link: '/config/dns/fake-ip' },
                { text: '高级选项', link: '/config/dns/advanced' },
                { text: '常见问题', link: '/config/dns/faq' }
              ]
            },
            { text: '域名嗅探', link: '/config/sniffer' },
            { text: '入站', link: '/config/listeners' },
            { text: 'TUN 配置', link: '/config/tun' },
            { text: '代理集合', link: '/config/proxies' },
            { text: '策略组', link: '/config/proxy-groups' },
            { text: '代理规则', link: '/config/rules' },
            { text: '规则集合', link: '/config/rule-sets' },
            { text: '子规则', link: '/config/sub-rules' },
            { text: '流量转发', link: '/config/traffic-forward' },
            { text: 'NTP 服务', link: '/config/ntp' },
            { text: '实验性配置', link: '/config/experimental' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/PharosProject/PharosPro' }
    ]
  }
})
