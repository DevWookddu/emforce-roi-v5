const request = (data) => {
  const xhr = new XMLHttpRequest();
  // xhr.onreadystatechange = () => {
  //   if (xhr.readyState === xhr.DONE) {
  //     if (xhr.status === 200 || xhr.status === 201) {
  //       console.log(xhr.responseText);
  //     } else {
  //       console.error(xhr.responseText);
  //     }
  //   }
  // };
  xhr.onload = () => {
    console.log(xhr.status);
  };
  xhr.open('POST', '');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
};

export default request;
