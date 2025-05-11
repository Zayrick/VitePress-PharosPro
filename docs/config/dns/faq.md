# DNS 常见问题

本节收集了用户在配置和使用 DNS 功能时常见的问题及解决方案。

## DNS 基础问题

### 如何判断我应该使用哪种 DNS 模式？

- **建议使用 Fake-IP 模式的情况**:
  - 移动设备或智能电视等资源受限设备
  - 网络游戏等对延迟敏感的应用
  - 需要更好隐私保护的场景
  - TUN 模式下工作

- **建议使用 Redir-Host 模式的情况**:
  - 需要与系统服务兼容
  - 应用程序需要真实 IP
  - 遇到 Fake-IP 兼容性问题且难以通过添加过滤规则解决

### 为什么推荐使用加密 DNS？

加密 DNS (如 DoH、DoT、DoQ) 相比传统 DNS 有以下优势：
1. **防止 DNS 劫持**: 运营商无法轻易篡改解析结果
2. **保护隐私**: 第三方无法窃听您的域名查询
3. **减少 DNS 污染**: 加密传输可以减少 DNS 污染的可能性
4. **更好的解析质量**: 加密 DNS 提供商通常有更好的服务质量

### 如何选择最适合我的 DNS 服务器？

1. **国内用户**:
   - 国内域名: 阿里DNS(`223.5.5.5`/`https://dns.alidns.com/dns-query`)、腾讯DNS(`119.29.29.29`/`https://doh.pub/dns-query`)
   - 国外域名: 建议通过 fallback 使用 Google DNS、Cloudflare DNS 等

2. **海外用户**:
   - 主要使用 Google DNS (`8.8.8.8`/`https://dns.google/dns-query`) 或 Cloudflare DNS (`1.1.1.1`/`https://cloudflare-dns.com/dns-query`)

3. **注重隐私**:
   - AdGuard DNS (`https://dns.adguard.com/dns-query`)
   - NextDNS (需注册账户)

## 故障排除

### DNS 解析失败或超时

**症状**: 无法解析域名，网页无法访问或访问缓慢

**可能的解决方案**:
1. 检查 DNS 服务器是否可访问:
   ```yaml
   dns:
     default-nameserver:
       - 223.5.5.5  # 确保这些 IP 可以访问
       - 8.8.8.8
   ```

2. 尝试更换 DNS 服务器:
   ```yaml
   dns:
     nameserver:
       - https://doh.pub/dns-query
       - https://dns.alidns.com/dns-query
   ```

3. 如果使用加密 DNS，可以尝试通过代理连接:
   ```yaml
   dns:
     nameserver:
       - 'https://dns.google/dns-query#proxy'
   ```

### 特定网站无法访问

**症状**: 只有特定网站或应用无法访问

**可能的解决方案**:
1. 为该域名指定特定的 DNS 服务器:
   ```yaml
   dns:
     nameserver-policy:
       '+.problematic-domain.com': 'https://dns.google/dns-query'
   ```

2. 如果使用 Fake-IP 模式，将域名添加到过滤列表:
   ```yaml
   dns:
     fake-ip-filter:
       - '*.problematic-domain.com'
   ```

3. 检查 fallback-filter 配置，确保域名能通过正确的服务器解析

### DNS 泄露问题

**症状**: 隐私检测网站显示 DNS 泄露

**可能的解决方案**:
1. 确保使用加密 DNS:
   ```yaml
   dns:
     nameserver:
       - https://dns.google/dns-query
       - tls://1.1.1.1:853
   ```

2. 启用 Fake-IP 模式:
   ```yaml
   dns:
     enhanced-mode: fake-ip
   ```

3. 如果担心 DOH 服务器名称解析泄露，可以使用 IP 形式:
   ```yaml
   dns:
     nameserver:
       - https://8.8.8.8/dns-query
       - https://1.1.1.1/dns-query
   ```

### 游戏延迟高或网络问题

**症状**: 在线游戏延迟高或连接不稳定

