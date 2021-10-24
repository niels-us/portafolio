/**
* PHP Email Form Validation - v3.1
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;

      // let action = thisForm.getAttribute('action');
      let name = thisForm[0].value
      let email = thisForm[1].value
      let asunto = thisForm[2].value
      let message = thisForm[3].value
      var action = 'https://api.telegram.org/bot1317860382:AAG8V1yhqiyWUZPj_j0at8wu6ddot5SP90Q/sendmessage?chat_id=263109730&text=||Nombre: ' + name + '||Correo: ' + email + '||Asunto: ' + asunto + '||mensaje: ' + message;
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');

      if (!action) {
        displayError(thisForm, '¡La propiedad de acción de formulario no está establecida!')
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      if (recaptcha) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function () {
            try {
              grecaptcha.execute(recaptcha, { action: 'php_email_form_submit' })
                .then(token => {
                  formData.set('recaptcha-response', token);
                  php_email_form_submit(thisForm, action, formData);
                })
            } catch (error) {
              displayError(thisForm, error)
            }
          });
        } else {
          displayError(thisForm, '¡La URL de la API de JavaScript de reCaptcha no está cargada!')
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });


  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
      .then(response => {
        if (response.ok) {
          return response.text()
        } else {
          throw new Error(`${response.status} ${response.statusText} ${response.url}`);
        }
      })
      .then(data => {
        console.log(data);
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (data.indexOf('"ok":true')) {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
        } else {
          throw new Error(data ? data : 'El envío del formulario falló y no se devolvió ningún mensaje de error de: ' + action);
        }
      })
      .catch((error) => {
        displayError(thisForm, error);
      });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
