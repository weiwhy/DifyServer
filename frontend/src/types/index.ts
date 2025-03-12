export interface Account {
    ID: string;
    Name: string;
    Email: string;
    Password?: string;
    PasswordSalt?: string;
    Avatar: string | null;
    InterfaceLanguage: string;
    InterfaceTheme: string;
    Timezone: string;
    Status: string;
  }

export interface PageResponse<T> {
  data: T[];
  total: number;
  total_pages: number;
  page: number;
  page_size: number;
}

export interface Tenant {
  ID: string;
  Name: string;
  EncryptPublicKey: string;
  Plan: string;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
  CustomConfig: any;
}


export interface Dataset {
  ID: string;
  TenantID: string;
  Name: string;
  Description: string;
  Provider: string;
  Permission: string;
  DataSourceType: string;
  IndexingTechnique: string;
  IndexStruct: string;
  CreatedBy: string;
  CreatedAt: string;
  UpdatedBy: string;
  UpdatedAt: string;
  EmbeddingModel: string;
  EmbeddingModelProvider: string;
  CollectionBindingID: string;
  RetrievalModel: string;
}


export interface TenantAccountJoin {
  ID: string;
  TenantID: string;
  AccountID: string;
  Role: string;
  InvitedBy: string | null;
  CreatedAt: string;
  UpdatedAt: string;
  Current: boolean;
}