**可能的解决方案**:
1. 将游戏相关域名添加到 Fake-IP 过滤列表:
   ```yaml
   dns:
     fake-ip-filter:
       - '*.example-game.com'
       - 'game-servers.example.com'
       - '*.stun.*.*'  # STUN 服务通常需要真实 IP
   ```

2. 为游戏服务器指定低延迟的 DNS:
   ```yaml
   dns:
     nameserver-policy:
       '+.example-game.com': '119.29.29.29'
   ```

3. 如果游戏使用 P2P 连接，考虑使用 Redir-Host 模式

### 无法解析本地域名

**症状**: 无法访问局域网设备或本地服务

**可能的解决方案**:
1. 启用系统 hosts 文件读取:
   ```yaml
   dns:
     use-hosts: true
     use-system-hosts: true
   ```

2. 将本地域名添加到 Fake-IP 过滤列表:
   ```yaml
   dns:
     fake-ip-filter:
       - '*.local'
       - '*.lan'
       - '*.localdomain'
       - '*.hostname.local'
   ```

3. 为本地域名指定本地 DNS 服务器:
   ```yaml
   dns:
     nameserver-policy:
       '+.local': '192.168.1.1'
       '+.lan': 'system'
   ```

## 高级问题

### DOH 使用 HTTP/3 失败

**症状**: 配置了 `prefer-h3: true` 但 DOH 连接失败或缓慢

**可能的解决方案**:
1. 确认服务器支持 HTTP/3:
   - Cloudflare、Google 的 DOH 服务器支持 HTTP/3
   - 许多其他服务器可能尚不支持

2. 尝试指定特定服务器使用 HTTP/3:
   ```yaml
   dns:
     prefer-h3: false  # 全局禁用
     nameserver:
       - 'https://cloudflare-dns.com/dns-query#h3=true'  # 仅此服务器启用
   ```

3. 如果仍有问题，可能需要完全禁用 HTTP/3

### DNS 缓存问题

**症状**: DNS 解析结果不及时更新或缓存问题

**可能的解决方案**:
1. 切换缓存算法:
   ```yaml
   dns:
     cache-algorithm: arc  # 或使用 lru
   ```

2. 尝试清空 DNS 缓存 (在应用内重启 DNS 服务)

3. 确认 DNS 服务器未设置过长的 TTL 值

### 如何调试 DNS 问题？

1. **查看 DNS 日志**: 
   - 在 Pharos Pro 应用中开启 DNS 调试日志
   - 观察域名解析请求和响应

2. **使用 DNS 查询工具**:
   - nslookup 或 dig 等工具直接查询
   - 比较不同 DNS 服务器的解析结果

3. **网络抓包分析**:
   - 使用 Wireshark 等工具分析 DNS 流量
   - 查看是否有明显的延迟或失败

## 最佳实践

### 基本优化配置

```yaml
dns:
  enable: true
  enhanced-mode: fake-ip
  cache-algorithm: arc
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
  fallback:
    - https://dns.google/dns-query
    - https://cloudflare-dns.com/dns-query
  fallback-filter:
    geoip: true
    geoip-code: CN
```

### 快速响应配置

```yaml
dns:
  enable: true
  enhanced-mode: fake-ip
  prefer-h3: true
  cache-algorithm: arc
  nameserver:
    - 'https://dns.cloudflare.com/dns-query#h3=true'
  fake-ip-filter:
    - '*.lan'
    - 'localhost.ptlogin2.qq.com'
```

### 高可靠性配置

```yaml
dns:
  enable: true
  enhanced-mode: redir-host
  cache-algorithm: arc
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
    - 223.5.5.5
  fallback:
    - tls://8.8.4.4:853
    - tls://1.1.1.1:853
    - https://dns.google/dns-query
  default-nameserver:
    - 223.5.5.5
    - 119.29.29.29
  proxy-server-nameserver:
    - https://doh.pub/dns-query
```

通过本章节的故障排除指南，您应该能解决大多数常见的 DNS 配置问题。如果问题依然存在，建议到官方社区寻求更多帮助。 