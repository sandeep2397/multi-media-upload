/*
©2022 Pivotree | All rights reserved
*/
export const getBadgeCount = (dataArray: Array<any>, state: any) => {
  const fields = dataArray || [];
  let count = 0;

  fields.forEach((field: any) => {
    if (
      field['type'] === 'select' &&
      state[field?.name] &&
      state[field?.name]?.value !== ''
    ) {
      count++;
    } else if (field['type'] === 'radio') {
      if (state[field?.name] && state[field.name] !== '') {
        count++;
      }
    } else if (
      (field['type'] === 'inputField' || field['type'] === 'autoSuggest') &&
      state[field?.name] &&
      state[field?.name] !== ''
    ) {
      count++;
    } else if (
      field['type'] === 'multiSelect' &&
      field['value'] &&
      Array.isArray(field['value']) &&
      field['value'].length > 0
    ) {
      count++;
    } else if (
      (field['type'] === 'datePicker' || field['type'] === 'dateTimePicker') &&
      field['extendedData'] &&
      Array.isArray(field['extendedData'])
    ) {
      const dateFields = field['extendedData'] || [];
      if (
        Array.isArray(dateFields) &&
        dateFields.some((data: any) => data.value !== undefined)
      )
        count++;
    }
  });

  return count;
};
