# 入站配置 (Listeners)

入站配置允许 Pharos Pro 作为服务器接收和处理来自其他设备的网络流量。通过配置不同类型的入站监听器，您可以使 Pharos Pro 作为各种代理服务器使用。

::: tip 相关配置
如果您正在寻找简化的代理端口配置（如 `port`, `socks-port`, `mixed-port` 等），请查看[代理端口配置](/config/ports)文档。
:::

## 基本概念

入站配置使用 `listeners` 数组定义，每个入站监听器包含以下基本要素：

- `name`: 入站监听器的唯一名称
- `type`: 入站监听器的类型（如 socks、http、shadowsocks 等）
- `port`: 监听的端口号
- `listen`: 监听的地址（默认为 `0.0.0.0`，表示监听所有网络接口）

## 局域网入站

局域网入站主要用于内网环境中的流量代理，通常不包含加密功能，适用于可信网络环境：

```yaml
listeners:
  - name: socks5-in-1
    type: socks
    port: 10808
    #listen: 0.0.0.0 # 默认监听 0.0.0.0
    # rule: sub-rule-name1 # 默认使用 rules,如果未找到 sub-rule 则直接使用 rules
    # proxy: proxy # 如果不为空则直接将该入站流量交由指定proxy处理
    # udp: false # 默认 true

  - name: http-in-1
    type: http
    port: 10809
    listen: 0.0.0.0
    # rule: sub-rule-name1 # 默认使用 rules,如果未找到 sub-rule 则直接使用 rules
    # proxy: proxy # 如果不为空则直接将该入站流量交由指定proxy处理(当proxy不为空时,这里的proxy名称必须合法,否则会出错)

  - name: mixed-in-1
    type: mixed #  HTTP(S) 和 SOCKS 代理混合
    port: 10810
    listen: 0.0.0.0
    # rule: sub-rule-name1 # 默认使用 rules,如果未找到 sub-rule 则直接使用 rules
    # proxy: proxy # 如果不为空则直接将该入站流量交由指定proxy处理(当proxy不为空时,这里的proxy名称必须合法,否则会出错)
    # udp: false # 默认 true

  - name: reidr-in-1
    type: redir
    port: 10811
    listen: 0.0.0.0
    # rule: sub-rule-name1 # 默认使用 rules,如果未找到 sub-rule 则直接使用 rules
    # proxy: proxy # 如果不为空则直接将该入站流量交由指定proxy处理(当proxy不为空时,这里的proxy名称必须合法,否则会出错)

  - name: tproxy-in-1
    type: tproxy
    port: 10812
    listen: 0.0.0.0
    # rule: sub-rule-name1 # 默认使用 rules,如果未找到 sub-rule 则直接使用 rules
    # proxy: proxy # 如果不为空则直接将该入站流量交由指定proxy处理(当proxy不为空时,这里的proxy名称必须合法,否则会出错)
    # udp: false # 默认 true

  - name: tunnel-in-1
    type: tunnel
    port: 10816
    listen: 0.0.0.0
    # rule: sub-rule-name1 # 默认使用 rules,如果未找到 sub-rule 则直接使用 rules
    # proxy: proxy # 如果不为空则直接将该入站流量交由指定proxy处理(当proxy不为空时,这里的proxy名称必须合法,否则会出错)
    network: [tcp, udp]
    target: target.com

  - name: tun-in-1
    type: tun
    # rule: sub-rule-name1 # 默认使用 rules,如果未找到 sub-rule 则直接使用 rules
    # proxy: proxy # 如果不为空则直接将该入站流量交由指定proxy处理(当proxy不为空时,这里的proxy名称必须合法,否则会出错)
    stack: system # gvisor wip
    dns-hijack:
      - 0.0.0.0:53 # 需要劫持的 DNS
    # auto-detect-interface: false # 自动识别出口网卡
    # auto-route: false # 配置路由表
    # mtu: 9000 # 最大传输单元
    inet4-address: # 必须手动设置ipv4地址段
      - 198.19.0.1/30
    inet6-address: # 必须手动设置ipv6地址段
      - "fdfe:dcba:9877::1/126"
    # strict-route: true # 将所有连接路由到tun来防止泄漏,但你的设备将无法其他设备被访问
    #    inet4-route-address: # 启用 auto-route 时使用自定义路由而不是默认路由
    #      - 0.0.0.0/1
    #      - 128.0.0.0/1
    #    inet6-route-address: # 启用 auto-route 时使用自定义路由而不是默认路由
    #      - "::/1"
    #      - "8000::/1"
    # endpoint-independent-nat: false # 启用独立于端点的 NAT
    # include-uid: # UID 规则仅在 Linux 下被支持,并且需要 auto-route
    # - 0
    # include-uid-range: # 限制被路由的的用户范围
    # - 1000-99999
    # exclude-uid: # 排除路由的的用户
    #- 1000
    # exclude-uid-range: # 排除路由的的用户范围
    # - 1000-99999

    # Android 用户和应用规则仅在 Android 下被支持
    # 并且需要 auto-route

    # include-android-user: # 限制被路由的 Android 用户
    # - 0
    # - 10
    # include-package: # 限制被路由的 Android 应用包名
    # - com.android.chrome
    # exclude-package: # 排除被路由的 Android 应用包名
    # - com.android.captiveportallogin
```

