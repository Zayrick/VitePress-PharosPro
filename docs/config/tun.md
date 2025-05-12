# TUN 配置

TUN 是一种虚拟网络设备，允许 Pharos Pro 直接处理操作系统级别的网络流量。通过 TUN 模式，可以实现全局代理，无需为每个应用单独配置代理设置。

## 基本配置

```yaml
tun:
  enable: true
  stack: system
  auto-route: true
  auto-redirect: true
  auto-detect-interface: true
  dns-hijack:
    - any:53
    - tcp://any:53
  device: utun0
  mtu: 9000
  strict-route: true
  gso: true
  gso-max-size: 65536
  udp-timeout: 300
  iproute2-table-index: 2022
  iproute2-rule-index: 9000
  endpoint-independent-nat: false
  route-address-set:
    - ruleset-1
  route-exclude-address-set:
    - ruleset-2
  route-address:
    - 0.0.0.0/1
    - 128.0.0.0/1
    - "::/1"
    - "8000::/1"
  route-exclude-address:
    - 192.168.0.0/16
    - fc00::/7
  include-interface:
    - eth0
  exclude-interface:
    - eth1
  include-uid:
    - 0
  include-uid-range:
    - 1000:9999
  exclude-uid:
    - 1000
  exclude-uid-range:
    - 1000:9999
  include-android-user:
    - 0
    - 10
  include-package:
    - com.android.chrome
  exclude-package:
    - com.android.captiveportallogin
```

## 核心配置项

### enable

```yaml
enable: true
```

- 用途：启用或禁用 TUN 功能
- 默认值：`false`
- 说明：设置为 `true` 时启用 TUN 设备

### stack

```yaml
stack: system
```

- 用途：指定 TUN 模式使用的网络协议栈
- 可选值：`system`、`gvisor`、`mixed`
- 默认值：`gvisor`
- 说明：
  - `system`：使用系统协议栈，可以提供更稳定和全面的 TUN 体验，占用资源相对更低
  - `gvisor`：在用户空间实现网络协议栈，提供更高的安全性和隔离性，在特定情况下具有更好的网络处理性能
  - `mixed`：混合栈，TCP 使用 system 栈，UDP 使用 gvisor 栈，使用体验相对更好

::: tip 协议栈选择建议
如无特殊要求，建议使用 `mixed` 栈，兼顾了性能和稳定性
:::

::: warning 防火墙配置
如果开启了防火墙，可能无法使用 system 和 mixed 协议栈，需要进行以下配置：
- Windows: 设置 -> Windows 安全中心 -> 允许应用通过防火墙 -> 选中内核
- MacOS: 一般无需配置，防火墙默认放行签名软件。如果遇到问题，可以尝试放行：系统设置 -> 网络 -> 防火墙 -> 选项 -> 添加 mihomo app
- Linux: 一般无需配置，如果遇到问题，可以尝试放行 TUN 网卡出站流量：`sudo iptables -A OUTPUT -o Mihomo -j ACCEPT`（假设 TUN 网卡名为 Mihomo）
:::

### device

```yaml
device: utun0
```

- 用途：指定 TUN 网卡的名称
- 默认值：自动分配
- 说明：在 macOS 平台上，设备名只能使用以 "utun" 开头的名称

### 路由控制

#### auto-route

```yaml
auto-route: true
```

- 用途：自动设置全局路由
- 默认值：`false`
- 说明：启用后将自动将全局流量路由进入 TUN 网卡

#### auto-redirect

```yaml
auto-redirect: true
```

- 用途：自动配置流量重定向
- 默认值：`false`
- 说明：
  - 仅支持 Linux 平台
  - 自动配置 iptables/nftables 以重定向 TCP 连接
  - 需要 `auto-route` 已启用
  - 在 Android 中：仅转发本地 IPv4 连接
  - 在 Linux 中：结合 `auto-route` 可以在路由器上按预期工作

#### auto-detect-interface

```yaml
auto-detect-interface: true
```

- 用途：自动选择流量出口接口
- 默认值：`false`
- 说明：多出口网卡同时连接的设备建议手动指定出口网卡

#### strict-route

```yaml
strict-route: true
```

- 用途：启用严格的路由规则
- 默认值：`false`
- 说明：
  - 在 Linux 中：
    - 让不支持的网络无法到达
    - 将所有连接路由到 TUN
    - 防止地址泄露，使 DNS 劫持在 Android 上工作
  - 在 Windows 中：
    - 添加防火墙规则以阻止 Windows 的普通多宿主 DNS 解析行为造成的 DNS 泄露
    - 可能会使某些应用程序（如 VirtualBox）在某些情况下无法正常工作

