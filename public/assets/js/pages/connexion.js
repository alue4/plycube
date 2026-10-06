// Page de connexion
(function () {
  var form = document.getElementById('login-form');
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    App.showFormError(form, '');
    btn.disabled = true;
    try {
      await Plateforme.api('POST', '/api/auth/login', {
        username: form.username.value.trim(),
        password: form.password.value,
      });
      location.href = '/';
    } catch (err) {
      App.showFormError(form, err.message);
      form.password.value = '';
      form.password.focus();
    } finally {
      btn.disabled = false;
    }
  });
})();
