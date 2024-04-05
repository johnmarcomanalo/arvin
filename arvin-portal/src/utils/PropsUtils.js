// USER LOGIN
export interface LoginProps {
  username: string;
  password: string;
  user_type: string;
  device_id: string;
}
export interface ReduxProps {
  ClientMasterListReducer: any;
  LoginReducer: any;
  CreateOnlineInvitationReducer: { clientList: {}[]; eventTypes: {}[] };
  InvitationTemplateReducer: any;
  ReferenceReducer: any;
  ProfileServiceReducer: any;
  ServiceReducer: any;
}
export interface ResponseProps {
  data: any;
  message: string;
  result: boolean;
  status: string;
  title: string;
}

export interface ClientFormValues {
  client_fname: string;
  client_lname: string;
  client_mname: string;
  client_sname: string;
  client_contact_no: string;
  country: string;
  province: string;
  city_municipality: string;
  barangay: string;
  street: string;
  client_email: string;
  [key: string]: string;
}
export interface EvenTypeProps {
  event_id: string;
  event_type_id: string;
}

export interface AddNewServiceFormModal {
  category_code: string;
  service_name: string;
  service_description: string;
}
