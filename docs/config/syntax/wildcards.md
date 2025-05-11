# 域名通配符

Pharos Pro 支持在规则和配置中使用通配符来匹配域名。了解这些通配符的用法可以帮助您更精确地控制网络流量。

## 通配符 *

Clash 的通配符 `*` 一次只能匹配一级域名：

- `*.baidu.com` 只匹配 `tieba.baidu.com` 而不匹配 `123.tieba.baidu.com` 或者 `baidu.com`
- `*` 只匹配 `localhost` 等没有 `.` 的主机名

## 通配符 +

通配符 `+` 类似 DOMAIN-SUFFIX，可以一次性匹配多个级别：

- `+.baidu.com` 匹配 `tieba.baidu.com` 和 `123.tieba.baidu.com` 或者 `baidu.com`
- 通配符 `+` 只能用于域名前缀匹配

## 通配符 .

通配符 `.` 可以一次性匹配多个级别：

- `.baidu.com` 匹配 `tieba.baidu.com` 和 `123.tieba.baidu.com`，但不能匹配 `baidu.com`
- 通配符 `.` 只能用于域名前缀匹配

## 使用示例

使用通配符时，应当使用引号 `''` 或 `""` 将内容包裹起来：

```yaml
fake-ip-filter:
  - ".lan"
  - "xbox.*.microsoft.com"
  - "+.xboxlive.com"
  - localhost.ptlogin2.qq.com
```

## 注意事项

1. **优先级**：更具体的规则通常具有更高的优先级
2. **引号标注**：含有通配符的域名应使用引号包裹
3. **通配符位置**：`+` 和 `.` 通配符只能用于域名前缀
4. **大小写敏感性**：域名匹配通常是不区分大小写的
