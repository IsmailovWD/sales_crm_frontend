export type ApiResponse<T> = T;

export interface UserAttr {
  id: number;
  username: string;
  fullName: string;
  password?: string | null;
  salary: number;
  sales_kpi: number;
}

export interface ProductsAttr {
  id: number;
  name: string;
  price: number;
  body_summa: number;
}

export interface DealStagesAttr {
  id: number;
  name: string;
  color: string;
  is_deleted: boolean;
  key: string;
  order?: number;
}
export interface RegionsAttr {
  id: number;
  name: string;
}
export interface DistrictsAttr {
  id: number;
  name: string;
  region_id: number;
}

export interface ContactsAttr {
  id: number;
  name: string;
  phone_number: string;
  is_client: boolean;
  is_supplier: boolean;
  dial_code: string;
  country_code: string;
  region_id: number | null;
  district_id: number | null;
  region?: RegionsAttr;
  district?: DistrictsAttr;
}
export interface DeliveryManAttr {
  id: number;
  name: string;
  phone_number: string;
  dial_code: string;
  country_code: string;
  regionId: string | null;
  districtId: string | null;
  salary_type: "salary" | "percent" | "none" | "summa";
  salary_value: number;
  werehouse_available: boolean;
  password?: string | null;
}

export interface DealOrderAttr {
  product_id: number | null;
  quantity: number;
  price: number;
  summa: number;
}

export interface DealAttr {
  id: number;
  title: string | null;
  stage_id: number | null;
  contact_id: number | null;
  summa: number;
  contact: Omit<ContactsAttr, "id">;
  tags: string[];
  orders: DealOrderAttr[];
  //
  deliveryman_id: number | null;
  delivery_date: number | null;
  deliveryman?: Omit<DeliveryManAttr, "id">;
  region_id: number | null;
  district_id: number | null;
  region?: RegionsAttr;
  district?: DistrictsAttr;
  address: string | null;
  comment: string | null;
  created_at?: number;
  updated_at?: number;
  location: string[] | number[];
  //
  is_checked?: boolean;
  // relations
  stage?: DealStagesAttr;
}
//
export enum DealActivityType {
  NOTE = "NOTE",
  COMMENT = "COMMENT",
  TASK = "TASK",
  STAGE_CHANGE = "STAGE_CHANGE",
  EDIT = "EDIT",
  ACTION = "ACTION",
}
export interface TaskMetadataAttr {
  task: string;
  done: boolean;
  due_date: number;
  before_due_date: string[];
}

export interface StageChangeMetadataAttr {
  from_stage: string;
  to_stage: string;
}
export interface ActionMetadataAttr {
  action: string;
}
export interface CommentMetadataAttr {
  comment: string;
}
export interface NoteMetadataAttr {
  note: string;
}
export interface EditMetadataAttr {
  field: string;
  old_value: string;
  new_value: string;
}
export interface DealActivityAttr {
  id: string;
  deal_id: number;
  deal?: DealAttr;
  user_id: number | null;
  user?: UserAttr;
  type: DealActivityType;
  is_pin: boolean;
  metadata:
    | TaskMetadataAttr
    | StageChangeMetadataAttr
    | EditMetadataAttr[]
    | ActionMetadataAttr
    | NoteMetadataAttr
    | CommentMetadataAttr;

  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}
