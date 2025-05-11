# DNS 域名策略

通过域名策略，您可以为不同的域名指定不同的解析服务器或规则，实现更精细的 DNS 解析控制。

## 域名解析策略

```yaml
dns:
  nameserver-policy:
    '+.arpa': '10.0.0.1'
    'rule-set:cn':
      - https://doh.pub/dns-query
      - https://dns.alidns.com/dns-query
    '+.google.com': 'https://dns.google/dns-query'
    'baidu.com': '114.114.114.114'
```

- `nameserver-policy`: 指定特定域名使用的 DNS 服务器
  - 键: 域名匹配规则
  - 值: DNS 服务器或服务器列表
  - 优先级高于 `nameserver` 和 `fallback`

### 域名匹配规则

1. **精确匹配**: 直接写域名，如 `baidu.com`
2. **子域名匹配**: 使用前缀 `+.`，如 `+.google.com` 匹配 `google.com` 及其所有子域名
3. **规则集匹配**: 使用 `rule-set:` 前缀，如 `rule-set:cn` 匹配规则集中的所有域名

### 服务器配置

1. **单个服务器**: 直接指定服务器地址，如 `114.114.114.114`
2. **服务器列表**: 使用数组指定多个服务器，将按顺序尝试

## 后备服务器筛选

```yaml
dns:
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

- `fallback-filter`: 控制何时使用后备 DNS 服务器
  - 配置 `fallback` 后默认启用，`geoip-code` 默认为 `CN`
  - 满足条件的域名将使用 `fallback` 服务器解析

### 筛选选项

#### GeoIP 筛选

```yaml
fallback-filter:
  geoip: true
  geoip-code: CN
```

- `geoip`: 是否启用基于 IP 地理位置的筛选
  - `true`: 启用 (默认)
  - `false`: 禁用
- `geoip-code`: 国家代码
  - 默认值为 `CN` (中国)
  - 当 DNS 解析的 IP 不属于指定国家时，视为污染，使用 `fallback` 重新解析

#### GeoSite 筛选

```yaml
fallback-filter:
  geosite:
    - gfw
    - geolocation-!cn
```

- `geosite`: 基于预定义域名集合的筛选
  - 可以使用内置规则集，如 `gfw`、`geolocation-!cn` 等
  - 匹配这些规则的域名将直接使用 `fallback` 服务器解析

#### IP 网段筛选

```yaml
fallback-filter:
  ipcidr:
    - 240.0.0.0/4
    - 0.0.0.0/8
    - 127.0.0.0/8
```

- `ipcidr`: 基于 IP 网段的筛选
  - 当 DNS 解析结果在这些网段内时，视为污染，使用 `fallback` 重新解析
  - 通常用于过滤保留地址或特殊 IP

#### 域名列表筛选

```yaml
fallback-filter:
  domain:
    - '+.google.com'
    - '+.facebook.com'
    - '+.youtube.com'
```

- `domain`: 直接指定的域名列表
  - 匹配这些规则的域名将直接使用 `fallback` 服务器解析
  - 支持精确匹配和子域名匹配

## Fake-IP 过滤模式

```yaml
dns:
  fake-ip-filter-mode: blacklist
  fake-ip-filter:
    - '*.lan'
    - localhost.ptlogin2.qq.com
```

- `fake-ip-filter-mode`: 控制 Fake-IP 过滤模式
  - `blacklist`: 黑名单模式，匹配的域名不使用 Fake-IP (默认)
  - `whitelist`: 白名单模式，只有匹配的域名才使用 Fake-IP

- `fake-ip-filter`: Fake-IP 过滤规则
  - 在黑名单模式下，匹配的域名将不会使用 Fake-IP 映射
  - 在白名单模式下，只有匹配的域名才会使用 Fake-IP 映射
  - 通常用于排除不兼容 Fake-IP 的服务

## 配置示例

### 基本域名策略

```yaml
dns:
  nameserver-policy:
    'www.baidu.com': '114.114.114.114'
    '+.qq.com': 'https://doh.pub/dns-query'
    '+.google.com': 'https://dns.google/dns-query'
```

### 规则集结合

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

### 完整域名策略配置

```yaml
dns:
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
  
  fallback:
    - tls://8.8.4.4:853
    - tls://1.1.1.1:853
  
  nameserver-policy:
    'www.baidu.com': '114.114.114.114'
    '+.qq.com': 'https://doh.pub/dns-query'
    '+.google.com': 'https://dns.google/dns-query'
    '+.github.com': 'https://cloudflare-dns.com/dns-query'
    'rule-set:cn': 
      - https://doh.pub/dns-query
      - https://dns.alidns.com/dns-query
  
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
  
  fake-ip-filter-mode: blacklist
  fake-ip-filter:
    - '*.lan'
    - localhost.ptlogin2.qq.com
```

通过合理配置域名策略，您可以为不同类型的域名指定最优的解析路径，提高网络访问效率。 