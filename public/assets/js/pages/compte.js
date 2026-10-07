// Page "Mon compte"
(function () {
  var form = document.getElementById('password-form');
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var cur = document.getElementById('pw-current');
    var nw = document.getElementById('pw-new');
    var conf = document.getElementById('pw-confirm');
    App.showFormError(form, '');
    if (nw.value !== conf.value) return App.showFormError(form, 'Les deux nouveaux mots de passe ne sont pas identiques.');
    try {
      await Plateforme.api('POST', '/api/auth/password', { current: cur.value, next: nw.value });
      form.reset();
      App.toast('Mot de passe changé !', { type: 'success' });
    } catch (err) {
      App.showFormError(form, err.message);
    }
  });
})();
