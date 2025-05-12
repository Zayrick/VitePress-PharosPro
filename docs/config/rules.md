# 代理规则

代理规则决定了特定网络流量如何处理 - 是直接连接、通过代理连接，还是拒绝连接。Pharos Pro 提供了强大而灵活的规则系统。

## 规则格式

规则的基本格式如下：

```yaml
rules:
  - <类型>,<匹配内容>,<代理策略>[,<参数>]
```

其中：
- **类型**: 规则的匹配方式
- **匹配内容**: 根据类型的不同，可以是域名、IP、端口等
- **代理策略**: 可以是 `DIRECT`（直连）、`REJECT`（拒绝）或任何已定义的代理/策略组名称
- **参数**: 可选，某些规则类型的附加参数

## 规则类型

### 基于域名的规则

```yaml
# 精确域名匹配
- DOMAIN,www.example.com,PROXY

# 域名后缀匹配
- DOMAIN-SUFFIX,example.com,PROXY

# 域名关键词匹配
- DOMAIN-KEYWORD,example,PROXY

# 域名通配符匹配
- DOMAIN-WILDCARD,*.example.com,PROXY
```

### 基于 IP 的规则

```yaml
# 精确 IP 匹配
- IP-CIDR,192.168.1.1/32,DIRECT

# IP 段匹配
- IP-CIDR,192.168.0.0/16,DIRECT
- IP-CIDR6,2001:db8::/32,DIRECT

# 强制 IP 解析类型，不依赖系统 DNS
- IP-CIDR,192.168.0.0/16,DIRECT,no-resolve
```

### 基于地理位置的规则

```yaml
# 地理位置规则
- GEOIP,CN,DIRECT
- GEOIP,US,PROXY
```

### 基于端口的规则

```yaml
# 目标端口规则
- DST-PORT,80,DIRECT
- DST-PORT,443,PROXY
```

### 基于进程的规则

```yaml
# 进程名规则（部分平台不支持）
- PROCESS-NAME,chrome.exe,PROXY
- PROCESS-PATH,/Applications/Firefox.app/Contents/MacOS/firefox,PROXY
```

### 其他规则类型

```yaml
# 匹配所有 HTTP 请求
- HTTP,PROXY

# 匹配所有 HTTPS 请求
- HTTPS,PROXY

# 匹配所有 TCP 流量
- TCP,PROXY

# 匹配所有 UDP 流量
- UDP,PROXY

# 匹配所有流量
- MATCH,PROXY
```

## 规则优先级

1. 规则按从上到下的顺序匹配
2. 一旦匹配成功，立即应用对应的策略，不再继续匹配
3. `MATCH` 规则通常放在最后作为默认规则

## 规则集

对于大量规则，可以使用规则集来组织：

```yaml
rule-providers:
  reject:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt"
    path: ./ruleset/reject.yaml
    interval: 86400

rules:
  - RULE-SET,reject,REJECT
```

详细信息请参阅[规则集合](./rule-sets.md)章节。

## 子规则

子规则允许您创建更复杂的匹配条件：

```yaml
sub-rules:
  rule1:
    - DOMAIN,www.example.com
    - DOMAIN-SUFFIX,example.org
  rule2:
    - IP-CIDR,192.168.0.0/16
    - GEOIP,US

rules:
  - SUB-RULE,rule1,PROXY
  - SUB-RULE,rule2,DIRECT
```

详细信息请参阅[子规则](./sub-rules.md)章节。

## 脚本规则

高级用户可以使用脚本规则实现动态匹配：

```yaml
script:
  code: |
    def match(ctx, metadata):
      if metadata["host"].endswith(".example.com"):
        return "PROXY"
      return None

rules:
  - SCRIPT,script,MATCH
```

## 常见问题解决

### 规则不生效？

1. 检查规则顺序 - 较早的规则可能已经匹配
2. 验证规则语法是否正确
3. 检查代理策略名称是否正确

### 如何调试规则？

1. 将日志级别设置为 debug
2. 观察日志中的匹配信息
3. 使用规则测试工具验证

### 规则优化建议

1. 将常用规则放在前面，提高匹配效率
2. 使用规则集组织大量规则
3. 尽量使用特定匹配（如 DOMAIN）而非通用匹配（如 DOMAIN-KEYWORD）
4. 对于 IP 类规则，使用 `no-resolve` 参数避免不必要的 DNS 解析

## 完整示例

```yaml
rules:
  # 广告拦截
  - DOMAIN-SUFFIX,ads.example.com,REJECT
  - DOMAIN-KEYWORD,analytics,REJECT
  
  # 直连国内网站
  - GEOIP,CN,DIRECT
  - DOMAIN-SUFFIX,cn,DIRECT
  
  # 科学上网
  - DOMAIN-SUFFIX,google.com,PROXY
  - DOMAIN-SUFFIX,github.com,PROXY
  
  # 游戏平台走特定节点
  - DOMAIN-SUFFIX,steampowered.com,GAME
  
  # 默认规则
  - MATCH,PROXY
```
