export interface Student {
  id: string;
  studentCode: string;
  classId: string;
  khFirstName: string;
  khLastName: string;
  enFirstName: string;
  enLastName: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  address: {
    houseNumber: string | null;
    street: string;
    sangkat: string;
    khan: string;
    province: string;
    country: string;
  };
  status: boolean;
}
