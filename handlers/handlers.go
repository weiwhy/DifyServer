package handlers

import (
	"bytes"
	"crypto/rand"
	"crypto/sha256"
	"difyserver/config"
	"difyserver/database"
	"difyserver/models"
	"difyserver/utils"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/pbkdf2"
	"math"
	"strconv"
	"time"
)

func GetAccounts(c *gin.Context) {
	var accounts []models.Account
	var total int64
	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)
	limit := 10
	offset := (page - 1) * limit

	// 先获取总记录数
	database.DB.Model(&models.Account{}).Count(&total)

	// 获取分页数据
	result := database.DB.Limit(limit).Offset(offset).Find(&accounts)
	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error.Error()})
		return
	}

	// 计算总页数
	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	response := models.PageResponse{
		Data:       accounts,
		Total:      total,
		TotalPages: totalPages,
		Page:       page,
		PageSize:   limit,
	}

	c.JSON(200, response)
}

func AddAccount(c *gin.Context) {
	var account models.Account
	if err := c.ShouldBindJSON(&account); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	account.ID = uuid.New().String()
	account.InterfaceLanguage = "zh-Hans"
	account.Avatar = "99371728-eb21-49b2-a83c-26303f7c11b2"
	account.InterfaceTheme = "light"
	account.Timezone = "Asia/Shanghai"
	account.Status = "active"
	if result := database.DB.Create(&account); result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(200, account)
}

func GetTenants(c *gin.Context) {
	var tenants []models.Tenant
	var total int64
	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)
	limit := 10
	offset := (page - 1) * limit

	// 先获取总记录数
	database.DB.Model(&models.Tenant{}).Count(&total)

	// 获取分页数据
	result := database.DB.Limit(limit).Offset(offset).Find(&tenants)
	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error.Error()})
		return
	}

	// 计算总页数
	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	response := models.PageResponse{
		Data:       tenants,
		Total:      total,
		TotalPages: totalPages,
		Page:       page,
		PageSize:   limit,
	}

	c.JSON(200, response)
}

func AddTenant(c *gin.Context) {
	var tenant models.Tenant
	if err := c.ShouldBindJSON(&tenant); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	tenant.ID = uuid.New().String()
	tenant.CreatedAt = time.Now()
	tenant.UpdatedAt = time.Now()
	tenant.EncryptPublicKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6DgcAPwYgeVRla/LH/S9\n9TQ6MmQNZRO7PRilu8NdQxRO4UP9KvRaIE8Jv0TozcbvqyTx7rjYU5nQsEvbRh6s\ntoq3Id7+pF/rQZX1DWCsg9Tn9rCkwBdZLd4dA2/5I6AWYjMQtPf5XBFDfIf+hgBQ\ns8pSrmDO+g1LTD8qwcbx/VzsSR7SMxL7voPxByr5kUtyG+K80OkDl7ruddzdbUG3\nLF9VQvaiw7ocMVGN+FE/wvPPbtnTuQ1bkE0h771huTYGJ93kL9hd9SlpkYcLpUWP\nit/6tjkt7M8Z3DUJpdCMYeMjmaWuENBEKu8DFpehf7n3UoCo56Luqi4TNEkcG9Df\nuQIDAQAB\n-----END PUBLIC KEY-----"

	if result := database.DB.Create(&tenant); result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(200, tenant)
}

func GetDatasets(c *gin.Context) {
	var datasets []models.Dataset
	var total int64
	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)
	limit := 10
	offset := (page - 1) * limit

	// 先获取总记录数
	database.DB.Model(&models.Dataset{}).Count(&total)

	// 获取分页数据
	result := database.DB.Limit(limit).Offset(offset).Find(&datasets)
	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error.Error()})
		return
	}

	// 计算总页数
	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	response := models.PageResponse{
		Data:       datasets,
		Total:      total,
		TotalPages: totalPages,
		Page:       page,
		PageSize:   limit,
	}

	c.JSON(200, response)
}

func ListDatasetTenant(c *gin.Context) {
	var datasets []models.Dataset
	var total int64
	tenantID := c.Query("tenant_id")
	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)
	limit := 10
	offset := (page - 1) * limit

	// 先获取总记录数
	database.DB.Model(&models.Dataset{}).Count(&total)

	// 获取分页数据
	query := database.DB.Model(&models.Dataset{})
	if tenantID != "" {
		query = query.Where("tenant_id = ?", tenantID)
	}

	result := query.Limit(limit).Offset(offset).Find(&datasets)
	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error.Error()})
		return
	}

	// 计算总页数
	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	response := models.PageResponse{
		Data:       datasets,
		Total:      total,
		TotalPages: totalPages,
		Page:       page,
		PageSize:   limit,
	}

	c.JSON(200, response)
}

func AddDatasetTenant(c *gin.Context) {
	var dataset models.Dataset
	if err := c.ShouldBindJSON(&dataset); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	result := database.DB.Model(&models.Dataset{}).Where("id = ?", dataset.ID).Update("tenant_id", dataset.TenantID)
	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "关联成功"})
}

