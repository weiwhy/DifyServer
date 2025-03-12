import axios from 'axios';

// const api = axios.create({
//     baseURL: 'http://localhost:8080/api'
// });
const api = axios.create({
    baseURL:'/api'
});

// 添加请求拦截器
api.interceptors.request.use(config => {
    const user = localStorage.getItem('user');
    if (user) {
        const { token } = JSON.parse(user);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 添加响应拦截器
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const accountApi = {
    login: (data: { email: string; password: string }) =>
        api.post('/login.json', data),
    getAccounts: (page: number) =>
        api.get('/accounts.json', { params: { page } }),
    addAccount: (data: { name: string; email: string }) =>
        api.post('/add_account.json', data),
    deleteAccount: (id: string) =>
        api.post('/del_account.json', { id }),
    setPassword: (id: string, password: string) =>
        api.post('/set_account_password.json', { id, password }),
};

export const tenantApi = {
    getTenants: (page: number) =>
        api.get('/tenants.json', { params: { page } }),
    addTenant: (data: { 
        name: string; 
        plan: 'basic' | 'pro' | 'enterprise';
        status: string;
    }) =>
        api.post('/add_tenant.json', data),
};

export const datasetApi = {
    getDatasets: (page: number) =>
        api.get('/datasets.json', { params: { page } }),
    addDataset: (data: {
        name: string;
        description: string;
        permission: string;
        data_source_type: string;
        indexing_technique: string;
    }) =>
        api.post('/add_dataset.json', data),
    addDatasetTenant: (datasetId: string, tenantId: string) =>
        api.post('/add_dataset_tenant.json', { dataset_id: datasetId, tenant_id: tenantId }),
    deleteDatasetTenant: (datasetId: string, tenantId: string) =>
        api.post('/del_dataset_tenant.json', { dataset_id: datasetId, tenant_id: tenantId }),
    listDatasetTenant: () =>
        api.get('/list_dataset_tenant.json'),
};

export const tenantAccountApi = {
    listTenantAccounts: (page: number) =>
        api.get('/list_tenant_account.json', { params: { page } }),
    listByAccount: (accountId: string, page: number) =>
        api.get('/list_tenant_account_by_account.json', { params: { account_id: accountId, page } }),
    listByTenant: (tenantId: string, page: number) =>
        api.get('/list_tenant_account_by_tenant.json', { params: { tenant_id: tenantId, page } }),
    addTenantAccount: (data: { account_id: string; tenant_id: string; role: string }) =>
        api.post('/add_tenant_account.json', data),
    deleteTenantAccount: (accountId: string, tenantId: string) =>
        api.post('/del_tenant_account.json', { account_id: accountId, tenant_id: tenantId }),
    updateRole: (data: { account_id: string; tenant_id: string; role: string }) =>
        api.post('/update_tenant_account_role.json', data),
};

// 修改最后的导出语句，只导出未使用 export const 导出的内容
export { api };