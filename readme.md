# DifyServer

DifyServer 是一个用于管理 Dify 多租户和用户权限的管理系统。它提供了用户管理、工作空间管理、权限控制等功能。

## 功能特点

- 用户管理：创建、删除用户，修改密码
- 工作空间管理：创建和管理多个工作空间
- 权限控制：管理用户与工作空间的关联关系
- 知识库展示：查看各工作空间的知识库

## 技术栈

- 后端：Go + Gin + GORM
- 前端：React + TypeScript + Ant Design
- 数据库：PostgreSQL

## 快速开始

### 配置

创建 `config.yaml` 文件：

```yaml
database:
  host: "localhost"
  port: 5432
  user: "postgres"
  password: "your_password"
  dbname: "dify"

admins:
  - "admin@example.com"
  - "another_admin@example.com"
```