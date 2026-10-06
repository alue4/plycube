/* =====================================================================
   ANIMATIONS — déclenchement
   ---------------------------------------------------------------------
   Ce script fait apparaître en cascade les éléments marqués
   data-anim="apparition" quand ils arrivent à l'écran.

   Pour animer un nouvel élément dans une page HTML, ajoute simplement
   l'attribut :   <div data-anim="apparition">...</div>
   ===================================================================== */
(function () {
  // ---- RÉGLAGES ----------------------------------------------------
  var ACTIVER = true;          // false = aucune apparition animée
  var DECALAGE_MS = 70;        // décalage entre deux éléments voisins (effet cascade)
  var DECALAGE_MAX_MS = 600;   // décalage maximum (pour que les longues listes ne traînent pas)
  // ------------------------------------------------------------------

  // On respecte le réglage "réduire les animations" du téléphone / de l'ordinateur.
  var reduit = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!ACTIVER || reduit || !('IntersectionObserver' in window)) {
    document.documentElement.classList.add('sans-animations');
    return;
  }
  document.documentElement.classList.add('anim-pret');

  // Montre un élément, avec un délai selon sa position parmi ses voisins.
  function montrer(el) {
    var voisins = el.parentElement ? el.parentElement.querySelectorAll(':scope > [data-anim]') : [];
    var rang = Array.prototype.indexOf.call(voisins, el);
    var delai = Math.min(Math.max(rang, 0) * DECALAGE_MS, DECALAGE_MAX_MS);
    el.style.setProperty('--anim-delai', delai + 'ms');
    el.classList.add('anim-visible');
  }

  var observateur = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) {
      if (e.isIntersecting) {
        montrer(e.target);
        observateur.unobserve(e.target); // une seule fois par élément
      }
    });
  }, { rootMargin: '0px 0px -5% 0px' });

  function surveiller(racine) {
    if (racine.matches && racine.matches('[data-anim]:not(.anim-visible)')) observateur.observe(racine);
    if (racine.querySelectorAll) {
      racine.querySelectorAll('[data-anim]:not(.anim-visible)').forEach(function (el) { observateur.observe(el); });
    }
  }

  function demarrer() {
    // Éléments présents au chargement...
    surveiller(document);
    // ...et ceux ajoutés plus tard (listes chargées depuis le serveur).
    new MutationObserver(function (changements) {
      changements.forEach(function (c) {
        c.addedNodes.forEach(function (n) { if (n.nodeType === 1) surveiller(n); });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }
  // Ce script est chargé dans <head> (pour éviter un clignotement) : on attend que la page soit prête.
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
})();
