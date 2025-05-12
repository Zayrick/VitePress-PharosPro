# 代理端口配置

代理端口配置允许您设置 Pharos Pro 提供的各种代理服务的监听端口。通过配置不同类型的代理端口，您可以使用不同的协议和方式访问 Pharos Pro 的代理服务。

## 基本代理端口

### HTTP(S) 代理端口

HTTP(S) 代理端口提供标准的 HTTP 协议代理服务，支持 HTTP 和 HTTPS 流量代理：

```yaml
port: 7890
```

此端口允许您通过 HTTP 代理协议连接，常用于浏览器和应用程序的代理配置。

### SOCKS 代理端口

SOCKS 代理端口提供 SOCKS4、SOCKS4a 和 SOCKS5 协议的代理服务：

```yaml
socks-port: 7891
```

SOCKS 协议是一种通用的代理协议，支持 TCP 和 UDP（仅 SOCKS5）流量，适用于各种应用程序。

### 混合代理端口

混合端口是一个特殊的端口，它同时支持 HTTP(S) 和 SOCKS5 协议。您可以使用任何支持 HTTP 或 SOCKS 代理的程序连接到这个端口：

```yaml
mixed-port: 7892
```

混合端口是最灵活的代理端口，可以减少需要开放的端口数量，同时提供多种协议支持。

## 透明代理端口

::: warning 注意
透明代理功能对操作系统有特定要求：
- `redir-port` 仅支持 Linux(Android) 和 macOS 
- `tproxy-port` 仅支持 Linux(Android)
:::

### Redirect 透明代理端口

Redirect 透明代理端口使用 iptables 的 REDIRECT 功能，仅能代理 TCP 流量：

```yaml
redir-port: 7893
```

通常结合防火墙规则使用，可以在不修改客户端的情况下将流量重定向到代理。

### TProxy 透明代理端口

TProxy 透明代理端口使用 iptables 的 TPROXY 功能，可同时代理 TCP 和 UDP 流量：

```yaml
tproxy-port: 7894
```

TProxy 是更先进的透明代理方式，提供对 UDP 流量的支持，适合需要代理游戏、视频通话等 UDP 应用的场景。

## 认证与访问控制

您可以为 HTTP 和 SOCKS 代理端口配置用户名和密码认证，以控制谁能使用您的代理服务：

```yaml
authentication:
  - "user1:pass1"
  - "user2:pass2"
```

此配置将要求客户端提供正确的用户名和密码才能使用代理服务。

## 允许局域网访问

默认情况下，代理服务仅允许本机访问。您可以启用以下设置允许局域网中的其他设备使用您的代理：

```yaml
allow-lan: true
```

当设置为 `true` 时，局域网内的其他设备可以通过您的 IP 地址和配置的端口访问代理服务。

## 绑定地址

您可以控制代理服务器绑定的 IP 地址：

```yaml
bind-address: "*"
```

可能的值：
- `*`: 绑定到所有 IP 地址
- `192.168.1.1`: 绑定到特定的 IP 地址
- `::`/`0.0.0.0`: 分别绑定到所有 IPv6/IPv4 地址

## 完整配置示例

以下是一个包含所有代理端口配置的完整示例：

```yaml
# HTTP(S) 代理端口
port: 7890

# SOCKS 代理端口
socks-port: 7891

# 混合代理端口 (HTTP + SOCKS)
mixed-port: 7892

# 透明代理端口 (仅适用于特定操作系统)
redir-port: 7893
tproxy-port: 7894

# 认证设置
authentication:
  - "username:password"

# 允许局域网访问
allow-lan: true

# 绑定地址
bind-address: "*"
```

## 使用场景

### 基本设置 (仅本机使用)

如果仅在本机使用代理，推荐使用混合端口：

```yaml
mixed-port: 7890
allow-lan: false
```

### 家庭网络共享代理

如果想在家庭网络中共享代理服务：

```yaml
mixed-port: 7890
allow-lan: true
bind-address: "*"
authentication:
  - "familyuser:securepassword"
```

### 透明代理网关

如果要将设备配置为透明代理网关：

```yaml
redir-port: 7893  # 用于 TCP 流量
tproxy-port: 7894 # 用于 TCP+UDP 流量
allow-lan: true
bind-address: "*"
```

透明代理配置还需要额外的系统级防火墙规则设置。
