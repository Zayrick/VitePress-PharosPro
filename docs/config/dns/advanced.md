# DNS 高级配置

本节介绍 DNS 配置中的高级选项，这些设置可以帮助您进一步优化 DNS 解析性能和控制解析行为。

## 缓存算法设置

```yaml
dns:
  cache-algorithm: arc
```

- `cache-algorithm`: DNS 结果缓存的算法
  - 支持的算法:
    - `lru`: 最近最少使用算法 (默认值)
    - `arc`: 自适应替换缓存算法 (推荐)
  - ARC 算法通常能提供更好的缓存命中率，特别是对于反复访问的域名

## 域名策略与特殊服务

### 特定服务 DNS 服务器

```yaml
dns:
  # 代理节点域名解析
  proxy-server-nameserver:
    - https://doh.pub/dns-query
  
  # 直连域名解析
  direct-nameserver:
    - system
  direct-nameserver-follow-policy: false
```

- `proxy-server-nameserver`: 用于解析代理节点域名的 DNS 服务器
  - 解决"先有鸡还是先有蛋"的问题
  - 确保代理节点域名能正确解析
  
- `direct-nameserver`: 用于解析直连域名的 DNS 服务器
  - 可以使用 `system` 表示使用系统 DNS
  
- `direct-nameserver-follow-policy`: 直连 DNS 是否遵循域名策略
  - `true`: 遵循 `nameserver-policy` 设置
  - `false`: 不遵循 (默认)

## 规则遵循

```yaml
dns:
  respect-rules: false
```

- `respect-rules`: DNS 连接是否遵守路由规则
  - `true`: DNS 连接将遵守路由规则
  - `false`: DNS 连接不遵守路由规则 (默认)
  - 启用此选项需要配置 `proxy-server-nameserver`
  - 不建议与 `prefer-h3` 一起使用

## 高级域名策略

```yaml
dns:
  nameserver-policy:
    'rule-set:cn':
      - https://doh.pub/dns-query
      - https://dns.alidns.com/dns-query
    'rule-set:geolocation-!cn':
      - https://dns.google/dns-query
      - https://cloudflare-dns.com/dns-query
```

- 使用规则集为大量域名设置 DNS 服务器
- 可以结合地理位置信息优化 DNS 解析
- 针对不同地区或类型的域名使用最佳的 DNS 服务器

## DNS 服务器连接优化

### HTTP/3 优化

```yaml
dns:
  prefer-h3: true
  nameserver:
    - 'https://dns.cloudflare.com/dns-query#h3=true'
    - 'https://dns.google/dns-query#h3=true'
```

- `prefer-h3`: DOH 是否优先使用 HTTP/3 协议
  - `true`: 优先使用 HTTP/3
  - `false`: 使用默认 HTTP 协议 (默认)
- 也可以通过服务器附加参数强制单个服务器使用 HTTP/3

### 指定代理或网络接口

```yaml
dns:
  nameserver:
    - 'tls://dns.google#proxy'
    - 'https://doh.pub/dns-query#eth0'
```

- 可以指定特定的代理或网络接口来连接 DNS 服务器
- 通过 `#proxy` 附加参数使用配置中的代理服务器
- 通过 `#interface名称` 指定网络接口

### EDNS Client Subnet

```yaml
dns:
  nameserver:
    - 'https://dns.google/dns-query#ecs=1.1.1.1/24'
    - 'https://dns.google/dns-query#ecs=1.1.1.1/24&ecs-override=true'
```

- `ecs=IP/掩码`: 设置 EDNS Client Subnet
  - 可以帮助 DNS 服务器返回更准确的结果
  - 仅支持 DOH
- `ecs-override=true`: 强制覆盖 DNS 查询的 subnet 地址

## 安全相关选项

```yaml
dns:
  nameserver:
    - 'https://doh.pub/dns-query#skip-cert-verify=true'
```

- `skip-cert-verify=true`: 跳过证书验证
  - 在证书有问题的环境中使用
  - 安全性降低，仅在必要时启用

## 性能优化组合配置

### 低延迟配置

```yaml
dns:
  cache-algorithm: arc
  prefer-h3: true
  nameserver:
    - 'https://dns.cloudflare.com/dns-query#h3=true'
    - 'https://doh.pub/dns-query#h3=true'
  enhanced-mode: fake-ip
```

- 使用 ARC 缓存算法提高缓存命中率
- 启用 HTTP/3 减少连接延迟
- 使用 Fake-IP 模式减少 DNS 查询次数

### 高可靠性配置

```yaml
dns:
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
  fallback:
    - tls://8.8.4.4:853
    - tls://1.1.1.1:853
  fallback-filter:
    geoip: true
    geoip-code: CN
    geosite:
      - gfw
    ipcidr:
      - 240.0.0.0/4
  default-nameserver:
    - 223.5.5.5
    - 119.29.29.29
```

- 使用多个可靠的 DNS 服务器
- 配置后备 DNS 服务器和筛选规则
- 提供多层次的解析保障

### 游戏和流媒体优化

```yaml
dns:
  enhanced-mode: fake-ip
  cache-algorithm: arc
  nameserver-policy:
    '+.netflix.com': 'https://dns.google/dns-query'
    '+.nflxvideo.net': 'https://dns.google/dns-query'
    '+.steamcontent.com': 'https://doh.pub/dns-query'
    '+.steampowered.com': 'https://doh.pub/dns-query'
  fake-ip-filter:
    - '*.stun.*.*'
    - 'stun.*.*'
    - 'stun.*.*.*'
    - '*.stun.*.*.*'
    - '*.stun.*.*.*.*'
    - 'speedtest.cros.wr.pvp.net'
```

- 为游戏和流媒体服务配置专用的 DNS 服务器
- 针对性过滤需要真实 IP 的域名
- 确保特定服务的最佳连接性能

## 参数组合与注意事项

配置 DNS 时，应注意以下几点：

1. **不兼容组合**:
   - `respect-rules: true` 与 `prefer-h3: true` 不建议一起使用
   - `direct-nameserver-follow-policy: true` 仅当 `direct-nameserver` 不为空时生效

2. **最佳性能组合**:
   - `cache-algorithm: arc` + `enhanced-mode: fake-ip` + `prefer-h3: true`
   - 特定域名使用 `nameserver-policy` 指向最佳服务器

3. **安全性考虑**:
   - 尽量使用加密 DNS (DoH/DoT/DoQ)
   - 使用可信任的 DNS 提供商
   - 需要时配置适当的 `fallback` 和 `fallback-filter`

通过合理配置这些高级选项，您可以获得既安全又高效的 DNS 解析服务。 