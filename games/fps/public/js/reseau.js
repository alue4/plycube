// Connexion rapide avec le serveur du jeu (WebSocket sur /games/fps/ws).
export class Reseau {
  constructor() {
    this.ecouteurs = {};
    this.ws = null;
    this.enPause = false;   // pendant le chargement d'une carte, on garde les messages pour plus tard
    this.attente = [];
  }

  on(type, fn) {
    (this.ecouteurs[type] = this.ecouteurs[type] || []).push(fn);
  }

  emettre(type, msg) {
    for (const fn of this.ecouteurs[type] || []) {
      try { fn(msg); } catch (e) { console.error(e); }
    }
  }

  pause() { this.enPause = true; }

  reprendre() {
    this.enPause = false;
    const liste = this.attente;
    this.attente = [];
    for (const msg of liste) this.emettre(msg.t, msg);
  }

  connecter() {
    const proto = location.protocol === 'https:' ? 'wss://' : 'ws://';
    this.ws = new WebSocket(`${proto}${location.host}/games/fps/ws`);
    this.ws.onopen = () => this.emettre('ouvert', {});
    this.ws.onmessage = (ev) => {
      let msg;
      try { msg = JSON.parse(ev.data); } catch { return; }
      if (!msg || typeof msg.t !== 'string') return;
      if (this.enPause) this.attente.push(msg);
      else this.emettre(msg.t, msg);
    };
    this.ws.onclose = (ev) => this.emettre('ferme', { code: ev.code });
  }

  envoyer(msg) {
    if (this.ws && this.ws.readyState === 1) this.ws.send(JSON.stringify(msg));
  }
}
