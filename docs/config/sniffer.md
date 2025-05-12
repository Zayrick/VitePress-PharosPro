# 域名嗅探 (Sniffer)

域名嗅探功能允许 Pharos Pro 通过分析流量特征来提取域名信息，特别是在某些情况下无法直接获取域名的场景下非常有用。

## 基本配置

```yaml
sniffer:
  enable: false
  force-dns-mapping: true
  parse-pure-ip: true
  override-destination: false
  sniff:
    HTTP:
      ports: [80, 8080-8880]
      override-destination: true
    TLS:
      ports: [443, 8443]
    QUIC:
      ports: [443, 8443]
  force-domain:
    - +.v2ex.com
  skip-domain:
    - Mijia Cloud
  skip-src-address:
    - 192.168.0.3/32
  skip-dst-address:
    - 192.168.0.3/32
```

## 核心配置项

### enable

```yaml
enable: false
```

- 用途：是否启用域名嗅探功能
- 默认值：`false`
- 推荐：根据实际需要开启，如果遇到某些网站无法正确代理，可以尝试开启此功能

### force-dns-mapping

```yaml
force-dns-mapping: true
```

- 用途：对 redir-host 类型识别的流量进行强制嗅探
- 默认值：`true`
- 作用：即使已经通过 DNS 解析获取到域名信息，也强制进行嗅探以确保准确性

### parse-pure-ip

```yaml
parse-pure-ip: true
```

- 用途：对所有未获取到域名的流量进行强制嗅探
- 默认值：`true`
- 作用：当流量目标是纯 IP 地址（没有域名信息）时，尝试从流量中提取域名

### override-destination

```yaml
override-destination: false
```

- 用途：是否使用嗅探结果作为实际访问地址
- 默认值：`true`
- 作用：当设为 `true` 时，会将嗅探到的域名解析结果用于实际连接，可以解决一些 DNS 污染问题

## 协议嗅探配置

```yaml
sniff:
  HTTP:
    ports: [80, 8080-8880]
    override-destination: true
  TLS:
    ports: [443, 8443]
  QUIC:
    ports: [443, 8443]
```

域名嗅探功能支持对以下协议进行嗅探：

### HTTP

- 默认端口：80, 8080-8880
- 可以单独设置 `override-destination` 覆盖全局设置

### TLS (HTTPS)

- 默认端口：443, 8443
- 用于从 TLS 握手中提取域名信息

### QUIC

- 默认端口：443, 8443
- 用于从 QUIC 协议中提取域名信息

每个协议配置包含：
- `ports`: 要嗅探的端口范围，可以是单个端口或端口范围
- `override-destination`: (可选) 覆盖全局 `override-destination` 设置

## 域名过滤配置

### force-domain

```yaml
force-domain:
  - +.v2ex.com
```

- 用途：强制进行嗅探的域名列表
- 格式：支持域名通配符语法（同[域名通配符](./syntax/wildcards.md)）
- 作用：即使不满足常规嗅探条件，也会对这些域名进行嗅探

### skip-domain

```yaml
skip-domain:
  - Mijia Cloud
```

- 用途：跳过嗅探的域名列表
- 格式：支持域名通配符语法
- 作用：对于特定域名，不进行嗅探操作，可以优化性能或解决特定域名嗅探问题

## IP 地址过滤配置

### skip-src-address

```yaml
skip-src-address:
  - 192.168.0.3/32
```

- 用途：跳过嗅探的来源 IP 段列表
- 格式：CIDR 格式（IP/掩码长度）
- 作用：对指定来源 IP 地址的流量不进行嗅探

### skip-dst-address

```yaml
skip-dst-address:
  - 192.168.0.3/32
```

- 用途：跳过嗅探的目标 IP 段列表
- 格式：CIDR 格式（IP/掩码长度）
- 作用：对指定目标 IP 地址的流量不进行嗅探

## 使用场景

1. **解决 DNS 污染问题**：通过嗅探实际流量中的域名，绕过 DNS 污染
2. **提高代理准确性**：某些情况下客户端可能使用错误的 DNS 解析结果，嗅探可以纠正
3. **优化 MITM 拦截**：为中间人攻击提供准确的域名信息
4. **处理无域名流量**：对直接使用 IP 地址访问的流量提取可能的域名信息

## 注意事项

1. 开启域名嗅探可能会增加一定的系统资源消耗
2. 对于高性能需求的环境，可以适当调整嗅探规则减少不必要的嗅探
3. 某些特殊应用的流量可能会导致嗅探结果不准确，可以使用 `skip-domain` 排除
4. 当遇到特定网站代理问题时，可以尝试调整 `force-domain` 和相关设置