func DelDatasetTenant(c *gin.Context) {
	var dataset models.Dataset
	if err := c.ShouldBindJSON(&dataset); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	result := database.DB.Model(&models.Dataset{}).Where("id = ? AND tenant_id = ?", dataset.ID, dataset.TenantID).Update("tenant_id", nil)
	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "删除关联成功"})
}

func ListTenantAccount(c *gin.Context) {
	var joins []models.TenantAccountJoin
	var total int64
	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)
	limit := 10
	offset := (page - 1) * limit

	// 先获取总记录数
	database.DB.Model(&models.TenantAccountJoin{}).Count(&total)

	// 获取分页数据
	result := database.DB.Limit(limit).Offset(offset).Find(&joins)
	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error.Error()})
		return
	}

	// 计算总页数
	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	response := models.PageResponse{
		Data:       joins,
		Total:      total,
		TotalPages: totalPages,
		Page:       page,
		PageSize:   limit,
	}

	c.JSON(200, response)
}

func ListTenantAccountByAccount(c *gin.Context) {
	var joins []models.TenantAccountJoin
	var total int64
	accountID := c.Query("account_id")
	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)
	limit := 10
	offset := (page - 1) * limit

	if accountID == "" {
		c.JSON(400, gin.H{"error": "account_id 参数必填"})
		return
	}
	// 先获取总记录数
	database.DB.Model(&models.TenantAccountJoin{}).Count(&total)

	// 获取分页数据
	result := database.DB.Where("account_id = ?", accountID).Limit(limit).Offset(offset).Find(&joins)
	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error.Error()})
		return
	}
	// 计算总页数
	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	response := models.PageResponse{
		Data:       joins,
		Total:      total,
		TotalPages: totalPages,
		Page:       page,
		PageSize:   limit,
	}
	c.JSON(200, response)
}

func ListTenantAccountByTenant(c *gin.Context) {
	var joins []models.TenantAccountJoin
	var total int64
	tenantID := c.Query("tenant_id")
	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)
	limit := 10
	offset := (page - 1) * limit

	if tenantID == "" {
		c.JSON(400, gin.H{"error": "tenant_id 参数必填"})
		return
	}
	// 先获取总记录数
	database.DB.Model(&models.TenantAccountJoin{}).Count(&total)

	// 获取分页数据
	result := database.DB.Where("tenant_id = ?", tenantID).Limit(limit).Offset(offset).Find(&joins)
	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error.Error()})
		return
	}

	// 计算总页数
	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	response := models.PageResponse{
		Data:       joins,
		Total:      total,
		TotalPages: totalPages,
		Page:       page,
		PageSize:   limit,
	}
	c.JSON(200, response)
}

func AddTenantAccount(c *gin.Context) {
	var req struct {
		AccountID string `json:"account_id"`
		TenantID  string `json:"tenant_id"`
		Role      string `json:"role"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// 验证参数不为空
	if req.AccountID == "" || req.TenantID == "" {
		c.JSON(400, gin.H{"error": "account_id 和 tenant_id 不能为空"})
		return
	}

	// 验证角色值是否有效
	validRoles := map[string]bool{
		"owner":  true,
		"admin":  true,
		"editor": true,
		"normal": true,
	}
	if req.Role == "" {
		req.Role = "normal" // 默认角色
	} else if !validRoles[req.Role] {
		c.JSON(400, gin.H{"error": "无效的角色值"})
		return
	}

	join := models.TenantAccountJoin{
		ID:        uuid.New().String(),
		TenantID:  req.TenantID,
		AccountID: req.AccountID,
		Role:      req.Role,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if result := database.DB.Create(&join); result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(200, join)
}

func DelTenantAccount(c *gin.Context) {
	var req struct {
		AccountID string `json:"account_id"`
		TenantID  string `json:"tenant_id"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if req.TenantID == "" || req.AccountID == "" {
		c.JSON(400, gin.H{"error": "tenant_id 和 account_id 不能为空"})
		return
	}

	result := database.DB.Where("tenant_id = ? AND account_id = ?", req.TenantID, req.AccountID).Delete(&models.TenantAccountJoin{})
	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "删除成功"})
}

