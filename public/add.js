'use strict';
  

const submitForm = document.querySelector('form');

submitForm.addEventListener('submit', (event) => {
  event.preventDefault();
    
  let title = document.querySelector('#title').value;
  let url = document.querySelector('#url').value;

  if (title === '' || url === '') {
    alert('Ooops, you forgot to add title or url...')
  } else if (!isValidUrl(url)) {
    alert('Ooops, that is an invalid url...')
  } else {
    fetch('/newpost', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        title: `${title}`,
        url: `${url}`,
        owner: `anonym`
      })
    }).then(window.location.assign(`/`));
  };
})

function isValidUrl(userInput) {
  let regexQuery = "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";
  let url = new RegExp(regexQuery,"i");
  return url.test(userInput);
}
