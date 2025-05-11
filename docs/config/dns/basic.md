# DNS 基本配置

本节介绍 DNS 配置中最常用的基本设置项，这些选项决定了 DNS 解析的基础行为。

## 启用 DNS

```yaml
dns:
  enable: true
```

- `enable`: 控制是否启用 DNS 解析功能
  - `true`: 启用自定义 DNS 解析
  - `false`: 使用系统 DNS 解析

## 监听地址

```yaml
dns:
  listen: 0.0.0.0:1053
```

- `listen`: 指定 DNS 服务监听的地址和端口
  - 格式: `IP:端口`
  - 支持 UDP 和 TCP (自动同时支持)
  - 默认监听所有接口 (`0.0.0.0`)

## IPv6 解析

```yaml
dns:
  ipv6: false
```

- `ipv6`: 控制是否解析 IPv6 地址
  - `true`: 解析 IPv6 地址
  - `false`: 不解析 IPv6 地址，对 AAAA 请求返回空解析
  - 如果您的网络环境不支持 IPv6，建议设置为 `false`

## 增强模式

```yaml
dns:
  enhanced-mode: fake-ip
```

- `enhanced-mode`: DNS 处理模式
  - 可选值: `fake-ip` / `redir-host`
  - 默认值: `redir-host`
  - 详细说明请参阅 [解析模式](./modes.md)

## DNS 缓存算法

```yaml
dns:
  cache-algorithm: arc
```

- `cache-algorithm`: DNS 结果缓存的算法
  - 支持的算法:
    - `lru`: 最近最少使用算法 (默认值)
    - `arc`: 自适应替换缓存算法 (推荐)
  - ARC 算法通常能提供更好的缓存命中率

## 系统 Hosts 集成

```yaml
dns:
  use-hosts: true
  use-system-hosts: true
```

- `use-hosts`: 是否使用配置中的 hosts
  - `true`: 启用 (默认)
  - `false`: 禁用
  
- `use-system-hosts`: 是否读取系统 hosts 文件
  - `true`: 启用 (默认)
  - `false`: 禁用

## H3 优先

```yaml
dns:
  prefer-h3: false
```

- `prefer-h3`: DOH 是否优先使用 HTTP/3 协议
  - `true`: 优先使用 HTTP/3
  - `false`: 使用默认 HTTP 协议 (默认)
  - 启用可能提高 DOH 响应速度，但需要服务器支持

## 遵循规则

```yaml
dns:
  respect-rules: false
```

- `respect-rules`: DNS 连接是否遵守路由规则
  - `true`: 遵守路由规则
  - `false`: 不遵守 (默认)
  - 启用此选项需要配置 `proxy-server-nameserver`
  - 不建议与 `prefer-h3` 一起使用

## 配置示例

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
  enhanced-mode: fake-ip
```

以上设置提供了基本的 DNS 功能配置，这些是搭建 DNS 服务所必须的基础选项。更复杂的配置请参考其他小节。 