func UpdateTenantAccountRole(c *gin.Context) {
	var req struct {
		AccountID string `json:"account_id"`
		TenantID  string `json:"tenant_id"`
		Role      string `json:"role"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// 验证参数不为空
	if req.AccountID == "" || req.TenantID == "" || req.Role == "" {
		c.JSON(400, gin.H{"error": "account_id、tenant_id 和 role 不能为空"})
		return
	}

	// 验证角色值是否有效
	validRoles := map[string]bool{
		"owner":  true,
		"admin":  true,
		"editor": true,
		"normal": true,
	}
	if !validRoles[req.Role] {
		c.JSON(400, gin.H{"error": "无效的角色值"})
		return
	}

	// 更新角色
	result := database.DB.Model(&models.TenantAccountJoin{}).
		Where("tenant_id = ? AND account_id = ?", req.TenantID, req.AccountID).
		Update("role", req.Role)

	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error.Error()})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(404, gin.H{"error": "未找到指定的关联关系"})
		return
	}

	c.JSON(200, gin.H{"message": "角色更新成功"})
}

func DelAccount(c *gin.Context) {
	var req struct {
		ID string `json:"id"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if req.ID == "" {
		c.JSON(400, gin.H{"error": "用户ID不能为空"})
		return
	}

	// 开启事务
	tx := database.DB.Begin()

	// 先删除关联关系
	if err := tx.Where("account_id = ?", req.ID).Delete(&models.TenantAccountJoin{}).Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "删除用户关联关系失败"})
		return
	}

	// 再删除用户
	if err := tx.Where("id = ?", req.ID).Delete(&models.Account{}).Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "删除用户失败"})
		return
	}

	// 提交事务
	if err := tx.Commit().Error; err != nil {
		c.JSON(500, gin.H{"error": "删除用户失败"})
		return
	}

	c.JSON(200, gin.H{"message": "删除用户成功"})
}

func SetAccountPassword(c *gin.Context) {
	var req struct {
		ID          string `json:"id"`
		NewPassword string `json:"password"` // 新密码
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// 验证参数
	if req.ID == "" || req.NewPassword == "" {
		c.JSON(400, gin.H{"error": "用户ID和新密码不能为空"})
		return
	}

	// 验证新密码长度
	if len(req.NewPassword) < 6 {
		c.JSON(400, gin.H{"error": "密码长度至少6位"})
		return
	}

	// 查找用户
	var account models.Account
	if err := database.DB.Where("id = ?", req.ID).First(&account).Error; err != nil {
		c.JSON(404, gin.H{"error": "未找到指定用户"})
		return
	}

	// 生成新的盐值
	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		c.JSON(500, gin.H{"error": "生成密码盐失败"})
		return
	}

	// 使用新盐值加密新密码
	byteArray := hashPassword(req.NewPassword, salt)

	// 将密码和盐值转换为 base64 编码
	hashedPassword := []byte(byteArray)
	fmt.Println(byteArray) // 输出: [104 101 108 108 111]

	base64Password := base64.StdEncoding.EncodeToString(hashedPassword)
	base64Salt := base64.StdEncoding.EncodeToString(salt)

	// 更新用户密码和盐值
	result := database.DB.Model(&account).Updates(map[string]interface{}{
		"password":      base64Password,
		"password_salt": base64Salt,
	})

	if result.Error != nil {
		c.JSON(500, gin.H{"error": "设置密码失败"})
		return
	}

	c.JSON(200, gin.H{"message": "设置密码成功"})
}

func Login(c *gin.Context) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// 验证参数
	if req.Email == "" || req.Password == "" {
		c.JSON(400, gin.H{"error": "邮箱和密码不能为空"})
		return
	}

	isAdmin := false
	for _, adminEmail := range config.GlobalConfig.Admins {
		if adminEmail == req.Email {
			isAdmin = true
			break
		}
	}

	if !isAdmin {
		c.JSON(401, gin.H{"error": "没有管理员权限"})
		return
	}

	// 查找用户
	var account models.Account
	if err := database.DB.Where("email = ?", req.Email).First(&account).Error; err != nil {
		c.JSON(401, gin.H{"error": "用户不存在或密码错误"})
		return
	}

	// 验证密码
	if account.Password == "" || account.PasswordSalt == "" {
		c.JSON(401, gin.H{"error": "用户未设置密码"})
		return
	}

	// 解码存储的密码和盐值
	storedPasswordBytes, err := base64.StdEncoding.DecodeString(account.Password)
	if err != nil {
		c.JSON(500, gin.H{"error": "密码解码失败"})
		return
	}

	saltBytes, err := base64.StdEncoding.DecodeString(account.PasswordSalt)
	if err != nil {
		c.JSON(500, gin.H{"error": "密码盐解码失败"})
		return
	}

	// 使用相同的盐值加密输入的密码
	inputPasswordHashed := hashPassword(req.Password, saltBytes)

	// 比较密码
	if !bytes.Equal([]byte(inputPasswordHashed), storedPasswordBytes) {
		c.JSON(401, gin.H{"error": "用户不存在或密码错误"})
		return
	}

	// 验证成功后生成 token
	token, err := utils.GenerateToken(account.ID, account.Email)
	if err != nil {
		c.JSON(500, gin.H{"error": "生成token失败"})
		return
	}

	// 返回用户信息和 token
	account.Password = ""     // 清除敏感信息
	account.PasswordSalt = "" // 清除敏感信息
	c.JSON(200, gin.H{
		"message": "登录成功",
		"data":    account,
		"token":   token,
	})
}

// hashPassword 使用 PBKDF2 算法和盐值加密密码
func hashPassword(password string, salt []byte) string {
	// 生成 PBKDF2 密钥
	dk := pbkdf2.Key([]byte(password), salt, 10000, 32, sha256.New)
	// 转换为十六进制字符串
	return hex.EncodeToString(dk)
}
