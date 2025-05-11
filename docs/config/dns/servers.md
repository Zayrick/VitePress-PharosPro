# DNS 服务器配置

Pharos Pro 支持多种类型的 DNS 服务器，从传统的明文 DNS 到各种加密 DNS 协议。本节详细介绍各类 DNS 服务器的配置方法。

## 默认 DNS 服务器

```yaml
dns:
  default-nameserver:
    - 223.5.5.5
    - 119.29.29.29
```

- `default-nameserver`: 用于解析 DNS 服务器域名的基础 DNS 服务器
  - 必须使用 IP 地址
  - 建议配置可靠的公共 DNS，如阿里 DNS、腾讯 DNS 等
  - 这些服务器仅用于解析配置中的 DNS 服务器域名，不直接用于普通域名解析

## 主 DNS 服务器

```yaml
dns:
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
    - tls://dns.google:853
    - 223.5.5.5
```

- `nameserver`: 主要的 DNS 解析服务器列表
  - 支持多种类型的 DNS 服务器
  - 所有域名默认使用这些服务器解析
  - 可以混合使用不同类型的 DNS 服务器

## 后备 DNS 服务器

```yaml
dns:
  fallback:
    - tls://8.8.4.4:853
    - tls://1.1.1.1:853
    - https://cloudflare-dns.com/dns-query
```

- `fallback`: 备用 DNS 解析服务器
  - 当主 DNS 服务器解析结果可能被污染时使用
  - 通常配置为国外可靠的 DNS 服务器
  - 配合 `fallback-filter` 使用效果更佳

## 代理节点 DNS 服务器

```yaml
dns:
  proxy-server-nameserver:
    - https://doh.pub/dns-query
```

- `proxy-server-nameserver`: 专用于解析代理节点域名的 DNS 服务器
  - 仅用于解析代理节点的域名
  - 避免代理节点域名解析与普通域名解析相互影响
  - 解决"先有鸡还是先有蛋"的问题

## 直连 DNS 服务器

```yaml
dns:
  direct-nameserver:
    - system
  direct-nameserver-follow-policy: false
```

- `direct-nameserver`: 用于直连出口域名解析的 DNS 服务器
  - 专门用于解析直连的域名
  - 可以使用 `system` 表示使用系统 DNS

- `direct-nameserver-follow-policy`: 是否遵循域名策略
  - `true`: 遵循 `nameserver-policy` 设置
  - `false`: 不遵循 (默认)
  - 仅当 `direct-nameserver` 不为空时生效

## 支持的 DNS 服务器类型

### 普通 DNS (UDP/TCP)

```yaml
nameserver:
  - 223.5.5.5          # 简写形式，使用 UDP
  - udp://223.5.5.5    # 显式指定 UDP
  - tcp://8.8.8.8      # 使用 TCP
```

- 支持 UDP 和 TCP 协议
- UDP 是最基本的 DNS 协议，速度快但可能被劫持
- TCP 更可靠但速度稍慢

### DNS over TLS (DoT)

```yaml
nameserver:
  - tls://dns.google:853
  - tls://1.1.1.1:853
```

- 使用 TLS 加密的 DNS 协议
- 提供数据传输加密，防止中间人攻击
- 默认端口为 853

### DNS over HTTPS (DoH)

```yaml
nameserver:
  - https://doh.pub/dns-query
  - https://dns.google/dns-query
  - https://cloudflare-dns.com/dns-query
```

- 使用 HTTPS 协议的加密 DNS
- 可以绕过一些网络限制
- 支持 HTTP/2 和 HTTP/3 (需开启 `prefer-h3`)

### DNS over QUIC (DoQ)

```yaml
nameserver:
  - quic://dns.adguard.com:784
  - quic://dns.quad9.net:784
```

- 使用 QUIC 协议的 DNS
- 提供更低延迟和更好的连接迁移
- 默认端口为 784

### 系统 DNS

```yaml
nameserver:
  - system
```

- 使用操作系统的默认 DNS 设置
- 简单但可能受到系统限制

### DHCP DNS

```yaml
nameserver:
  - dhcp://en0          # 指定网络接口
  - dhcp://system       # 使用系统 DHCP 分配的 DNS (仅 cmfa)
```

- 使用 DHCP 获取的 DNS 服务器
- 仅在特定系统上支持

### 自定义返回码

```yaml
nameserver:
  - rcode://success            # 无错误
  - rcode://format_error       # 格式错误
  - rcode://server_failure     # 服务器失败
  - rcode://name_error         # 不存在的域名
  - rcode://not_implemented    # 未实现
  - rcode://refused            # 查询被拒绝
```

- 返回指定的 DNS 响应码
- 用于特殊场景或测试

## DNS 服务器附加参数

可以通过附加参数修改 DNS 服务器的行为，使用 `#` 附加，使用 `&` 连接不同参数：

```yaml
nameserver:
  - 'tls://dns.google#proxy'                                # 通过代理连接
  - 'https://dns.cloudflare.com/dns-query#h3=true'          # 强制 HTTP/3
  - 'https://doh.pub/dns-query#skip-cert-verify=true'       # 跳过证书验证
  - 'https://8.8.8.8/dns-query#ecs=1.1.1.1/24'              # 设置 ECS
  - 'https://dns.google/dns-query#ecs=1.1.1.1/24&h3=true'   # 组合多个参数
```

### 支持的附加参数

| 参数 | 描述 | 适用类型 |
|------|------|---------|
| `proxy` | 通过代理连接 | 所有类型 |
| `interface` | 指定网络接口 | 所有类型 |
| `h3=true` | 强制使用 HTTP/3 | DOH |
| `skip-cert-verify=true` | 跳过证书验证 | DOH/DOT |
| `ecs=IP/掩码` | 设置 EDNS Client Subnet | DOH |
| `ecs-override=true` | 强制覆盖 ECS | DOH |

## 配置示例

```yaml
dns:
  default-nameserver:
    - 223.5.5.5
    - 119.29.29.29
  
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
  
  fallback:
    - tls://8.8.4.4:853
    - tls://1.1.1.1:853
    - 'https://cloudflare-dns.com/dns-query#h3=true'
  
  proxy-server-nameserver:
    - https://doh.pub/dns-query
  
  direct-nameserver:
    - system
```

此配置提供了分层的 DNS 解析策略，适合大多数用户使用。 