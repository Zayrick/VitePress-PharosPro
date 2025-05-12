# DNS 配置

DNS（域名系统）配置是 Pharos Pro 的核心功能之一，它决定了如何解析域名并影响您的网络性能和隐私。通过合理配置DNS，您可以提高网络访问速度，规避DNS污染，并实现更精确的域名解析控制。

## 配置结构

```yaml
dns:
  enable: true
  cache-algorithm: arc
  prefer-h3: false
  use-hosts: true
  use-system-hosts: true
  listen: 0.0.0.0:1053
  ipv6: false
  default-nameserver:
    - 223.5.5.5
    - 119.29.29.29
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter:
    - '*.lan'
    - '*.local'
    - 'localhost.ptlogin2.qq.com'
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
  fallback:
    - tls://8.8.4.4:853
    - tls://1.1.1.1:853
  fallback-filter:
    geoip: true
    geoip-code: CN
    ipcidr:
      - 240.0.0.0/4
  nameserver-policy:
    '+.google.com': 'https://dns.google/dns-query'
    '+.github.com': 'https://cloudflare-dns.com/dns-query'
``` 

## 功能特性

- **多种DNS协议支持**：支持UDP、TCP、DoH、DoT、DoQ等多种DNS协议
- **智能DNS分流**：可以为不同域名指定不同的DNS服务器
- **防DNS污染**：通过加密DNS和回退机制避免DNS污染
- **Fake-IP模式**：提供更高性能的DNS解析体验
- **灵活的过滤系统**：可以根据GeoIP、规则集等灵活配置DNS解析行为

## 快速入门

最基本的DNS配置示例：

```yaml
dns:
  enable: true
  listen: 0.0.0.0:1053
  enhanced-mode: fake-ip
  default-nameserver:
    - 223.5.5.5
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
```
