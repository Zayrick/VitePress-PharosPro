# Pharos Pro 配置文档

欢迎使用 Pharos Pro 配置文档。本文档提供了关于如何配置和使用 Pharos Pro 的详细指南，帮助您充分利用这款简单而强大的代理工具。

## 什么是 Pharos Pro?

Pharos Pro 是一款基于 Mihomo (原 Clash) 的强大代理工具，专为 iOS 和 iPadOS 平台开发。它完全兼容 Mihomo 的配置格式，这意味着您可以在 Pharos Pro 上创建或导入的配置文件，能够无缝地在其他平台（macOS、Android、Windows 和 Linux）上的 Mihomo 客户端中使用，实现一份配置文件全平台通用的便捷体验。

## 跨平台配置兼容

Pharos Pro 虽然仅作为 iOS 和 iPadOS 应用提供，但其配置系统与 Mihomo 核心完全兼容，为用户提供了以下优势：

- **一次配置，多处使用**：在 Pharos Pro 上创建的配置可直接用于其他平台的 Mihomo 客户端
- **无缝切换**：在不同设备间切换时无需重新创建配置
- **统一管理**：集中管理所有设备的网络策略
- **持续兼容**：随着 Mihomo 的更新，Pharos Pro 也会保持配置格式的兼容性

## 文档结构

本文档分为以下几个主要部分：

- **[总览](./index.md)**: 配置系统的基本介绍
- **语法**: 
  - [YAML语法](./syntax/yaml.md): 理解配置文件的基本语法
  - [域名通配符](./syntax/wildcards.md): 学习如何使用通配符匹配域名
- **[全局配置](./general.md)**: 基本的全局设置
- **[DNS](./dns/dns.md)**: DNS 相关配置
- **[域名嗅探](./sniffer.md)**: 域名嗅探功能配置
- **[入站](./listeners.md)**: 入站连接设置
- **[出站](./tun.md)**: 出站连接设置
- **[代理集合](./proxies.md)**: 配置代理服务器
- **[策略组](./proxy-groups.md)**: 策略组设置
- **[代理规则](./rules.md)**: 流量规则配置
- **[规则集合](./rule-sets.md)**: 规则集合管理
- **[子规则](./sub-rules.md)**: 子规则配置
- **[流量转发](./traffic-forward.md)**: 端口转发设置
- **[NTP 服务](./ntp.md)**: 网络时间协议服务设置
- **[实验性配置](./experimental.md)**: 实验性功能配置

## 开始使用

如果您是初次使用 Pharos Pro，建议从 [总览](./index.md) 开始阅读，了解基本概念，然后按需浏览其他章节。

## 获取帮助

如果您在使用过程中遇到任何问题，请查阅 [常见问题](../faq.md)。请注意，作为非官方文档，我们无法提供官方支持。如需官方帮助，请通过 App Store 中的应用页面联系开发者。
