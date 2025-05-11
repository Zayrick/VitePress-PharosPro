# DNS 解析模式

Pharos Pro 提供两种 DNS 解析模式：`redir-host` 和 `fake-ip`。这两种模式各有优缺点，适用于不同的场景。

## 模式设置

```yaml
dns:
  enhanced-mode: fake-ip  # 或 redir-host
```

## Redir-Host 模式

`redir-host` 模式是一种直接使用真实 IP 地址的模式。

### 工作原理

1. Pharos 解析域名获取真实 IP
2. 使用真实 IP 建立连接
3. 应用程序能够获取到域名的真实 IP 地址

### 优点

- 兼容性好，几乎所有应用都能正常工作
- 客户端可以获取到目标的真实 IP
- 适合需要知道目标真实 IP 的场景

### 缺点

- 性能可能低于 `fake-ip` 模式
- 每个连接前都需要等待 DNS 解析完成
- 在特定网络环境下可能有 DNS 泄露风险

### 适用场景

- 需要与系统服务兼容
- 应用程序依赖真实 IP 工作
- 简单网络环境

## Fake-IP 模式

`fake-ip` 模式使用虚拟 IP 地址替代真实 IP，可以提高性能并减少 DNS 泄露。

### 工作原理

1. Pharos 为域名分配一个虚拟 IP (来自预设的 IP 池)
2. 应用程序使用虚拟 IP 建立连接
3. Pharos 拦截连接请求，根据虚拟 IP 映射找到真实域名
4. Pharos 解析域名获取真实 IP 并建立连接

### 优点

- 性能更好，减少连接延迟
- 更好的防止 DNS 泄露
- 避免重复的 DNS 查询
- 能处理一些复杂的 DNS 投毒场景

### 缺点

- 部分应用可能不兼容
- 某些依赖真实 IP 的应用可能无法正常工作
- 需要额外的配置来排除特定域名

### 适用场景

- 追求最佳性能
- 移动设备或网络受限环境
- 需要更好隐私保护的场景

## 配置实例对比

### Redir-Host 配置

```yaml
dns:
  enhanced-mode: redir-host
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
  fallback:
    - tls://8.8.4.4
    - tls://1.1.1.1
  fallback-filter:
    geoip: true
    geoip-code: CN
```

### Fake-IP 配置

```yaml
dns:
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter:
    - '*.lan'
    - localhost.ptlogin2.qq.com
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
  fallback:
    - tls://8.8.4.4
    - tls://1.1.1.1
```

## 选择适合您的模式

- 追求性能和隐私：选择 `fake-ip` 模式
- 追求兼容性：选择 `redir-host` 模式
- 如果使用 `fake-ip` 模式遇到问题，可以尝试将问题域名添加到 `fake-ip-filter` 列表中

大多数移动设备和现代应用推荐使用 `fake-ip` 模式以获得最佳性能。 