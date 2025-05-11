import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Pharos Pro",
  description: "简单强大的代理工具",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    
    nav: [
      { text: '主页', link: '/' },
      { text: '配置文档', link: '/config/' },
      { text: '下载', link: '/download' },
      { text: '常见问题', link: '/faq' },
      { text: '关于我们', link: '/about' }
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
            { text: '域名嗅探', link: '/config/sniffing' },
            { text: '入站', link: '/config/inbound' },
            { text: '出站', link: '/config/outbound' },
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
      { icon: 'github', link: 'https://github.com/PharosGroup/PharosPro' }
    ],

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2022-2025 Pharos Pro 团队'
    }
  }
})