### DNS 配置

#### dns-hijack

```yaml
dns-hijack:
  - any:53
  - tcp://any:53
```

- 用途：DNS 劫持
- 默认值：无
- 说明：
  - 将匹配到的连接导入内部 DNS 模块
  - 不书写协议则默认为 `udp://`
  - 在 macOS/Windows 无法自动劫持发往局域网的 DNS 请求
  - 在 Android 如开启"私人 DNS"则无法自动劫持 DNS 请求

### 性能优化

#### mtu

```yaml
mtu: 9000
```

- 用途：设置最大传输单元
- 默认值：9000
- 说明：影响极限状态下的网络速率，一般用户使用默认值即可

#### gso

```yaml
gso: true
```

- 用途：启用通用分段卸载
- 默认值：`false`
- 说明：仅支持 Linux 平台

#### gso-max-size

```yaml
gso-max-size: 65536
```

- 用途：设置数据块的最大长度
- 默认值：65536
- 说明：与 `gso` 配合使用

#### udp-timeout

```yaml
udp-timeout: 300
```

- 用途：UDP NAT 过期时间
- 默认值：300（秒）
- 说明：UDP 连接在指定时间内无活动后会被关闭，单位为秒（5分钟）

### 高级路由配置

#### iproute2-table-index

```yaml
iproute2-table-index: 2022
```

- 用途：设置 iproute2 路由表索引
- 默认值：2022
- 说明：`auto-route` 生成的 iproute2 路由表索引

#### iproute2-rule-index

```yaml
iproute2-rule-index: 9000
```

- 用途：设置 iproute2 规则起始索引
- 默认值：9000
- 说明：`auto-route` 生成的 iproute2 规则起始索引

#### endpoint-independent-nat

```yaml
endpoint-independent-nat: false
```

- 用途：启用独立于端点的 NAT
- 默认值：`false`
- 说明：启用后性能可能会略有下降，不建议在不需要的时候开启

### 路由规则配置

#### route-address-set

```yaml
route-address-set:
  - ruleset-1
```

- 用途：将指定规则集中的目标 IP CIDR 规则添加到防火墙
- 默认值：无
- 说明：
  - 仅支持 Linux，且需要 nftables 以及 `auto-route` 和 `auto-redirect` 已启用
  - 与任意配置中的 `routing-mark` 冲突
  - 不匹配的流量将绕过路由

#### route-exclude-address-set

```yaml
route-exclude-address-set:
  - ruleset-2
```

- 用途：将指定规则集中的目标 IP CIDR 规则添加到防火墙
- 默认值：无
- 说明：
  - 仅支持 Linux，且需要 nftables 以及 `auto-route` 和 `auto-redirect` 已启用
  - 与任意配置中的 `routing-mark` 冲突
  - 匹配的流量将绕过路由

#### route-address

```yaml
route-address:
  - 0.0.0.0/1
  - 128.0.0.0/1
  - "::/1"
  - "8000::/1"
```

- 用途：启用 `auto-route` 时路由自定义网段而不是默认路由
- 默认值：无
- 说明：一般无需配置

#### route-exclude-address

```yaml
route-exclude-address:
  - 192.168.0.0/16
  - fc00::/7
```

- 用途：启用 `auto-route` 时排除自定义网段
- 默认值：无
- 说明：用于指定不需要通过 TUN 路由的网络

### 接口过滤

#### include-interface

```yaml
include-interface:
  - eth0
```

- 用途：限制被路由的接口
- 默认值：无（不限制）
- 说明：与 `exclude-interface` 冲突，不可一起配置

#### exclude-interface

```yaml
exclude-interface:
  - eth1
```

- 用途：排除路由的接口
- 默认值：无
- 说明：与 `include-interface` 冲突，不可一起配置

### 用户过滤（Linux 平台）

::: warning 注意
以下 UID 过滤规则仅在 Linux 平台下被支持，且需要启用 `auto-route`
:::

#### include-uid

```yaml
include-uid:
  - 0
```

- 用途：包含的用户 ID，使其流量被 TUN 路由
- 默认值：无（不限制）
- 说明：未被配置的用户不会被 TUN 路由流量

#### include-uid-range

```yaml
include-uid-range:
  - 1000:9999
```