### 局域网入站类型

#### SOCKS 入站 (socks)

提供 SOCKS4/SOCKS5 代理服务：

```yaml
- name: socks5-in-1
  type: socks
  port: 10808
  udp: true # 是否支持 UDP
```

#### HTTP 入站 (http)

提供 HTTP/HTTPS 代理服务：

```yaml
- name: http-in-1
  type: http
  port: 10809
```

#### 混合入站 (mixed)

同时提供 HTTP(S) 和 SOCKS 代理服务，一个端口支持多种协议：

```yaml
- name: mixed-in-1
  type: mixed
  port: 10810
  udp: true # 是否支持 UDP（仅对 SOCKS 部分有效）
```

#### 重定向入站 (redir)

用于透明代理（主要用于 Linux/macOS）：

```yaml
- name: reidr-in-1
  type: redir
  port: 10811
```

#### 透明代理入站 (tproxy)

用于 Linux 下的透明代理：

```yaml
- name: tproxy-in-1
  type: tproxy
  port: 10812
  udp: true # 是否支持 UDP
```

#### 隧道入站 (tunnel)

将所有流量转发到指定目标：

```yaml
- name: tunnel-in-1
  type: tunnel
  port: 10816
  network: [tcp, udp] # 支持的网络类型
  target: target.com # 目标地址
```

#### TUN 入站 (tun)

虚拟网卡模式，可以捕获系统全局流量：

```yaml
- name: tun-in-1
  type: tun
  stack: system # 协议栈类型，支持 system（使用系统协议栈）
  dns-hijack:
    - 0.0.0.0:53 # 劫持的 DNS
  inet4-address: # IPv4 地址段（必须配置）
    - 198.19.0.1/30
  inet6-address: # IPv6 地址段（必须配置）
    - "fdfe:dcba:9877::1/126"
```

TUN 模式提供了更多高级配置选项：

- `auto-detect-interface`: 自动识别出口网卡
- `auto-route`: 自动配置路由表
- `mtu`: 最大传输单元
- `strict-route`: 将所有连接路由到 TUN 接口以防止流量泄漏
- `inet4-route-address`/`inet6-route-address`: 自定义路由地址
- `endpoint-independent-nat`: 启用独立于端点的 NAT
- 用户/应用过滤器（Linux/Android）：
  - `include-uid`/`exclude-uid`: 包含/排除的用户 ID
  - `include-uid-range`/`exclude-uid-range`: 包含/排除的用户 ID 范围
  - `include-android-user`: 包含的 Android 用户
  - `include-package`/`exclude-package`: 包含/排除的 Android 应用包名

