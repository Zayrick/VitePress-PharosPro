# DNS 配置

DNS (域名系统) 配置是 Pharos Pro 的核心功能之一，它决定了如何解析域名并影响您的网络性能和隐私。本文档已经被重构为更详细的多个小节，以提供更清晰的说明。

## 文档导航

我们已将 DNS 配置文档拆分为以下几个小节，方便您查找所需的具体信息：

- [DNS 配置概述](./index.md) - DNS 配置的整体介绍和快速入门
- [基本配置](./basic.md) - 常用基础设置与参数说明
- [解析模式](./modes.md) - 详解 redir-host 和 fake-ip 两种模式
- [DNS服务器](./servers.md) - 各类DNS服务器配置及参数说明
- [域名策略](./policies.md) - 域名解析策略与规则设置
- [Fake-IP配置](./fake-ip.md) - 关于Fake-IP的详细配置
- [高级选项](./advanced.md) - 高级配置选项与性能优化
- [常见问题](./faq.md) - 常见DNS配置问题及解决方案

## 配置示例

以下是一个基本的 DNS 配置示例，更详细的配置和说明请参阅对应小节。

```yaml
dns:
  enable: true
  cache-algorithm: arc
  prefer-h3: false
  use-hosts: true
  use-system-hosts: true
  respect-rules: false
  listen: 0.0.0.0:1053
  ipv6: false
  default-nameserver:
    - 223.5.5.5
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter-mode: blacklist
  fake-ip-filter:
    - '*.lan'
  nameserver-policy:
    '+.arpa': '10.0.0.1'
    'rule-set:cn':
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
  fallback:
    - tls://8.8.4.4
    - tls://1.1.1.1
  proxy-server-nameserver:
    - https://doh.pub/dns-query
  direct-nameserver:
    - system
  direct-nameserver-follow-policy: false
  fallback-filter:
    geoip: true
    geoip-code: CN
    geosite:
      - gfw
    ipcidr:
      - 240.0.0.0/4
    domain:
      - '+.google.com'
      - '+.facebook.com'
      - '+.youtube.com'
```

请访问[DNS配置概述](./index.md)获取更多信息。
