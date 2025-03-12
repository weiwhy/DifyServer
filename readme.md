# 简介

用来管理Dify多个用户空间和用户之间的权限

- 用户的增加，删除，修改密码
- 空间的增加，删除
- 用户和空间之间的关联关系
- 知识库展示，不含管理

# 截图

![img.png](img.png)

# 代码部分

- main.go程序的主入口点
- frontend是前端代码，运行npm run build进行编译
- config.yaml程序配置文件，指定dify应用的Postgre数据库信息，和指定可以登录该程序的Dify用户的邮箱地址
