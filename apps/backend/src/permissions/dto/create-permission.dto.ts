import { IsString, IsObject, IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  role: string;

  @IsObject()
  @IsNotEmpty()
  permissions: {
    browse_properties?: boolean;
    add_property?: boolean;
    edit_own_property?: boolean;
    delete_own_property?: boolean;
    view_all_users?: boolean;
    add_user?: boolean;
    edit_user?: boolean;
    delete_user?: boolean;
    manage_permissions?: boolean;
  };
}