## 互联网入站

互联网入站提供加密的代理服务，适用于跨互联网的不受信任环境：

```yaml
listeners:
  - name: shadowsocks-in-1
    type: shadowsocks
    port: 10813
    listen: 0.0.0.0
    # rule: sub-rule-name1 # 默认使用 rules,如果未找到 sub-rule 则直接使用 rules
    # proxy: proxy # 如果不为空则直接将该入站流量交由指定proxy处理(当proxy不为空时,这里的proxy名称必须合法,否则会出错)
    password: vlmpIPSyHH6f4S8WVPdRIHIlzmB+GIRfoH3aNJ/t9Gg=
    cipher: 2022-blake3-aes-256-gcm

  - name: vmess-in-1
    type: vmess
    port: 10814
    listen: 0.0.0.0
    # rule: sub-rule-name1 # 默认使用 rules,如果未找到 sub-rule 则直接使用 rules
    # proxy: proxy # 如果不为空则直接将该入站流量交由指定proxy处理(当proxy不为空时,这里的proxy名称必须合法,否则会出错)
    users:
      - username: 1
        uuid: 9d0cb9d0-964f-4ef6-897d-6c6b3ccf9e68
        alterId: 1

  - name: tuic-in-1
    type: tuic
    port: 10815
    listen: 0.0.0.0
    # rule: sub-rule-name1 # 默认使用 rules，如果未找到 sub-rule 则直接使用 rules
    # proxy: proxy # 如果不为空则直接将该入站流量交由指定proxy处理(当proxy不为空时，这里的proxy名称必须合法，否则会出错)
    # token:    # tuicV4填写（不可同时填写users）
    #   - TOKEN
    # users:    # tuicV5填写（不可同时填写token）
    #   00000000-0000-0000-0000-000000000000: PASSWORD-0
    #   00000000-0000-0000-0000-000000000001: PASSWORD-1
    #  certificate: ./server.crt
    #  private-key: ./server.key
    #  congestion-controller: bbr
    #  max-idle-time: 15000
    #  authentication-timeout: 1000
    #  alpn:
    #    - h3
    #  max-udp-relay-packet-size: 1500
```

### 互联网入站类型

#### Shadowsocks 入站 (shadowsocks)

提供 Shadowsocks 协议代理服务：

```yaml
- name: shadowsocks-in-1
  type: shadowsocks
  port: 10813
  password: vlmpIPSyHH6f4S8WVPdRIHIlzmB+GIRfoH3aNJ/t9Gg=
  cipher: 2022-blake3-aes-256-gcm # 加密方法
```

#### VMess 入站 (vmess)

提供 VMess 协议代理服务：

```yaml
- name: vmess-in-1
  type: vmess
  port: 10814
  users:
    - username: 1
      uuid: 9d0cb9d0-964f-4ef6-897d-6c6b3ccf9e68
      alterId: 1
```

#### TUIC 入站 (tuic)

提供 TUIC 协议代理服务，支持 TUIC v4 和 v5：

```yaml
- name: tuic-in-1
  type: tuic
  port: 10815
  # token:    # tuicV4填写（不可同时填写users）
  #   - TOKEN
  users:    # tuicV5填写（不可同时填写token）
    00000000-0000-0000-0000-000000000000: PASSWORD-0
    00000000-0000-0000-0000-000000000001: PASSWORD-1
  certificate: ./server.crt
  private-key: ./server.key
  congestion-controller: bbr
  max-idle-time: 15000
  authentication-timeout: 1000
  alpn:
    - h3
  max-udp-relay-packet-size: 1500
```

## 入口配置

除了使用 `listeners` 配置入站外，还可以使用简化的入口配置，特别适用于快速设置：

