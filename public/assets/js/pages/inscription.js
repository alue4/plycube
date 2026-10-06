// Page d'inscription (avec code d'invitation)
(function () {
  var form = document.getElementById('register-form');
  // Code dans l'adresse (?code=XXXX) : on le pré-remplit.
  var fromUrl = new URLSearchParams(location.search).get('code');
  if (fromUrl) form.code.value = fromUrl.toUpperCase().slice(0, 40);

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    App.showFormError(form, '');
    form.querySelectorAll('[aria-invalid]').forEach(function (i) { i.removeAttribute('aria-invalid'); });
    if (form.password.value !== form.password2.value) {
      form.password2.setAttribute('aria-invalid', 'true');
      return App.showFormError(form, 'Les deux mots de passe ne sont pas identiques.');
    }
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
      await Plateforme.api('POST', '/api/auth/register', {
        code: form.code.value.trim(),
        username: form.username.value.trim(),
        password: form.password.value,
      });
      location.href = '/';
    } catch (err) {
      App.showFormError(form, err.message);
      if (err.field && form[err.field]) {
        form[err.field].setAttribute('aria-invalid', 'true');
        form[err.field].focus();
      }
    } finally {
      btn.disabled = false;
    }
  });
})();
