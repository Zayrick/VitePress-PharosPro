# DNS 配置

DNS (Domain Name System) 配置是 Pharos Pro 的核心功能之一，它决定了如何解析域名并影响您的网络性能和隐私。

## 基本配置

```yaml
dns:
  enable: true
  listen: 0.0.0.0:53
  ipv6: false
  
  # 默认DNS服务器
  default-nameserver:
    - 223.5.5.5
    - 119.29.29.29
  
  # 增强模式: redir-host / fake-ip
  enhanced-mode: fake-ip
  
  # DNS服务器
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
```

## 增强模式说明

### `redir-host` 模式

直接使用真实 IP 地址。该模式下：
- 请求会使用目标的真实 IP
- 本地客户端可以从 DNS 缓存中获取目标的真实 IP
- 适合需要知道目标真实 IP 的场景

### `fake-ip` 模式

使用虚拟 IP 地址。该模式下：
- Pharos 会为域名分配虚拟 IP 地址
- 性能通常优于 `redir-host` 模式
- 部分依赖真实 IP 的应用可能工作不正常

## DNS 服务器类型

Pharos Pro 支持多种 DNS 协议：

### 普通 DNS

```yaml
nameserver:
  - 223.5.5.5
  - 8.8.8.8
```

### 加密 DNS

```yaml
nameserver:
  # DNS over HTTPS
  - https://doh.pub/dns-query
  - https://cloudflare-dns.com/dns-query
  
  # DNS over TLS
  - tls://dns.rubyfish.cn:853
  
  # DNS over QUIC
  - quic://dns.adguard.com
```

## 域名解析策略

### 域名分组

可以为不同域名指定不同的解析服务器：

```yaml
dns:
  # ... 其他设置 ...
  
  # 指定域名使用特定服务器
  nameserver-policy:
    'www.baidu.com': '114.114.114.114'
    '*.taobao.com': '223.5.5.5'
    'api.github.com': 'https://cloudflare-dns.com/dns-query'
```

### 特殊域名处理

可以为某些域名指定固定 IP：

```yaml
dns:
  # ... 其他设置 ...
  
  # 静态域名解析（hosts）
  hosts:
    'mtalk.google.com': 108.177.125.188
    'dl.google.com': 180.163.151.161
    'dl.l.google.com': 180.163.151.161
```

## 高级设置

```yaml
dns:
  # ... 其他设置 ...
  
  # 绕过系统 DNS
  use-hosts: true
  
  # 查询超时时间（秒）
  timeout: 5
  
  # 覆盖返回的 TTL 值
  max-ttl: 3600
  
  # DNS解析失败后的等待时间（秒）
  fallback-filter:
    geoip: true
    geoip-code: CN
    ipcidr:
      - 240.0.0.0/4
```

### FakeIP 设置

```yaml
dns:
  # ... 其他设置 ...
  
  # FakeIP 池
  fake-ip-range: 198.18.0.1/16
  
  # FakeIP 过滤
  fake-ip-filter:
    - '*.lan'
    - 'stun.*.*'
    - 'time.*.com'
    - '*.stun.*.*'
    - 'time.*.gov'
```

## 常见问题

### DNS 泄漏

如果您担心 DNS 泄漏问题，请使用加密 DNS 并确保配置了适当的 DNS 回落。

### 解析速度慢

尝试以下解决方案：
1. 使用距离您较近的 DNS 服务器
2. 启用 DNS 缓存
3. 切换到 `fake-ip` 模式可能提高性能

### 特定网站无法访问

某些网站可能依赖于精确的 DNS 解析。在这种情况下：
1. 为这些域名配置特定的 `nameserver-policy`
2. 切换到 `redir-host` 模式
3. 或者在 `fake-ip-filter` 中添加相关域名

## 配置示例

```yaml
dns:
  enable: true
  listen: 0.0.0.0:53
  ipv6: false
  default-nameserver:
    - 223.5.5.5
    - 119.29.29.29
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter:
    - '*.lan'
    - localhost.ptlogin2.qq.com
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
  fallback:
    - https://cloudflare-dns.com/dns-query
    - https://dns.google/dns-query
  fallback-filter:
    geoip: true
    geoip-code: CN
    ipcidr:
      - 240.0.0.0/4
  nameserver-policy:
    'www.baidu.com': '114.114.114.114'
    '*.taobao.com': '223.5.5.5'
```
