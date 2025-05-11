# Fake-IP 配置

Fake-IP 是一种特殊的 DNS 解析模式，它为域名分配虚拟 IP 地址，提高网络性能并减少 DNS 泄露。本节详细介绍 Fake-IP 的相关配置。

## Fake-IP 范围

```yaml
dns:
  fake-ip-range: 198.18.0.1/16
```

- `fake-ip-range`: 指定 Fake-IP 的地址池范围
  - 默认值: `198.18.0.1/16`
  - 建议使用保留地址段，避免与实际网络冲突
  - 此值同时也用作 TUN 模式的默认 IPv4 地址参考

## 过滤模式

```yaml
dns:
  fake-ip-filter-mode: blacklist  # 或 whitelist
```

- `fake-ip-filter-mode`: 控制 Fake-IP 过滤器的工作模式
  - `blacklist`: 黑名单模式，匹配的域名不使用 Fake-IP (默认)
  - `whitelist`: 白名单模式，只有匹配的域名才使用 Fake-IP

## 过滤规则

```yaml
dns:
  fake-ip-filter:
    - '*.lan'
    - '*.local'
    - '*.stun.*.*'
    - '*.stun.*.*.*'
    - '*.stun.*.*.*.*'
    - 'time.*.com'
    - 'time.*.gov'
    - 'time.*.edu.cn'
    - 'time.*.apple.com'
    - 'time1.*.com'
    - 'time2.*.com'
    - 'time3.*.com'
    - 'time4.*.com'
    - 'time5.*.com'
    - 'time6.*.com'
    - 'time7.*.com'
    - 'ntp.*.com'
    - 'ntp1.*.com'
    - 'ntp2.*.com'
    - 'ntp3.*.com'
    - 'ntp4.*.com'
    - 'ntp5.*.com'
    - 'ntp6.*.com'
    - 'ntp7.*.com'
    - '*.time.edu.cn'
    - '*.ntp.org.cn'
    - '+.pool.ntp.org'
    - 'time1.cloud.tencent.com'
    - 'speedtest.cros.wr.pvp.net'
    - 'localhost.ptlogin2.qq.com'
```

- `fake-ip-filter`: 指定哪些域名适用于过滤规则
  - 在黑名单模式下，匹配的域名将不会使用 Fake-IP 映射
  - 在白名单模式下，只有匹配的域名才会使用 Fake-IP 映射
  - 支持域名通配符和规则集引用

## 为什么需要过滤某些域名？

某些应用和服务对 DNS 解析结果有特殊要求，通过 Fake-IP 过滤可以解决以下问题：

1. **时间同步服务**: NTP 服务通常需要真实 IP
2. **本地网络设备**: 如 `.lan` 和 `.local` 域名通常指向本地设备
3. **STUN 服务**: 用于 NAT 穿透的服务需要真实 IP
4. **P2P 应用**: 点对点应用通常需要真实 IP 地址
5. **特定游戏和应用**: 某些应用需要真实 IP 才能正常工作

## 配置示例

### 基础 Fake-IP 配置

```yaml
dns:
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter:
    - '*.lan'
    - '*.local'
    - 'localhost.ptlogin2.qq.com'
```

### 白名单模式配置

```yaml
dns:
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter-mode: whitelist
  fake-ip-filter:
    - '*.baidu.com'
    - '*.qq.com'
    - '*.taobao.com'
    - '*.jd.com'
```

### 游戏优化配置

```yaml
dns:
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter-mode: blacklist
  fake-ip-filter:
    - '*.lan'
    - '*.local'
    - '*.stun.*.*'
    - 'stun.*.*'
    - 'stun.*.*.*'
    - '*.stun.*.*.*'
    - '*.stun.*.*.*.*'
    - 'speedtest.cros.wr.pvp.net'  # 英雄联盟延迟测试
    - '*.3g.qq.com'
    - '*.3g.163.com'
    - '*.edge.pubgmobile.com'  # PUBG Mobile
    - 'battleground.*'
```

## Fake-IP 模式下的 TUN 设置

在 TUN 模式下使用 Fake-IP 时，需要注意以下配置：

```yaml
tun:
  enable: true
  stack: system
  dns-hijack:
    - any:53
  auto-route: true
  
dns:
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter:
    - '*.lan'
    - 'localhost.ptlogin2.qq.com'
```

- TUN 模式下推荐使用 Fake-IP 模式以获得最佳性能
- `auto-route` 会自动为 `fake-ip-range` 添加路由

## 常见问题

### 某些应用无法连接

如果在使用 Fake-IP 模式时，某些应用无法正常连接，请尝试：

1. 将相关域名添加到 `fake-ip-filter` 列表中
2. 检查应用是否依赖真实 IP 地址
3. 尝试切换到 `redir-host` 模式测试

### 游戏延迟检测不准确

某些游戏的延迟检测可能在 Fake-IP 模式下不准确，将相关域名添加到过滤列表中：

```yaml
fake-ip-filter:
  - 'speedtest.cros.wr.pvp.net'  # 英雄联盟延迟测试
  - '*.3g.qq.com'
  - '*.edge.pubgmobile.com'
```

### IP 冲突

如果 `fake-ip-range` 与您的局域网 IP 范围冲突，请修改为其他保留地址范围：

```yaml
# 可选的替代范围
fake-ip-range: 192.0.2.1/24    # TEST-NET-1
fake-ip-range: 198.51.100.1/24 # TEST-NET-2
fake-ip-range: 203.0.113.1/24  # TEST-NET-3
```

通过合理配置 Fake-IP，您可以在提高性能的同时保证应用的兼容性。 