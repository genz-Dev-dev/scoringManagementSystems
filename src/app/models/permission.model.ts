export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  status: boolean;
  rolesIds: string[];
}
