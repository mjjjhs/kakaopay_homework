const HandleError = (e: any): void => {
  if (e.response) {
    e.response.data?.error?.message
      ?
      alert(e.response.data?.error?.message)
      :
      alert(e.response.statusText);
  } else {
    alert(e.message);
  }
};

export default HandleError;