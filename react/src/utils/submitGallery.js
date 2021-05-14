import { API_ROOT } from '../constants/api';
import axios from 'axios';

// https://docs.djangoproject.com/en/dev/ref/csrf/#ajax
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function generate_headers() {
  return {
    headers: {
      'X-CSRFToken': getCookie('csrftoken'),
    },
  };
}

const submitGalleryCreate = async (
  name,
  layout,
  description,
  gallery,
  successCallback,
  failureCallback
) => {
  axios
    .post(
      `${API_ROOT}/gallery/create_or_update_gallery`,
      {
        name: name,
        layout: layout,
        description: description,
        data: gallery,
      },
      generate_headers()
    )
    .then((res) => {
      console.log(res);
      console.log('got to .then');
      successCallback();
    })
    .catch((err) => {
      console.log('got to .catch', err);
      failureCallback();
    });
};

const submitGalleryEdit = async (
  id,
  name,
  layout,
  description,
  gallery,
  successCallback,
  failureCallback
) => {
  axios
    .post(
      `${API_ROOT}/gallery/create_or_update_gallery`,
      {
        id: id,
        name: name,
        layout: layout,
        description: description,
        data: gallery,
      },
      generate_headers()
    )
    .then((res) => {
      console.log(res);
      console.log('got to .then');
      successCallback();
    })
    .catch((err) => {
      console.log('got to .catch', err);
      failureCallback();
    });
};

export { submitGalleryCreate, submitGalleryEdit };
