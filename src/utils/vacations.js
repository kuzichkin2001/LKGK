import RequestsVacationCreateScreen from '../screens/RequestsVacationCreate';

export const isRequestTypeAbsence = type => {
  return (
    type === RequestsVacationCreateScreen.vacation_type_Absence_Personal ||
    type === RequestsVacationCreateScreen.vacation_type_Absence_Workers
  );
};

export const isRequestTypeVacation = type => {
  return (
    type === RequestsVacationCreateScreen.vacation_type_Vacation_Paid ||
    type === RequestsVacationCreateScreen.vacation_type_Vacation_Not_Paid
  );
};