```yaml
# shadowsocks,vmess 入口配置（传入流量将和socks,mixed等入口一样按照mode所指定的方式进行匹配处理）
ss-config: ss://2022-blake3-aes-256-gcm:vlmpIPSyHH6f4S8WVPdRIHIlzmB+GIRfoH3aNJ/t9Gg=@:23456
vmess-config: vmess://1:9d0cb9d0-964f-4ef6-897d-6c6b3ccf9e68@:12345

# tuic服务器入口（传入流量将和socks,mixed等入口一样按照mode所指定的方式进行匹配处理）
tuic-server:
 enable: true
 listen: 127.0.0.1:10443
 token:    # tuicV4填写（不可同时填写users）
   - TOKEN
 users:    # tuicV5填写（不可同时填写token）
   00000000-0000-0000-0000-000000000000: PASSWORD-0
   00000000-0000-0000-0000-000000000001: PASSWORD-1
 certificate: ./server.crt
 private-key: ./server.key
 congestion-controller: bbr
 max-idle-time: 15000
 authentication-timeout: 1000
 alpn:
   - h3
 max-udp-relay-packet-size: 1500
```

### 入口配置类型

#### Shadowsocks 入口 (ss-config)

使用 URI 格式配置 Shadowsocks 入站：

```yaml
ss-config: ss://2022-blake3-aes-256-gcm:vlmpIPSyHH6f4S8WVPdRIHIlzmB+GIRfoH3aNJ/t9Gg=@:23456
```

格式：`ss://加密方式:密码@:端口`

#### VMess 入口 (vmess-config)

使用 URI 格式配置 VMess 入站：

```yaml
vmess-config: vmess://1:9d0cb9d0-964f-4ef6-897d-6c6b3ccf9e68@:12345
```

格式：`vmess://alterId:uuid@:端口`

#### TUIC 服务器入口 (tuic-server)

详细配置 TUIC 服务器：

```yaml
tuic-server:
 enable: true
 listen: 127.0.0.1:10443
 token:    # tuicV4填写（不可同时填写users）
   - TOKEN
 users:    # tuicV5填写（不可同时填写token）
   00000000-0000-0000-0000-000000000000: PASSWORD-0
 certificate: ./server.crt
 private-key: ./server.key
 congestion-controller: bbr
 max-idle-time: 15000
 authentication-timeout: 1000
 alpn:
   - h3
 max-udp-relay-packet-size: 1500
```

## 通用选项

所有入站类型都支持以下通用选项：

- `rule`: 指定此入站使用的子规则名称，如果未找到子规则则使用全局规则
- `proxy`: 如果不为空，则直接将该入站流量交由指定代理处理（需确保代理名称存在）

::: warning 注意
使用 `proxy` 选项时，确保指定的代理名称在配置中存在，否则会导致错误
:::

## 使用场景

### 内网代理服务器

在家庭或办公网络中设置代理服务器，允许其他设备通过 Pharos Pro 连接：

```yaml
listeners:
  - name: mixed-proxy
    type: mixed
    port: 7890
    listen: 0.0.0.0
    udp: true
```

### 透明代理网关

将 Pharos Pro 设置为网关，透明代理所有经过的流量：

```yaml
listeners:
  - name: transparent-gateway
    type: tproxy
    port: 7893
    listen: 0.0.0.0
    udp: true
```

### VPN 模式

使用 TUN 模式捕获系统所有流量，实现类似 VPN 的功能：

```yaml
listeners:
  - name: vpn-tun
    type: tun
    stack: system
    dns-hijack:
      - 0.0.0.0:53
    auto-route: true
    inet4-address:
      - 198.19.0.1/30
    inet6-address:
      - "fdfe:dcba:9877::1/126"
```

### 加密代理服务器

在互联网上提供加密代理服务：

```yaml
listeners:
  - name: secure-server
    type: shadowsocks
    port: 8388
    listen: 0.0.0.0
    password: your-strong-password
    cipher: 2022-blake3-aes-256-gcm
```
