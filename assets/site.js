// Lecteur YouTube chargé au clic (économise la bande passante) et filtres de la page des sujets.
document.addEventListener('click', function (e) {
  var b = e.target.closest('.video-lazy');
  if (!b) return;
  var f = document.createElement('iframe');
  f.src = 'https://www.youtube-nocookie.com/embed/' + b.dataset.id + '?autoplay=1&rel=0';
  f.title = b.dataset.title || 'فيديو';
  f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  f.allowFullscreen = true;
  f.className = 'video-frame';
  b.replaceWith(f);
});

(function () {
  var racine = document.querySelector('[data-filtres]');
  if (!racine) return;
  var etat = { type: '', filiere: '' };
  function appliquer() {
    var total = 0;
    document.querySelectorAll('[data-serie]').forEach(function (serie) {
      var visibles = 0;
      serie.querySelectorAll('.liste-corriges').forEach(function (liste) {
        var n = 0;
        liste.querySelectorAll('.corrige').forEach(function (c) {
          var ok = (!etat.type || c.dataset.type === etat.type) &&
                   (!etat.filiere || c.dataset.filieres.split(' ').indexOf(etat.filiere) >= 0);
          c.hidden = !ok;
          if (ok) n++;
        });
        liste.hidden = n === 0;
        var titre = liste.previousElementSibling;
        if (titre && titre.classList.contains('sous-titre')) titre.hidden = n === 0;
        visibles += n;
      });
      serie.hidden = visibles === 0;
      total += visibles;
    });
    var aucun = document.querySelector('[data-aucun]');
    if (aucun) aucun.hidden = total !== 0;
  }
  racine.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    var groupe = chip.parentElement;
    groupe.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('actif'); });
    chip.classList.add('actif');
    etat[groupe.dataset.cle] = chip.dataset.val;
    appliquer();
  });
})();
