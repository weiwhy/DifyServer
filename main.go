package main

import (
	"difyserver/config"
	"difyserver/database"
	"difyserver/handlers"
	"difyserver/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"log"
)

func main() {
	// 加载配置
	if err := config.LoadConfig(); err != nil {
		log.Fatal("加载配置失败:", err)
	}

	if err := database.InitDB(); err != nil {
		log.Fatal("数据库连接失败:", err)
	}
	r := gin.Default()

	// CORS 配置...
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "Access-Control-Allow-Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))
	// 静态文件服务
	r.Static("/static", "./frontend/build/static")
	r.StaticFile("/favicon.ico", "./frontend/build/favicon.ico")
	r.StaticFile("/logo192.png", "./frontend/build/logo192.png")
	// 处理前端路由
	r.NoRoute(func(c *gin.Context) {
		c.File("./frontend/build/index.html")
	})
	// API 路由...
	r.POST("/api/login.json", handlers.Login)
	auth := r.Group("/api")
	auth.Use(middleware.AuthMiddleware())
	{
		auth.GET("/accounts.json", handlers.GetAccounts)
		auth.POST("/add_account.json", handlers.AddAccount)
		auth.POST("/del_account.json", handlers.DelAccount)
		auth.GET("/tenants.json", handlers.GetTenants)
		auth.POST("/add_tenant.json", handlers.AddTenant)
		auth.GET("/datasets.json", handlers.GetDatasets)
		auth.GET("/list_dataset_tenant.json", handlers.ListDatasetTenant)
		auth.POST("/add_dataset_tenant.json", handlers.AddDatasetTenant)
		auth.POST("/del_dataset_tenant.json", handlers.DelDatasetTenant)
		auth.GET("/list_tenant_account.json", handlers.ListTenantAccount)
		auth.GET("/list_tenant_account_by_account.json", handlers.ListTenantAccountByAccount)
		auth.GET("/list_tenant_account_by_tenant.json", handlers.ListTenantAccountByTenant)
		auth.POST("/add_tenant_account.json", handlers.AddTenantAccount)
		auth.POST("/del_tenant_account.json", handlers.DelTenantAccount)
		auth.POST("/update_tenant_account_role.json", handlers.UpdateTenantAccountRole)
		auth.POST("/set_account_password.json", handlers.SetAccountPassword)
		//auth.POST("/api/login.json", handlers.Login)
		if err := r.Run(":8080"); err != nil {
			log.Fatal("服务启动失败:", err)
		}
	}

	if err := r.Run(":8080"); err != nil {
		log.Fatal("服务启动失败:", err)
	}
}