- 用途：包含的用户 ID 范围，使其流量被 TUN 路由
- 默认值：无
- 说明：指定 UID 范围，格式为"起始UID:结束UID"

#### exclude-uid

```yaml
exclude-uid:
  - 1000
```

- 用途：排除特定用户 ID，使其流量不被 TUN 路由
- 默认值：无
- 说明：优先级高于包含规则

#### exclude-uid-range

```yaml
exclude-uid-range:
  - 1000:9999
```

- 用途：排除特定用户 ID 范围，使其流量不被 TUN 路由
- 默认值：无
- 说明：指定 UID 范围，格式为"起始UID:结束UID"

### Android 平台特定配置

::: warning 注意
以下 Android 用户和应用规则仅在 Android 平台下被支持，且需要启用 `auto-route`
:::

#### include-android-user

```yaml
include-android-user:
  - 0
  - 10
```

- 用途：包含的 Android 用户，使其流量被 TUN 路由
- 默认值：无
- 说明：未被配置的用户不会被 TUN 路由流量

常见 Android 用户 ID：
| 用户类型 | ID |
|----------|------|
| 机主     | 0    |
| 手机分身 | 10   |
| 应用多开 | 999  |

#### include-package

```yaml
include-package:
  - com.android.chrome
```

- 用途：包含的 Android 应用包名，使其流量被 TUN 路由
- 默认值：无
- 说明：未配置的应用包不会被 TUN 路由流量

#### exclude-package

```yaml
exclude-package:
  - com.android.captiveportallogin
```

- 用途：排除 Android 应用包名，使其流量不被 TUN 路由
- 默认值：无
- 说明：优先级高于包含规则

## 旧版配置项（即将废弃）

以下配置项为旧版写法，将在未来版本中废弃，建议使用新版配置。

### inet4-route-address

```yaml
inet4-route-address:
  - 0.0.0.0/1
  - 128.0.0.0/1
```

- 用途：启用 `auto-route` 时路由自定义网段而不是默认路由
- 替代为：`route-address`

### inet6-route-address

```yaml
inet6-route-address:
  - "::/1"
  - "8000::/1"
```

- 用途：启用 `auto-route` 时路由自定义网段而不是默认路由
- 替代为：`route-address`

### inet4-route-exclude-address

```yaml
inet4-route-exclude-address:
  - 192.168.0.0/16
```

- 用途：启用 `auto-route` 时排除自定义网段
- 替代为：`route-exclude-address`

### inet6-route-exclude-address

```yaml
inet6-route-exclude-address:
  - fc00::/7
```

- 用途：启用 `auto-route` 时排除自定义网段
- 替代为：`route-exclude-address`

## 协议栈网络性能对比

不同协议栈在网络性能上存在差异。以下是在 Linux 平台上进行的网络回环测试结果，仅供参考（Windows 和 macOS 可能会有差异）：

### System 协议栈性能测试
```
Connecting to host 127.0.0.1.sslip.io, port 5201
[  5] local 28.0.0.1 port 37454 connected to 28.0.0.155 port 5201
[ ID] Interval           Transfer     Bitrate         Retr  Cwnd
[  5]   0.00-1.00   sec   829 MBytes  6.95 Gbits/sec    0   3.17 MBytes
[  5]   1.00-2.00   sec   894 MBytes  7.50 Gbits/sec    0   3.17 MBytes
[  5]   2.00-3.00   sec   846 MBytes  7.10 Gbits/sec    0   3.17 MBytes
[  5]   3.00-4.00   sec   941 MBytes  7.90 Gbits/sec    0   3.17 MBytes
[  5]   4.00-5.00   sec   906 MBytes  7.60 Gbits/sec    0   3.17 MBytes
[  5]   5.00-6.00   sec   906 MBytes  7.60 Gbits/sec    0   3.17 MBytes
[  5]   6.00-7.00   sec   768 MBytes  6.43 Gbits/sec    0   3.17 MBytes
[  5]   7.00-8.00   sec   779 MBytes  6.52 Gbits/sec    0   3.17 MBytes
[  5]   8.00-9.00   sec   871 MBytes  7.31 Gbits/sec    0   3.17 MBytes
[  5]   9.00-10.00  sec   847 MBytes  7.12 Gbits/sec    0   3.17 MBytes
[ ID] Interval           Transfer     Bitrate         Retr
[  5]   0.00-10.00  sec  8.34 GBytes  7.17 Gbits/sec    0             sender
[  5]   0.00-10.00  sec  8.34 GBytes  6.97 Gbits/sec                  receiver
```

