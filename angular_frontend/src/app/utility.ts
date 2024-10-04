export const formDataToJson  = (formData: FormData): any => {
  const jsonObject: any = {};

  formData.forEach((value, key) => {
    if (jsonObject[key]) {
      if (Array.isArray(jsonObject[key])) {
        jsonObject[key].push(value);
      } else {
        jsonObject[key] = [jsonObject[key], value];
      }
    } else {
      jsonObject[key] = value;
    }
  });

  return jsonObject;
}
