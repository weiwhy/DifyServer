package models

type PageResponse struct {
	Data       interface{} `json:"data"`
	Total      int64       `json:"total"`       // 总记录数
	TotalPages int         `json:"total_pages"` // 总页数
	Page       int         `json:"page"`        // 当前页
	PageSize   int         `json:"page_size"`   // 每页大小
}
