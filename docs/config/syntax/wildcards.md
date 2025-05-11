# 域名通配符

Pharos Pro 支持在规则和配置中使用通配符来匹配域名。了解这些通配符的用法可以帮助您更精确地控制网络流量。

## 基本通配符

### 星号 (*) 通配符

星号可以匹配零个或多个字符：

- `*.example.com` 匹配 `www.example.com`、`api.example.com`，但不匹配 `example.com` 或 `sub.api.example.com`
- `example.*` 匹配 `example.com`、`example.org`，但不匹配 `www.example.com`

### 问号 (?) 通配符

问号可以匹配任意单个字符：

- `example.?` 匹配 `example.a`、`example.b`，但不匹配 `example.com`
- `?.example.com` 匹配 `a.example.com`、`b.example.com`，但不匹配 `ab.example.com`

## 高级匹配

### 双星号 (**) 通配符

双星号可以匹配跨多个层级的任意字符：

- `**.example.com` 匹配 `example.com`、`www.example.com`、`sub.api.example.com` 等任意子域
- `example.**` 匹配 `example.com`、`example.org`、`example.com.cn` 等任意顶级域

### 括号语法

可以使用花括号 `{}` 指定多个可能的匹配项：

- `{a,b}.example.com` 匹配 `a.example.com` 和 `b.example.com`
- `example.{com,net}` 匹配 `example.com` 和 `example.net`

## 在规则中使用通配符

通配符最常用于代理规则中：

```yaml
rules:
  - DOMAIN-SUFFIX,example.com,DIRECT
  - DOMAIN-WILDCARD,*.google.*,PROXY
  - DOMAIN-WILDCARD,**.facebook.com,PROXY
  - DOMAIN-WILDCARD,{api,v2}.service.com,SPECIAL
```

## 注意事项

1. **优先级**：更具体的规则通常具有更高的优先级
2. **性能影响**：过多使用双星号 (`**`) 可能会影响匹配性能
3. **转义**：如果需要匹配含有特殊字符的域名，使用引号并进行适当转义
4. **大小写敏感性**：域名匹配通常是不区分大小写的

## 最佳实践

1. 尽量使用特定的匹配模式，避免过于宽泛的规则
2. 对频繁访问的域名使用明确的规则，而不是通配符
3. 定期审查和优化规则集，删除不必要的通配符规则
4. 对于复杂的匹配需求，考虑使用正则表达式规则

## 示例

```yaml
# 基本域名匹配
- DOMAIN,www.example.com,DIRECT

# 后缀匹配
- DOMAIN-SUFFIX,example.com,DIRECT

# 通配符匹配
- DOMAIN-WILDCARD,*.example.com,DIRECT
- DOMAIN-WILDCARD,api.*.example.com,PROXY
- DOMAIN-WILDCARD,**.cdn.example.com,CDN

# 多选项匹配
- DOMAIN-WILDCARD,{api,v2,auth}.example.com,API_GROUP
```