### Gvisor 协议栈性能测试
```
Connecting to host 127.0.0.1.sslip.io, port 5201
[  5] local 28.0.0.1 port 39988 connected to 28.0.0.155 port 5201
[ ID] Interval           Transfer     Bitrate         Retr  Cwnd
[  5]   0.00-1.00   sec   487 MBytes  4.09 Gbits/sec    0   149 KBytes
[  5]   1.00-2.00   sec   478 MBytes  4.01 Gbits/sec    0   149 KBytes
[  5]   2.00-3.00   sec   490 MBytes  4.12 Gbits/sec    0   149 KBytes
[  5]   3.00-4.00   sec   488 MBytes  4.10 Gbits/sec    0   149 KBytes
[  5]   4.00-5.00   sec   493 MBytes  4.13 Gbits/sec    0   149 KBytes
[  5]   5.00-6.00   sec   478 MBytes  4.01 Gbits/sec    0   149 KBytes
[  5]   6.00-7.00   sec   482 MBytes  4.04 Gbits/sec    0   149 KBytes
[  5]   7.00-8.00   sec   488 MBytes  4.10 Gbits/sec    0   149 KBytes
[  5]   8.00-9.00   sec   493 MBytes  4.13 Gbits/sec    0   149 KBytes
[  5]   9.00-10.00  sec   479 MBytes  4.02 Gbits/sec    0   149 KBytes
[ ID] Interval           Transfer     Bitrate         Retr
[  5]   0.00-10.00  sec  4.79 GBytes  4.11 Gbits/sec    0             sender
[  5]   0.00-10.00  sec  4.79 GBytes  4.11 Gbits/sec                  receiver
```

### Lwip 协议栈性能测试
```
Connecting to host 127.0.0.1.sslip.io, port 5201
[  5] local 28.0.0.1 port 42122 connected to 28.0.0.155 port 5201
[ ID] Interval           Transfer     Bitrate         Retr  Cwnd
[  5]   0.00-1.00   sec  57.5 MBytes   482 Mbits/sec    0   71.3 KBytes
[  5]   1.00-2.00   sec  56.6 MBytes   475 Mbits/sec    0   71.3 KBytes
[  5]   2.00-3.00   sec  52.6 MBytes   442 Mbits/sec    0   71.3 KBytes
[  5]   3.00-4.00   sec  54.7 MBytes   459 Mbits/sec    0   71.3 KBytes
[  5]   4.00-5.00   sec  53.0 MBytes   445 Mbits/sec    0   71.3 KBytes
[  5]   5.00-6.00   sec  53.7 MBytes   450 Mbits/sec    0   71.3 KBytes
[  5]   6.00-7.00   sec  51.9 MBytes   435 Mbits/sec    0   71.3 KBytes
[  5]   7.00-8.00   sec  50.6 MBytes   424 Mbits/sec    0   71.3 KBytes
[  5]   8.00-9.00   sec  50.6 MBytes   424 Mbits/sec    0   71.3 KBytes
[  5]   9.00-10.00  sec  50.6 MBytes   424 Mbits/sec    0   71.3 KBytes
[ ID] Interval           Transfer     Bitrate         Retr
[  5]   0.00-28.17  sec   529 MBytes   158 Mbits/sec    6             sender
[  5]   0.00-28.17  sec     0.00 B     0.00 bits/sec                  receiver
```

从测试结果可以看出：
- **System 栈**：提供了最高的吞吐量，平均约 7.17 Gbits/sec
- **Gvisor 栈**：性能适中，平均约 4.11 Gbits/sec，平衡了性能和安全性
- **Lwip 栈**：性能相对较低，平均约 158 Mbits/sec，且出现了传输错误

## 推荐配置

### 基本 TUN 配置（适用于大多数场景）

```yaml
tun:
  enable: true
  stack: mixed
  auto-route: true
  auto-detect-interface: true
  dns-hijack:
    - any:53
    - tcp://any:53
```

### 严格模式（防止流量泄露）

```yaml
tun:
  enable: true
  stack: system
  auto-route: true
  auto-detect-interface: true
  strict-route: true
  dns-hijack:
    - any:53
    - tcp://any:53
```

### Android 分应用代理

```yaml
tun:
  enable: true
  stack: mixed
  auto-route: true
  auto-detect-interface: true
  dns-hijack:
    - any:53
  include-package:
    - com.android.chrome
    - com.google.android.apps.youtube
    - com.twitter.android
```
