# 全局配置

全局配置定义了 Pharos Pro 的基本行为和特性。这些设置会影响整个应用程序的运行方式。

## 基本设置

```yaml
# HTTP(S) 混合端口
mixed-port: 7890

# 允许局域网连接
allow-lan: true

# 绑定地址
bind-address: '*'

# 运行模式: rule（规则）/ global（全局代理）/ direct（全局直连）
mode: rule

# 日志级别: info / warning / error / debug / silent
log-level: info

# 外部控制器
external-controller: 127.0.0.1:9090

# 外部控制器密钥
secret: ""
```

## 运行模式说明

### `rule` 模式
根据规则列表进行流量分发，这是最常用的模式。您可以自定义规则来决定哪些流量走代理，哪些流量直连。

### `global` 模式
除局域网和中国大陆IP以外的所有流量都走代理。

### `direct` 模式
所有流量都不经过代理，相当于关闭代理功能。

## IPv6 设置

```yaml
# 是否启用 IPv6
ipv6: false
```

启用 IPv6 后，DNS 解析和连接将支持 IPv6。如果您的网络环境不支持 IPv6，建议保持关闭状态。

## 接口设置

```yaml
# 入站接口名称（仅 macOS 和 Linux）
interface-name: en0

# 出站接口名称（仅 macOS 和 Linux）
routing-mark: 23333
```

这些设置通常只在特定环境下需要配置，大多数用户可以忽略。

## 流量统计

```yaml
# 启用流量统计
traffic-statistics: true

# 统计检查间隔（秒）
traffic-check-interval: 60
```

启用流量统计后，可以在控制面板查看每个连接的流量使用情况。

## TUN 模式

```yaml
tun:
  enable: true
  stack: system # gvisor / lwip / system
  auto-route: true
  auto-detect-interface: true
  dns-hijack:
    - any:53
```

TUN 模式可以拦截所有流量而无需设置系统代理，对于无法设置系统代理的应用特别有用。

## 高级设置

```yaml
# 是否启用进程过滤（仅支持特定平台）
process-filter: true

# 优先使用 IPv4
prefer-ipv4: true

# TCP 并发连接数
tcp-concurrent: true

# 自定义证书（用于 MITM 功能）
custom-cert:
  enable: false
  path: /path/to/cert.pem

# 自定义文件系统路径
file-system:
  rule-set-path: ./rule-sets
  script-path: ./scripts
```

## 常见问题

### 端口被占用？

如果设置的端口已被其他程序占用，Pharos Pro 将无法启动。请尝试修改端口或关闭占用端口的程序。

### 日志级别如何选择？

- 日常使用推荐 `info` 级别
- 排查问题推荐 `debug` 级别
- 追求性能可以使用 `silent` 级别

### 为什么建议关闭 IPv6？

在许多网络环境中，IPv6 配置不完善可能导致连接问题。除非您确定网络环境完全支持 IPv6，否则建议关闭此选项。

## 配置示例

```yaml
mixed-port: 7890
allow-lan: true
bind-address: '*'
mode: rule
log-level: info
external-controller: 127.0.0.1:9090
secret: ""
ipv6: false
traffic-statistics: true
traffic-check-interval: 60

tun:
  enable: true
  stack: system
  auto-route: true
  auto-detect-interface: true
  dns-hijack:
    - any:53
```
