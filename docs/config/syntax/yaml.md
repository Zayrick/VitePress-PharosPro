# YAML 语法

Pharos Pro 使用 YAML 格式作为配置文件的标准格式。YAML (YAML Ain't Markup Language) 是一种人类可读的数据序列化标准，非常适合配置文件。

## 基本语法

### 缩进

YAML 使用缩进来表示层级关系，通常使用 2 个空格作为一个缩进单位。在 Pharos Pro 的配置中，一致的缩进非常重要。

```yaml
level1:
  level2:
    level3: value
```

### 映射 (键值对)

YAML 使用冒号和空格分隔键和值：

```yaml
key: value
```

### 列表

列表项使用短横线和空格开始：

```yaml
items:
  - item1
  - item2
  - item3
```

### 注释

使用井号 (#) 表示注释：

```yaml
# 这是一个注释
key: value  # 行尾注释
```

## Pharos Pro 配置中的应用

### 基本配置示例

以下是一个简单的 Pharos Pro 配置示例：

```yaml
# 全局设置
mixed-port: 7890
allow-lan: true
mode: rule

# DNS 配置
dns:
  enable: true
  listen: 0.0.0.0:53
  nameserver:
    - 223.5.5.5
    - 119.29.29.29

# 代理服务器
proxies:
  - name: "服务器1"
    type: ss
    server: server1.example.com
    port: 443
    cipher: chacha20-ietf-poly1305
    password: "password"
  
  - name: "服务器2"
    type: vmess
    server: server2.example.com
    port: 443
    uuid: a3d28deb-f76d-73c9-8976-847825483368
    alterId: 0
    cipher: auto
```

### 常见错误

1. **缩进不一致**：确保使用一致的缩进格式
2. **冒号后缺少空格**：每个冒号后应当有一个空格
3. **结构不匹配**：确保每个列表项、键值对都遵循正确的格式
4. **引号使用不当**：包含特殊字符的字符串应该用引号括起来

## 高级用法

### 锚点和引用

YAML 支持通过锚点 (&) 和引用 (*) 来重用配置片段：

```yaml
common: &common
  timeout: 5000
  verify: true

servers:
  server1:
    <<: *common
    host: example1.com
  
  server2:
    <<: *common
    host: example2.com
```

### 多行字符串

对于长文本，可以使用竖线符号 (|) 保留换行符，或使用大于号 (>) 将换行符转换为空格：

```yaml
# 保留换行符
description: |
  这是第一行
  这是第二行

# 将换行符转换为空格
note: >
  这是一段
  很长的文本，但会
  被转换为单行文本
```

## 验证工具

建议使用以下工具验证您的 YAML 配置：

1. [YAML Lint](http://www.yamllint.com/) - 在线 YAML 验证工具
2. [YAML Validator](https://codebeautify.org/yaml-validator) - 另一个在线验证工具

## 延伸阅读

- [官方 YAML 规范](https://yaml.org/spec/)
- [菜鸟教程 YAML 入门](https://www.runoob.com/yaml/yaml-tutorial.html)
