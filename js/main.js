(() => {
  const SPLASH_DURATION = 7000; // ms — mantener sincronizado con $splash-duration en el SCSS
  const SILENCE_GAP = 1500;     // ms de silencio entre el sonido de ultratumba y la canción
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----- Idioma ES / EN -----
  // El español vive en el HTML; aquí sólo está el inglés. Los elementos se marcan con
  // data-i18n (texto), data-i18n-html (HTML) o data-i18n-attr="atributo:clave;...".
  const EN = {
    'meta.title': 'Blessed Extinction | Death Metal · Bogotá',
    'meta.description': 'Blessed Extinction — Death Metal since 2013, Bogotá, Colombia. New single “Incorruptible Cadavérico” out now on all platforms.',
    'splash.label': 'Welcome screen',
    'splash.kicker': 'New single',
    'splash.enter': 'Enter',
    'nav.label': 'Main navigation',
    'nav.menu': 'Open menu',
    'nav.home': 'Home',
    'nav.music': 'Music',
    'nav.videos': 'Videos',
    'nav.listen': 'Listen',
    'nav.band': 'Band',
    'nav.store': 'Store',
    'nav.tour': 'Shows',
    'nav.contact': 'Contact',
    'hero.kicker': 'New single',
    'hero.subtitle': 'Metal from Bogotá, Colombia, since 2013. The new single is out now with its official lyric video.',
    'hero.watch': 'Watch lyric video',
    'hero.spotify': 'Listen on Spotify',
    'hero.scroll': 'Scroll down',
    'disc.title': 'Discography',
    'disc.new': 'New',
    'disc.newSingle': 'New single',
    'disc.altInc': 'Cover of the single Incorruptible Cadavérico',
    'disc.altSie': 'Cover of the single Siembra de Cadáveres',
    'disc.altVen': 'Cover of the EP Venganza Natural',
    'player.tabs': 'Choose a release',
    'player.title': 'Spotify player — Blessed Extinction',
    'video.official': 'Official video',
    'video.lyric': 'Official lyric video',
    'video.video': 'Video',
    'video.channel': 'Visit YouTube channel',
    'video.playInc': 'Play the Incorruptible Cadavérico lyric video',
    'video.playSie': 'Play the Siembra de Cadáveres official video',
    'video.playDes': 'Play the Desollados video',
    'platforms.title': 'Listen & Follow',
    'platforms.platforms': 'Platforms',
    'platforms.social': 'Social media',
    'bio.photoAlt': 'Blessed Extinction, left to right: Jhon Hernández, William Ruiz, Julio Sarmiento, Carlos Sarmiento and Julián Franco',
    'bio.photoZoom': 'View full photo',
    'bio.photoCaption': 'Bogotá · Since 2013',
    'bio.photoDialog': 'Band photo',
    'bio.photoClose': 'Close',
    'bio.title': 'The Band',
    'bio.p1': 'Blessed Extinction is a Colombian metal band that came together in Bogotá in late 2013, influenced by Death Metal, Thrash and New York Hardcore. The band was born after the breakup of its members’ previous projects, with one main goal: to build a solid, consistent band that leaves its mark on the history of Colombian metal, like other major bands from our country.',
    'bio.p2': 'An apocalyptic world and social decline are among the main themes of the band’s lyrics, along with personal experiences and thoughts, driven by heavy guitar riffs and aggressive vocals.',
    'bio.p3': 'After the EP <em>Venganza Natural</em> and the single <em>Siembra de Cadáveres</em>, the band presents its new single <em>Incorruptible Cadavérico</em>.',
    'bio.members': 'Members',
    'role.vocals': 'Vocals',
    'role.guitar': 'Guitar',
    'role.bass': 'Bass',
    'role.drums': 'Drums',
    'tour.title': 'Upcoming Shows',
    'tour.emptyTitle': 'No dates announced yet',
    'tour.emptyText': 'New dates will be announced soon. Follow us on social media to hear about them first.',
    'footer.tagline': 'Death Metal since 2013 · Bogotá, Colombia',
    'footer.contact': 'Contact',
    'footer.contactText': 'Booking, press and collaborations:',
    'footer.replay': 'Replay the beginning ↻',
    'splash.hint': 'Sound experience · turn up the volume',
    'splash.mute': 'Enter without sound',
    'splash.skip': 'Skip intro ⏭',
    'np.tap': 'Press ▶ to listen',
    'np.close': 'Close player',
    'footer.game': 'Mini game ⌛',
    'game.teaser': 'Meanwhile… can you stop the pendulum? ⏳',
    'game.close': 'Close',
    'game.kicker': 'Mini game',
    'game.title': 'The Pendulum',
    'game.rules': 'Stop the pendulum inside the golden zone. Every hit makes it faster. Three misses and you’re buried.',
    'game.start': 'Play',
    'game.best': 'Best',
    'game.hint': 'Tap the screen or press Space',
    'game.overKicker': 'Buried',
    'game.newBest': 'New record!',
    'game.again': 'Play again',
    'game.promo': 'Survived? Now hear what sounds on the other side.',
    'game.perfect': 'Perfect!',
    'game.hit': 'Good',
    'game.miss': 'Miss',
    'game.youtube': 'YouTube channel',
    'game.spotify': 'Listen on Spotify',
    'game.merch': 'Merch',
    'chat.open': 'Message the band',
    'chat.title': 'Message the band',
    'chat.sub': 'We reply from Telegram',
    'chat.close': 'Close chat',
    'chat.intro': 'Booking, merch or just saying hi? Write to us and someone from the band will reply. The conversation is saved in this browser, so you can come back later for the answer.',
    'chat.placeholder': 'Type your message…',
    'chat.namePlaceholder': 'What’s your name?',
    'chat.name': 'Your name',
    'chat.input': 'Message',
    'chat.send': 'Send',
    'chat.note': '🔒 Encrypted connection. Don’t share passwords or bank details.',
    'chat.band': 'Blessed Extinction',
    'chat.sending': 'Sending…',
    'chat.error': 'Couldn’t send it. Try again.',
    'chat.rate': 'Too many messages in a row. Wait a few minutes.',
    'chat.captcha': 'Verification failed. Try again.',
    'chat.offline': 'The chat isn’t available yet.',
    'store.title': 'Store',
    'store.lead': 'Official band merch. Order by email and we’ll reply to sort out payment and shipping.',
    'store.soldout': 'Sold Out',
    'store.teeName': 'Blessed Extinction T-shirt',
    'store.teeDesc': 'Black with a front print. Pick the logo color.',
    'store.hoodieName': 'Zip hoodie',
    'store.hoodieDesc': 'Black, front logo and full back print.',
    'store.hoodieAlt': 'Black zip hoodie: logo on the front, skulls and logo on the back',    'store.cdName': 'Venganza Natural CD',
    'store.cdDesc': 'The EP on physical format.',
    'store.cdAlt': 'Venganza Natural EP on CD',
    'store.color': 'Logo color',
    'store.green': 'Green logo',
    'store.red': 'Red logo',
    'store.blue': 'Blue logo',
    'store.sizes': 'Size',
    'store.size': 'Size',
    'store.order': 'Order by email',
    'store.vote': '🔔 I want it back',
    'store.voted': '✓ Vote counted',
    'store.notify': 'Email me when it’s back',
    'store.pickSize': 'Pick a size first.',
    'store.votedText': 'The band already knows. Want us to tell you when it’s back?',
    'store.voteError': 'Couldn’t save your vote. Try again later.',
    'store.orderMsg': 'Hi! I’d like to order: {item}. How do I pay and get it shipped?',
    'store.notifyMsg': 'Hi! Let me know when this is back: {item}.',
    'store.orderSubject': 'Merch order',
    'store.notifySubject': 'Let me know when it’s back',
    'store.mailHint': 'If your email app didn’t open, write to us at jhonblessedextinction@gmail.com',
  };

  // Textos en español que sólo genera el JS (no están en el HTML)
  const ES_JS = {
    'game.perfect': '¡Perfecto!',
    'game.hit': 'Bien',
    'game.miss': 'Fallo',
    'game.youtube': 'Canal de YouTube',
    'game.spotify': 'Escuchar en Spotify',
    'game.merch': 'Merch',
    'chat.band': 'Blessed Extinction',
    'chat.sending': 'Enviando…',
    'chat.error': 'No se pudo enviar. Inténtalo de nuevo.',
    'chat.rate': 'Demasiados mensajes seguidos. Espera unos minutos.',
    'chat.captcha': 'No se pudo verificar. Inténtalo de nuevo.',
    'chat.offline': 'El chat aún no está disponible.',
    'store.size': 'Talla',
    'store.voted': '✓ Voto anotado',
    'store.pickSize': 'Primero elige una talla.',
    'store.votedText': 'La banda ya se enteró. ¿Quieres que te avisemos cuando vuelva?',
    'store.voteError': 'No se pudo registrar el voto. Inténtalo más tarde.',
    'store.orderMsg': '¡Hola! Quiero pedir: {item}. ¿Cómo hago el pago y el envío?',
    'store.notifyMsg': '¡Hola! Avísenme cuando vuelva: {item}.',
    'store.orderSubject': 'Pedido de merch',
    'store.notifySubject': 'Avísenme cuando vuelva',
    'store.mailHint': 'Si no se abrió tu correo, escríbenos a jhonblessedextinction@gmail.com',
  };

  const LANG_KEY = 'be-lang';
  const ES = { ...ES_JS }; // textos originales en español, tomados del HTML
  let currentLang = 'es';
  const tr = (key) => (currentLang === 'en' ? EN[key] : undefined) ?? ES[key];
  const i18nText = document.querySelectorAll('[data-i18n]');
  const i18nHtml = document.querySelectorAll('[data-i18n-html]');
  const i18nAttr = document.querySelectorAll('[data-i18n-attr]');
  const attrPairs = (el) => el.dataset.i18nAttr.split(';').map((pair) => pair.split(':'));

  i18nText.forEach((el) => { ES[el.dataset.i18n] = el.textContent; });
  i18nHtml.forEach((el) => { ES[el.dataset.i18nHtml] = el.innerHTML; });
  i18nAttr.forEach((el) => attrPairs(el).forEach(([attr, key]) => { ES[key] = el.getAttribute(attr); }));

  const setLang = (lang) => {
    const dict = lang === 'en' ? EN : ES;
    const t = (key) => dict[key] ?? ES[key];
    currentLang = lang;
    document.documentElement.lang = lang;
    i18nText.forEach((el) => { el.textContent = t(el.dataset.i18n); });
    i18nHtml.forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    i18nAttr.forEach((el) => attrPairs(el).forEach(([attr, key]) => {
      if (el.hasAttribute(attr)) el.setAttribute(attr, t(key));
    }));
    document.querySelectorAll('.lang__btn').forEach((btn) =>
      btn.setAttribute('aria-pressed', btn.dataset.lang === lang)
    );
    try { localStorage.setItem(LANG_KEY, lang); } catch (_) { /* almacenamiento no disponible */ }
  };

  let savedLang = null;
  try { savedLang = localStorage.getItem(LANG_KEY); } catch (_) { /* almacenamiento no disponible */ }
  const browserLang = (navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en';
  setLang(savedLang === 'es' || savedLang === 'en' ? savedLang : browserLang);

  document.querySelectorAll('.lang__btn').forEach((btn) =>
    btn.addEventListener('click', () => setLang(btn.dataset.lang))
  );

  // ----- Sonido de ultratumba (sintetizado con Web Audio, sin archivos) -----
  // Drone grave disonante, viento, coro fantasmal y campanas en una catedral (reverb).
  const Ultratumba = (() => {
    let ctx = null;
    let master = null;

    const noiseBuffer = (seconds) => {
      const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let n = 0; n < data.length; n++) data[n] = Math.random() * 2 - 1;
      return buf;
    };

    // Respuesta al impulso: ruido que decae → eco de nave de catedral
    const cathedral = (seconds, decay) => {
      const len = ctx.sampleRate * seconds;
      const buf = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = buf.getChannelData(ch);
        for (let n = 0; n < len; n++) data[n] = (Math.random() * 2 - 1) * Math.pow(1 - n / len, decay);
      }
      return buf;
    };

    const bell = (bus, at, freq, level) => {
      // Parciales inarmónicos de campana de iglesia
      [1, 2.01, 2.76, 4.07, 5.43, 6.8].forEach((ratio, k) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.frequency.value = freq * ratio;
        const peak = level / (k + 1);
        g.gain.setValueAtTime(0, at);
        g.gain.linearRampToValueAtTime(peak, at + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, at + 4.5 / (1 + k * 0.4));
        osc.connect(g).connect(bus);
        osc.start(at);
        osc.stop(at + 5);
      });
    };

    const play = (dur) => {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      const now = ctx.currentTime;

      master = ctx.createGain();
      master.gain.setValueAtTime(0, now);
      master.gain.linearRampToValueAtTime(0.85, now + 0.8);
      // Se apaga solo antes del final de la intro (incluida la cola de reverb)
      master.gain.setValueAtTime(0.85, now + dur - 2);
      master.gain.linearRampToValueAtTime(0, now + dur - 0.3);
      const comp = ctx.createDynamicsCompressor();
      master.connect(comp).connect(ctx.destination);

      const bus = ctx.createGain();
      const dry = ctx.createGain();
      const wet = ctx.createGain();
      const reverb = ctx.createConvolver();
      dry.gain.value = 0.55;
      wet.gain.value = 0.7;
      reverb.buffer = cathedral(5, 2.2);
      bus.connect(dry).connect(master);
      bus.connect(reverb).connect(wet).connect(master);

      const end = now + dur;

      // Golpe sub-grave al abrirse la puerta
      const boom = ctx.createOscillator();
      const boomG = ctx.createGain();
      boom.frequency.setValueAtTime(70, now);
      boom.frequency.exponentialRampToValueAtTime(28, now + 1.4);
      boomG.gain.setValueAtTime(0.9, now);
      boomG.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      boom.connect(boomG).connect(bus);
      boom.start(now);
      boom.stop(now + 2);

      // Drone: E1 y su tritono, sierras desafinadas a través de un filtro que se abre
      const droneLP = ctx.createBiquadFilter();
      droneLP.type = 'lowpass';
      droneLP.Q.value = 5;
      droneLP.frequency.setValueAtTime(80, now);
      droneLP.frequency.linearRampToValueAtTime(380, now + dur);
      const droneG = ctx.createGain();
      droneG.gain.value = 0.2;
      droneLP.connect(droneG).connect(bus);
      [[41.2, -8], [41.2, 9], [58.27, 0], [82.4, 4]].forEach(([f, detune]) => {
        const o = ctx.createOscillator();
        o.type = 'sawtooth';
        o.frequency.value = f;
        o.detune.value = detune;
        o.connect(droneLP);
        o.start(now);
        o.stop(end);
      });

      // Viento / aliento: ruido filtrado con barrido lento
      const wind = ctx.createBufferSource();
      wind.buffer = noiseBuffer(2);
      wind.loop = true;
      const windBP = ctx.createBiquadFilter();
      windBP.type = 'bandpass';
      windBP.Q.value = 7;
      windBP.frequency.value = 450;
      const windLfo = ctx.createOscillator();
      const windDepth = ctx.createGain();
      windLfo.frequency.value = 0.25;
      windDepth.gain.value = 260;
      windLfo.connect(windDepth).connect(windBP.frequency);
      const windG = ctx.createGain();
      windG.gain.setValueAtTime(0, now);
      windG.gain.linearRampToValueAtTime(0.35, now + 1.5);
      wind.connect(windBP).connect(windG).connect(bus);
      wind.start(now);
      windLfo.start(now);
      wind.stop(end);
      windLfo.stop(end);

      // Coro fantasmal: acorde disminuido con vibrato, entra con el título
      const choirLP = ctx.createBiquadFilter();
      choirLP.type = 'lowpass';
      choirLP.frequency.value = 1400;
      const choirG = ctx.createGain();
      choirG.gain.setValueAtTime(0, now);
      choirG.gain.linearRampToValueAtTime(0, now + 3.2);
      choirG.gain.linearRampToValueAtTime(0.07, now + 4.6);
      choirLP.connect(choirG).connect(bus);
      [164.81, 196, 233.08, 329.63].forEach((f, k) => {
        const o = ctx.createOscillator();
        const vib = ctx.createOscillator();
        const vibDepth = ctx.createGain();
        o.type = 'triangle';
        o.frequency.value = f;
        vib.frequency.value = 4.5 + k * 0.3;
        vibDepth.gain.value = f * 0.012;
        vib.connect(vibDepth).connect(o.frequency);
        o.connect(choirLP);
        o.start(now);
        vib.start(now);
        o.stop(end);
        vib.stop(end);
      });

      // Campanadas: cuando aparece el logo y cuando se revela el título
      bell(bus, now + 0.6, 98, 0.22);
      bell(bus, now + 2.2, 73.4, 0.18);
      bell(bus, now + 3.8, 98, 0.2);
    };

    const stop = (fade = 1.5) => {
      if (!ctx || !master) return;
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + fade);
      const old = ctx;
      ctx = null;
      setTimeout(() => old.close(), (fade + 0.2) * 1000);
    };

    return { play, stop };
  })();

  // ----- Cristales rotos al estallar el vitral (sintetizado con Web Audio, sin archivos) -----
  // Golpe seco y chasquido al romperse, un tintineo por cada trozo que se suelta y
  // esquirlas sueltas mientras caen. Los tiempos los marca la animación (shatterSplash).
  const Glass = (() => {
    let ctx = null;
    let reverbBuf = null;

    // Ruido con caída exponencial ya grabada en el buffer
    const decayingNoise = (seconds, decay, channels = 1) => {
      const len = Math.floor(ctx.sampleRate * seconds);
      const buf = ctx.createBuffer(channels, len, ctx.sampleRate);
      for (let ch = 0; ch < channels; ch++) {
        const data = buf.getChannelData(ch);
        for (let n = 0; n < len; n++) data[n] = (Math.random() * 2 - 1) * Math.pow(1 - n / len, decay);
      }
      return buf;
    };

    // Se crea con el clic del usuario: así el contexto ya está activo y sin retardo al estallar
    const prepare = () => {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC || ctx) return;
      ctx = new AC();
      reverbBuf = decayingNoise(2.5, 3, 2);
    };

    const ping = (bus, t, f, level, ring) => {
      const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (pan) {
        pan.pan.value = Math.random() * 1.6 - 0.8;
        pan.connect(bus);
      }
      [1, 2.76].forEach((ratio, p) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.value = f * ratio;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(level / (p + 1), t + 0.003);
        g.gain.exponentialRampToValueAtTime(0.0001, t + ring / (p + 1));
        o.connect(g).connect(pan || bus);
        o.start(t);
        o.stop(t + ring + 0.05);
      });
    };

    // impact: segundos hasta que se rompe · releases: segundos en que se suelta cada trozo
    // Devuelve la latencia de salida (s) para que la imagen espere lo mismo que el sonido
    const shatter = ({ impact, releases }) => {
      if (!ctx) return 0;
      ctx.resume();
      const now = ctx.currentTime;
      const hit = now + impact;

      const master = ctx.createGain();
      master.gain.value = 0.8;
      master.connect(ctx.createDynamicsCompressor()).connect(ctx.destination);
      // Eco corto de nave: el mismo espacio que el sonido de ultratumba
      const reverb = ctx.createConvolver();
      reverb.buffer = reverbBuf;
      const wet = ctx.createGain();
      wet.gain.value = 0.35;
      reverb.connect(wet).connect(master);
      const bus = ctx.createGain();
      bus.connect(master);
      bus.connect(reverb);

      // Golpe grave del impacto
      const thump = ctx.createOscillator();
      const thumpG = ctx.createGain();
      thump.frequency.setValueAtTime(140, hit);
      thump.frequency.exponentialRampToValueAtTime(40, hit + 0.25);
      thumpG.gain.setValueAtTime(0.7, hit);
      thumpG.gain.exponentialRampToValueAtTime(0.001, hit + 0.35);
      thump.connect(thumpG).connect(bus);
      thump.start(hit);
      thump.stop(hit + 0.4);

      // Chasquido: ruido agudo muy corto + cuerpo del estallido algo más largo
      [[0.25, 6, 'highpass', 2500, 0.9], [0.9, 3, 'bandpass', 3800, 0.45]].forEach(([dur, decay, type, freq, level]) => {
        const src = ctx.createBufferSource();
        src.buffer = decayingNoise(dur, decay);
        const filter = ctx.createBiquadFilter();
        filter.type = type;
        filter.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.value = level;
        src.connect(filter).connect(g).connect(bus);
        src.start(hit);
      });

      // Cada trozo que se suelta da su propio golpecito de cristal
      releases.forEach((r) => {
        for (let k = 0; k < 3; k++) {
          ping(bus, now + r + k * (0.015 + Math.random() * 0.03), 1800 + Math.random() * 4500, 0.09 + Math.random() * 0.06, 0.12 + Math.random() * 0.3);
        }
      });

      // Esquirlas sueltas: más densas justo tras el impacto y se apagan mientras caen
      for (let k = 0; k < 45; k++) {
        const t = hit + 0.02 + Math.pow(Math.random(), 1.8) * 1.6;
        ping(bus, t, 2200 + Math.random() * 6000, (0.04 + Math.random() * 0.07) * (1 - (t - hit) / 2), 0.06 + Math.random() * 0.3);
      }

      // Se cierra al terminar y se vuelve a crear en el siguiente clic (repetir intro)
      const old = ctx;
      ctx = null;
      setTimeout(() => old.close(), 5000);
      return old.outputLatency || old.baseLatency || 0;
    };

    return { prepare, shatter };
  })();

  // ----- Canción al entrar: "Incorruptible Cadavérico" en Spotify -----
  // El reproductor se crea oculto al cargar la página para que esté listo al entrar.
  // Spotify sólo entrega la canción completa a visitantes con sesión iniciada; sin
  // sesión reproduce una vista previa corta, así que el salto a SONG_START_AT se hace sólo
  // cuando la pista dura más que eso (saltar más allá de la vista previa la detiene).
  const Music = (() => {
    const SONG_START_AT = '0:30'; // minuto:segundo donde arranca la canción al entrar
    const SONG_START = SONG_START_AT.split(':').reduce((acc, part) => acc * 60 + Number(part), 0); // segundos
    const SPOTIFY_URI = 'spotify:track:3SSYo3fM6wHw28QY71RTwC';
    const box = document.getElementById('nowPlaying');
    let controller = null;
    let wantPlay = false;
    let playing = false;
    let seeked = false;
    let fullTrack = false;   // true si Spotify entrega la canción completa (sesión iniciada)
    let startedOnce = false;

    window.onSpotifyIframeApiReady = (api) => {
      api.createController(document.getElementById('npSpotify'), { uri: SPOTIFY_URI, width: '100%', height: 80 }, (c) => {
        controller = c;
        c.addListener('ready', () => { if (wantPlay) c.play(); });
        c.addListener('playback_update', ({ data }) => {
          playing = !data.isPaused;
          if (data.duration) fullTrack = data.duration > SONG_START * 1000;
          if (playing) box.classList.remove('needs-tap');
          if (playing && !data.isBuffering && !seeked && data.duration > SONG_START * 1000) {
            seeked = true;
            if (data.position < (SONG_START - 2) * 1000) c.seek(SONG_START);
          }
        });
      });
    };
    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;
    document.head.appendChild(script);

    const setVisible = (visible) => {
      box.classList.toggle('is-offstage', !visible);
      document.body.classList.toggle('has-player', visible); // deja sitio al final de la página
      box.inert = !visible;
      box.setAttribute('aria-hidden', String(!visible));
    };

    const start = () => {
      wantPlay = true;
      setVisible(true);
      // Al repetir la intro, la canción vuelve a SONG_START_AT (o al inicio de la vista previa)
      if (controller && startedOnce) controller.seek(fullTrack ? SONG_START : 0);
      startedOnce = true;
      if (controller) controller.play();
      // Si el navegador bloqueó la reproducción automática, invitar a pulsar play
      setTimeout(() => { if (wantPlay && !playing) box.classList.add('needs-tap'); }, 4000);
    };

    const pause = () => {
      wantPlay = false;
      if (controller && playing) controller.pause();
    };

    document.getElementById('npClose').addEventListener('click', () => {
      pause();
      box.classList.remove('needs-tap');
      setVisible(false);
    });

    return { start, pause };
  })();

  // ----- Splash screen (Incorruptible Cadavérico) -----
  const splash = document.getElementById('splash');
  const enterBtn = document.getElementById('splashEnter');

  // Título: cada letra en un <span> para revelarla en secuencia
  const title = document.getElementById('splashTitle');
  title.setAttribute('aria-label', title.textContent);
  let i = 0;
  title.innerHTML = title.textContent
    .split(' ')
    .map((word) => `<span class="word" aria-hidden="true">${[...word]
      .map((ch) => `<span class="char" style="--i:${i++}">${ch}</span>`)
      .join('')}</span>`)
    .join(' ');

  // Polvo dorado flotando como en la nave de una catedral
  const dust = document.getElementById('splashDust');
  if (!reduceMotion) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('span');
      const rnd = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
      p.style.left = `${rnd(0, 100)}%`;
      p.style.setProperty('--s', `${rnd(1, 3.5)}px`);
      p.style.setProperty('--d', `${rnd(5, 11)}s`);
      p.style.setProperty('--delay', `${rnd(-10, 0)}s`);
      p.style.setProperty('--x', `${rnd(-60, 60)}px`);
      p.style.setProperty('--o', rnd(0.3, 0.9));
      frag.appendChild(p);
    }
    dust.appendChild(frag);
  }

  // Copia del splash congelada en su fotograma actual (las animaciones CSS se sincronizan)
  // pts: vértices del trozo y [ox, oy]: su eje de giro, en px de pantalla. Cada trozo
  // ocupa sólo su caja (no la pantalla entera) y sus animaciones quedan en pausa: en el
  // móvil, 16 capas a pantalla completa y animadas colgaban la salida.
  const snapshotSplash = (layer, pts, [ox, oy]) => {
    const xs = pts.map(([x]) => x);
    const ys = pts.map(([, y]) => y);
    const left = Math.max(0, Math.floor(Math.min(...xs)));
    const top = Math.max(0, Math.floor(Math.min(...ys)));
    const right = Math.min(innerWidth, Math.ceil(Math.max(...xs)));
    const bottom = Math.min(innerHeight, Math.ceil(Math.max(...ys)));
    const piece = document.createElement('div');
    piece.className = 'splash-exit__piece';
    Object.assign(piece.style, {
      left: `${left}px`,
      top: `${top}px`,
      width: `${right - left}px`,
      height: `${bottom - top}px`,
      transformOrigin: `${ox - left}px ${oy - top}px`,
    });
    const copy = splash.cloneNode(true);
    copy.removeAttribute('id');
    copy.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
    // La copia sigue midiendo la pantalla; se desplaza para que su trozo caiga dentro de la caja
    Object.assign(copy.style, {
      inset: 'auto',
      left: `${-left}px`,
      top: `${-top}px`,
      width: `${innerWidth}px`,
      height: `${innerHeight}px`,
      clipPath: `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(', ')})`,
    });
    piece.appendChild(copy);
    layer.appendChild(piece);
    const src = [splash, ...splash.querySelectorAll('*')];
    const twins = new Map([copy, ...copy.querySelectorAll('*')].map((n, k) => [n, src[k]]));
    // Sin polvo en los trozos: son muchas copias y no se nota
    copy.querySelectorAll('.splash__dust').forEach((n) => n.remove());
    if (copy.getAnimations) {
      copy.getAnimations({ subtree: true }).forEach((anim) => {
        if (!anim.animationName) return;
        const twin = twins.get(anim.effect.target)?.getAnimations()
          .find((a) => a.animationName === anim.animationName);
        if (twin) anim.currentTime = twin.currentTime;
        anim.pause();
      });
    }
    return piece;
  };

  const makeLayer = (kind) => {
    const layer = document.createElement('div');
    layer.className = `splash-exit splash-exit--${kind}`;
    layer.setAttribute('aria-hidden', 'true');
    layer.inert = true;
    document.body.appendChild(layer);
    return layer;
  };

  // Salida: la pantalla estalla como un vitral; los trozos del centro saltan hacia el espectador y el resto cae.
  // Primero se crean los trozos (clonar es lento) y, ya pintados, arrancan a la vez animación y sonido.
  const IMPACT = 100; // ms desde que arranca la salida hasta que el cristal se rompe
  const shatterSplash = (sound) => {
    const layer = makeLayer('vitral');
    const w = innerWidth;
    const h = innerHeight;
    const cx = w * (0.44 + Math.random() * 0.12);
    const cy = h * (0.38 + Math.random() * 0.12);
    const far = Math.hypot(w, h);
    const spokes = Math.min(w, h) < 700 ? 6 : 8; // menos trozos en móvil
    const angles = Array.from({ length: spokes }, (_, k) => ((k + 0.5 + (Math.random() - 0.5) * 0.6) / spokes) * Math.PI * 2);
    const radii = angles.map(() => Math.min(w, h) * (0.14 + Math.random() * 0.12));
    const at = (a, r) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    const shards = []; // [trozo, fotogramas, opciones]
    angles.forEach((a, k) => {
      const b = k + 1 < spokes ? angles[k + 1] : angles[0] + Math.PI * 2;
      const ra = radii[k];
      const rb = radii[(k + 1) % spokes];
      const mid = (a + b) / 2;
      const spin = (Math.random() - 0.5) * 50;

      const inner = [[cx, cy], at(a, ra), at(b, rb)];
      const p1 = snapshotSplash(layer, inner, at(mid, (ra + rb) / 3));
      shards.push([p1, [
        { transform: 'none', opacity: 1 },
        { transform: `translate(${Math.cos(mid) * 6}px, ${Math.sin(mid) * 6}px)`, opacity: 1, offset: 0.15 },
        { transform: `translate(${Math.cos(mid) * w * 0.25}px, ${Math.sin(mid) * h * 0.25}px) scale(1.6) rotate(${spin}deg)`, opacity: 0 },
      ], { duration: 800, delay: IMPACT, easing: 'cubic-bezier(0.4, 0, 0.9, 0.6)', fill: 'forwards' }]);

      const outer = [at(a, ra), at(a, far), at(b, far), at(b, rb)];
      const p2 = snapshotSplash(layer, outer, at(mid, Math.max(ra, rb) * 1.8));
      const drift = Math.cos(mid) * w * 0.15;
      shards.push([p2, [
        { transform: 'none' },
        { transform: `translate(${Math.cos(mid) * 10}px, ${Math.sin(mid) * 10}px)`, offset: 0.12 },
        { transform: `translate(${drift}px, ${h * 1.25}px) rotate(${spin}deg)` },
      ], { duration: 1300 + Math.random() * 400, delay: IMPACT + 60 + Math.random() * 260, easing: 'cubic-bezier(0.5, 0, 0.9, 0.5)', fill: 'forwards', release: 0.12 }]);
    });
    splash.style.display = 'none';

    // Dos fotogramas: los trozos (idénticos a la pantalla) ya están pintados antes de moverse
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      .then(() => {
        // Momento en que cada trozo de fuera se suelta (fin de la grieta) → un tintineo
        const releases = shards
          .filter(([, , o]) => o.release)
          .map(([, , o]) => (o.delay + o.duration * o.release) / 1000);
        const latency = sound ? Glass.shatter({ impact: IMPACT / 1000, releases }) * 1000 : 0;
        const anims = shards.map(([piece, frames, { release, ...opts }]) => piece.animate(frames, { ...opts, delay: opts.delay + latency }));
        return Promise.all(anims.map((anim) => anim.finished));
      })
      .then(() => layer.remove());
  };

  let closed = false;
  const closeSplash = () => {
    if (closed) return;
    closed = true;
    document.body.classList.remove('is-locked');
    // Se oculta (no se elimina) para poder repetir la intro desde el pie de página
    if (reduceMotion) {
      splash.classList.add('is-hidden');
      splash.addEventListener('transitionend', () => { if (closed) splash.style.display = 'none'; }, { once: true });
      return;
    }
    // Red de seguridad: si el vitral falla o se atasca, la pantalla se oculta igualmente
    const hide = () => {
      if (!closed) return;
      splash.style.display = 'none';
      document.querySelectorAll('.splash-exit').forEach((n) => n.remove());
    };
    const fallback = setTimeout(hide, 4000);
    try {
      shatterSplash(withSound).catch(() => {}).then(() => { clearTimeout(fallback); hide(); });
    } catch (err) {
      clearTimeout(fallback);
      hide();
    }
  };

  let started = false;
  let withSound = true;
  let timer = null;

  const enterSite = (gap = SILENCE_GAP) => {
    if (closed) return;
    clearTimeout(timer);
    Ultratumba.stop(0.4);
    closeSplash();
    // Pausa de silencio antes de la canción para que no se monten los sonidos
    if (withSound) setTimeout(Music.start, gap);
  };

  // El clic en "Entrar" es el gesto que permite al navegador reproducir sonido
  const startSequence = (sound) => {
    if (started) return;
    started = true;
    withSound = sound;
    if (sound) {
      Ultratumba.play(SPLASH_DURATION / 1000);
      Glass.prepare();
    }
    splash.classList.remove('is-waiting');
    splash.classList.add('is-playing');
    timer = setTimeout(enterSite, SPLASH_DURATION);
  };

  enterBtn.addEventListener('click', () => startSequence(true));
  // Saltar intro: desde la puerta entra directo con la canción (el clic habilita el
  // audio); durante la secuencia respeta la elección hecha y la pausa de silencio
  document.getElementById('splashSkip').addEventListener('click', () => {
    if (!started) {
      started = true;
      withSound = true;
      Glass.prepare();
      enterSite(0);
    } else {
      enterSite();
    }
  });
  document.getElementById('splashMute').addEventListener('click', () => startSequence(false));
  document.addEventListener('keydown', (e) => {
    if (closed) return;
    if (e.key === 'Escape') {
      // Saltar la intro. Si aún no se eligió, entra sin sonido (Esc no habilita audio)
      if (!started) { started = true; withSound = false; }
      enterSite();
    } else if (e.key === 'Enter' && !e.target.closest('button')) {
      startSequence(true);
    }
  });

  // Repetir la intro (botón del pie). Volver a mostrar el splash tras display:none
  // reinicia sus animaciones; el clic del botón vuelve a habilitar el sonido.
  document.getElementById('replayIntro').addEventListener('click', () => {
    if (!closed) return;
    Music.pause();
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.querySelectorAll('.splash-exit').forEach((n) => n.remove());
    splash.classList.remove('is-hidden', 'is-playing');
    splash.classList.add('is-waiting', 'is-replay');
    splash.style.display = '';
    void splash.offsetWidth; // aplicar el estado inicial antes de arrancar
    document.body.classList.add('is-locked');
    closed = false;
    started = false;
    startSequence(withSound);
  });

  // ----- Header al hacer scroll -----
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Menú móvil -----
  const toggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  toggle.addEventListener('click', () => {
    const open = navList.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });
  navList.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      navList.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );

  // ----- Videos de YouTube (fachada: el iframe se carga al hacer clic) -----
  // YouTube exige un Referer (error 153 sin él). Abierta como archivo local
  // (file://) la página no envía ninguno, así que ahí se abre el video en YouTube.
  const canEmbed = location.protocol === 'http:' || location.protocol === 'https:';
  document.querySelectorAll('.yt[data-yt]').forEach((btn) => {
    const id = btn.dataset.yt;
    btn.style.setProperty('--thumb', `url("https://i.ytimg.com/vi/${id}/hqdefault.jpg")`);
    btn.addEventListener('click', () => {
      if (btn.querySelector('iframe')) return;
      Music.pause();
      if (!canEmbed) {
        window.open(`https://www.youtube.com/watch?v=${id}`, '_blank', 'noopener');
        return;
      }
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&origin=${encodeURIComponent(location.origin)}`;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.title = btn.getAttribute('aria-label');
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      btn.replaceChildren(iframe);
      btn.removeAttribute('aria-label');
    });
  });

  // ----- Reproductor de Spotify: cambiar de lanzamiento -----
  const spotifyFrame = document.getElementById('spotifyFrame');
  // Al interactuar con el reproductor de la discografía, pausar la canción de fondo
  window.addEventListener('blur', () => {
    if (document.activeElement === spotifyFrame) Music.pause();
  });
  // Cada portada de abajo muestra su funda, sus datos y su álbum en el
  // reproductor; el color de acento sigue al lanzamiento (data-release)
  const disc = document.getElementById('disc');
  const picks = disc.querySelectorAll('.disc__pick');
  const panes = disc.querySelectorAll('.disc__record, .disc__info');
  picks.forEach((pick) =>
    pick.addEventListener('click', () => {
      const id = pick.dataset.release;
      if (disc.dataset.release === id) return;
      disc.dataset.release = id;
      picks.forEach((p) => p.setAttribute('aria-selected', p === pick));
      panes.forEach((p) => { p.hidden = p.dataset.release !== id; });
      spotifyFrame.src = `https://open.spotify.com/embed/album/${pick.dataset.album}?utm_source=generator&theme=0`;
    })
  );

  // ----- Foto de la banda: lightbox -----
  const lightbox = document.getElementById('lightbox');
  document.getElementById('bioZoom').addEventListener('click', () => lightbox.showModal());
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.closest('#lightboxClose')) lightbox.close();
  });

  // ----- Linterna con parallax en «Escucha & Sigue» -----
  // La luz y el parallax siguen al cursor (o al dedo); sin puntero, la luz deriva
  // sola. Los valores se suavizan en cada cuadro y el bucle sólo corre mientras
  // la sección está en pantalla.
  const lantern = document.getElementById('lantern');
  const listen = document.getElementById('escuchar');
  if (reduceMotion) {
    lantern.style.setProperty('--my', '35%');
  } else {
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let pointerInside = false;
    let visible = false;
    let frame = 0;
    let t = 0;

    const onPointer = (e) => {
      const r = listen.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      pointerInside = true;
    };
    listen.addEventListener('pointermove', onPointer);
    listen.addEventListener('pointerdown', onPointer);
    listen.addEventListener('pointerleave', () => { pointerInside = false; });

    const tick = () => {
      const w = listen.clientWidth;
      const h = listen.clientHeight;
      if (!pointerInside) {
        t += 0.005;
        target.x = w * (0.5 + 0.3 * Math.sin(t));
        target.y = h * (0.42 + 0.18 * Math.sin(t * 1.7));
      }
      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;
      lantern.style.setProperty('--mx', `${pos.x}px`);
      lantern.style.setProperty('--my', `${pos.y}px`);
      lantern.style.setProperty('--px', ((pos.x / w) * 2 - 1).toFixed(3));
      lantern.style.setProperty('--py', ((pos.y / h) * 2 - 1).toFixed(3));
      frame = visible ? requestAnimationFrame(tick) : 0;
    };

    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) {
        if (!pos.x) { pos.x = listen.clientWidth / 2; pos.y = listen.clientHeight * 0.42; }
        frame = requestAnimationFrame(tick);
      }
    }).observe(listen);
  }

  // ----- Minijuego: El Péndulo -----
  // Detener el péndulo dentro de la zona dorada. Cada acierto lo acelera y achica la
  // zona; tres fallos terminan la partida. Al final, enlaces a YouTube, Spotify y la tienda.
  const GAME_LINKS = [
    { key: 'game.youtube', href: 'https://www.youtube.com/@BlessedExtinction', primary: true },
    { key: 'game.spotify', href: 'https://open.spotify.com/artist/5pcjzTYxRRCxWtVyOKMhJ0' },
    { key: 'game.merch', href: '#tienda' }, // enlace interno: cierra el juego y baja a la tienda
  ];
  (() => {
    const dlg = document.getElementById('game');
    const stage = document.getElementById('gameStage');
    const arm = document.getElementById('gameArm');
    const zone = document.getElementById('gameZone');
    const screens = dlg.querySelectorAll('[data-screen]');
    const scoreEl = dlg.querySelector('[data-game-score]');
    const livesEl = dlg.querySelector('[data-game-lives]');
    const feedback = dlg.querySelector('[data-game-feedback]');
    const PIVOT = [150, 16];
    const R = 160;      // largo del péndulo (unidades del viewBox)
    const SWING = 62;   // grados a cada lado
    const LIVES = 3;
    const BEST_KEY = 'be-pendulum-best';

    let best = 0;
    try { best = Number(localStorage.getItem(BEST_KEY)) || 0; } catch (_) { /* almacenamiento no disponible */ }
    let playing = false;
    let score = 0;
    let lives = LIVES;
    let period = 2.4;   // segundos por oscilación completa
    let half = 14;      // media anchura de la zona, en grados
    let center = 0;
    let phase = 0;
    let angle = 0;
    let last = 0;
    let frame = 0;
    let lockUntil = 0;  // ignora toques justo tras empezar o fallar
    let audio = null;

    const point = (deg) => {
      const a = (deg * Math.PI) / 180;
      return [PIVOT[0] + R * Math.sin(a), PIVOT[1] + R * Math.cos(a)].map((n) => n.toFixed(1));
    };
    const arc = (from, to) => {
      const [x1, y1] = point(from);
      const [x2, y2] = point(to);
      return `M${x1} ${y1} A${R} ${R} 0 0 0 ${x2} ${y2}`;
    };
    document.getElementById('gameTrack').setAttribute('d', arc(-SWING, SWING));

    const show = (name) => screens.forEach((s) => { s.hidden = s.dataset.screen !== name; });
    const setBest = () => dlg.querySelectorAll('[data-game-best]').forEach((el) => { el.textContent = best; });
    const renderLives = () => {
      livesEl.innerHTML = Array.from({ length: LIVES }, (_, k) => `<span${k < lives ? '' : ' class="is-lost"'}>✝</span>`).join('');
    };

    // Sonidos cortos sintetizados (campana al acertar, golpe sordo al fallar)
    const tone = (freq, dur, type, vol) => {
      if (!audio) return;
      const t = audio.currentTime;
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(audio.destination);
      o.start(t);
      o.stop(t + dur);
    };
    const sfx = {
      hit: (perfect) => {
        const f = perfect ? 988 : 659;
        tone(f, 0.6, 'sine', 0.12);
        tone(f * 2.76, 0.25, 'sine', 0.04);
      },
      miss: () => tone(55, 0.45, 'triangle', 0.4),
    };

    const flash = (text, kind) => {
      feedback.textContent = text;
      feedback.className = `game__feedback is-${kind}`;
      void feedback.offsetWidth; // reinicia la animación
      feedback.classList.add('is-on');
    };

    const moveZone = () => {
      const limit = SWING - half - 4;
      for (let k = 0; k < 12; k++) {
        center = (Math.random() * 2 - 1) * limit;
        if (Math.abs(center - angle) > half + 12) break; // que no aparezca bajo el péndulo
      }
      zone.setAttribute('d', arc(center - half, center + half));
    };

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      phase += (dt * Math.PI * 2) / period;
      angle = SWING * Math.sin(phase);
      arm.setAttribute('transform', `rotate(${(-angle).toFixed(2)} ${PIVOT[0]} ${PIVOT[1]})`);
      frame = requestAnimationFrame(tick);
    };
    const run = () => {
      cancelAnimationFrame(frame);
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const halt = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const start = () => {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC && !audio) audio = new AC();
      score = 0;
      lives = LIVES;
      period = 2.4;
      half = 14;
      phase = Math.random() * Math.PI * 2;
      scoreEl.textContent = '0';
      renderLives();
      moveZone();
      show('play');
      playing = true;
      lockUntil = performance.now() + 250;
      run();
    };

    const end = () => {
      playing = false;
      halt();
      const isBest = score > best;
      if (isBest) {
        best = score;
        try { localStorage.setItem(BEST_KEY, String(best)); } catch (_) { /* almacenamiento no disponible */ }
      }
      setTimeout(() => {
        dlg.querySelector('[data-game-final]').textContent = score;
        dlg.querySelector('[data-game-new]').hidden = !isBest;
        setBest();
        const promo = document.getElementById('gamePromo');
        promo.replaceChildren(...GAME_LINKS.map(({ key, href, primary }) => {
          const a = document.createElement('a');
          a.className = `btn btn--sm ${primary ? 'btn--primary' : 'btn--ghost'}`;
          a.href = href;
          if (href.startsWith('#')) {
            a.addEventListener('click', () => dlg.close());
          } else {
            a.target = '_blank';
            a.rel = 'noopener';
          }
          a.textContent = tr(key);
          return a;
        }));
        show('over');
      }, 700);
    };

    const strike = () => {
      const now = performance.now();
      if (!playing || now < lockUntil) return;
      const off = Math.abs(angle - center);
      if (off <= half) {
        const perfect = off <= half * 0.35;
        score += perfect ? 2 : 1;
        scoreEl.textContent = score;
        flash(tr(perfect ? 'game.perfect' : 'game.hit'), perfect ? 'perfect' : 'hit');
        sfx.hit(perfect);
        period = Math.max(0.8, period * 0.93);
        half = Math.max(4.5, half - 0.8);
        moveZone();
      } else {
        lives -= 1;
        renderLives();
        flash(tr('game.miss'), 'miss');
        sfx.miss();
        if (navigator.vibrate) navigator.vibrate(120);
        if (!reduceMotion) {
          stage.classList.remove('is-shaking');
          void stage.offsetWidth;
          stage.classList.add('is-shaking');
        }
        lockUntil = now + 300;
        if (lives <= 0) end();
      }
    };

    document.querySelectorAll('[data-game-open]').forEach((btn) =>
      btn.addEventListener('click', () => {
        setBest();
        show('intro');
        dlg.showModal();
      })
    );
    document.getElementById('gameStart').addEventListener('click', start);
    document.getElementById('gameAgain').addEventListener('click', start);
    document.getElementById('gameClose').addEventListener('click', () => dlg.close());
    dlg.querySelector('[data-screen="play"]').addEventListener('pointerdown', (e) => {
      e.preventDefault();
      strike();
    });
    dlg.addEventListener('keydown', (e) => {
      if (playing && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        strike();
      }
    });
    dlg.addEventListener('close', () => {
      playing = false;
      halt();
      if (audio) { audio.close(); audio = null; }
    });
    // En otra pestaña el juego se congela y sigue al volver
    document.addEventListener('visibilitychange', () => {
      if (!playing) return;
      if (document.hidden) halt();
      else run();
    });
  })();

  // ----- Chat con la banda (Telegram) -----
  // La página sólo habla con el Worker de Cloudflare (carpeta chat-worker-blessed);
  // el token del bot nunca llega al navegador. TURNSTILE_SITEKEY es pública.
  const CHAT_API = 'https://blessed-chat.blessed-chat.workers.dev';
  const TURNSTILE_SITEKEY = '0x4AAAAAAFNvAufF8maHmmyH'; // clave de sitio de Cloudflare Turnstile (pública)
  // En localhost se usa siempre el Worker local (npm run dev): el de producción sólo acepta
  // peticiones desde la web publicada. Abierta como archivo (file://) no hay Worker.
  const devServer = ['localhost', '127.0.0.1'].includes(location.hostname);
  const WORKER_API = location.protocol === 'file:' ? '' : devServer ? 'http://127.0.0.1:8787' : CHAT_API;
  (() => {
    const fab = document.getElementById('chatFab');
    const panel = document.getElementById('chatPanel');
    const log = document.getElementById('chatLog');
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');
    const dot = document.getElementById('chatDot');
    const nameInput = document.getElementById('chatName');
    // Sin Worker (archivo local o CHAT_API vacío) no hay chat
    if (!WORKER_API) return;
    const api = WORKER_API;
    // En localhost, la clave de prueba de Turnstile
    const sitekey = devServer ? '1x00000000000000000000AA' : TURNSTILE_SITEKEY;
    fab.hidden = false;

    const SID_KEY = 'be-chat-sid';
    const SEEN_KEY = 'be-chat-seen';
    const NAME_KEY = 'be-chat-name';
    const store = {
      get: (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } },
      set: (k, v) => { try { localStorage.setItem(k, v); } catch (_) { /* almacenamiento no disponible */ } },
      del: (k) => { try { localStorage.removeItem(k); } catch (_) { /* almacenamiento no disponible */ } },
    };
    let sid = store.get(SID_KEY);
    let seenId = Number(store.get(SEEN_KEY)) || 0;
    let lastId = 0;
    let isOpen = false;
    let timer = 0;
    const shown = new Set(); // ids ya pintados (evita duplicados entre envío y consulta)

    // El nombre sólo se pide para empezar una conversación; la banda lo ve en Telegram
    const syncName = () => {
      nameInput.hidden = !!sid;
      nameInput.required = !sid; // un campo oculto y obligatorio bloquearía el envío
      if (!sid && !nameInput.value) nameInput.value = store.get(NAME_KEY) || '';
    };
    syncName();

    // Los textos se insertan siempre como texto, nunca como HTML
    const bubble = (from, text, name) => {
      const el = document.createElement('div');
      el.className = `chat__msg chat__msg--${from}`;
      if (from === 'band') {
        const who = document.createElement('span');
        who.className = 'chat__who';
        who.textContent = name ? `${name} · ${tr('chat.band')}` : tr('chat.band');
        el.append(who);
      }
      const p = document.createElement('p');
      p.textContent = text;
      el.append(p);
      log.append(el);
      log.scrollTop = log.scrollHeight;
      return el;
    };
    const setStatus = (el, text) => {
      let s = el.querySelector('.chat__status');
      if (!text) { s?.remove(); return; }
      if (!s) {
        s = document.createElement('span');
        s.className = 'chat__status';
        el.append(s);
      }
      s.textContent = text;
    };

    const markSeen = () => {
      seenId = lastId;
      store.set(SEEN_KEY, String(seenId));
      dot.hidden = true;
    };

    const poll = async () => {
      if (!sid || !api) return;
      try {
        const res = await fetch(`${api}/poll?sid=${encodeURIComponent(sid)}&after=${lastId}`, { cache: 'no-store' });
        if (res.status === 404) { sid = null; store.del(SID_KEY); syncName(); return; } // conversación caducada
        if (!res.ok) return;
        const { messages } = await res.json();
        messages.forEach((m) => {
          lastId = Math.max(lastId, m.id);
          if (shown.has(m.id)) return;
          shown.add(m.id);
          bubble(m.from === 'band' ? 'band' : 'me', m.text, m.name);
          if (m.from === 'band' && m.id > seenId && !isOpen) dot.hidden = false;
        });
        if (isOpen) markSeen();
      } catch (_) { /* sin conexión: se reintenta en la siguiente vuelta */ }
    };

    // Con el panel abierto se consulta cada 4 s; cerrado, cada 30 s (para el aviso)
    const schedule = () => {
      clearTimeout(timer);
      if (!sid || document.hidden) return;
      timer = setTimeout(async () => { await poll(); schedule(); }, isOpen ? 4000 : 30000);
    };
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) poll().then(schedule);
    });

    // Turnstile (anti-bots de Cloudflare): se carga sólo al abrir el chat por primera vez
    let tsLoading = null;
    let tsWidget = null;
    let tsToken = '';
    const loadTurnstile = () => {
      if (!sitekey) return Promise.resolve();
      tsLoading ??= new Promise((resolve) => {
        window.onBeTurnstile = () => {
          tsWidget = window.turnstile.render('#chatCaptcha', {
            sitekey,
            theme: 'dark',
            appearance: 'interaction-only',
            language: currentLang,
            callback: (token) => { tsToken = token; },
            'expired-callback': () => { tsToken = ''; },
          });
          resolve();
        };
        const s = document.createElement('script');
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onBeTurnstile&render=explicit';
        s.async = true;
        document.head.append(s);
      });
      return tsLoading;
    };
    const getToken = async () => {
      await loadTurnstile();
      for (let k = 0; k < 40 && !tsToken; k++) await new Promise((r) => setTimeout(r, 250));
      return tsToken;
    };
    const resetToken = () => {
      tsToken = '';
      if (tsWidget !== null && window.turnstile) window.turnstile.reset(tsWidget);
    };

    const openChat = () => {
      isOpen = true;
      panel.hidden = false;
      fab.setAttribute('aria-expanded', 'true');
      document.body.classList.add('chat-open');
      if (!sid) loadTurnstile();
      markSeen();
      poll().then(schedule);
      if (matchMedia('(pointer: fine)').matches) (!sid && !nameInput.value ? nameInput : input).focus();
    };
    const closeChat = () => {
      isOpen = false;
      panel.hidden = true;
      fab.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('chat-open');
      schedule();
      fab.focus();
    };
    fab.addEventListener('click', () => (isOpen ? closeChat() : openChat()));
    document.getElementById('chatClose').addEventListener('click', closeChat);
    panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeChat(); });

    // El cuadro de texto crece hasta 5 líneas; Enter envía en escritorio (Mayús+Enter: salto)
    const autosize = () => {
      input.style.height = 'auto';
      input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
    };
    input.addEventListener('input', autosize);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && matchMedia('(pointer: fine)').matches) {
        e.preventDefault();
        form.requestSubmit();
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text || sendBtn.disabled) return;
      const name = nameInput.value.replace(/\s+/g, ' ').trim();
      if (!sid && !name) { nameInput.focus(); return; }
      const el = bubble('me', text);
      if (!api) {
        setStatus(el, tr('chat.offline'));
        el.classList.add('is-failed');
        return;
      }
      setStatus(el, tr('chat.sending'));
      input.value = '';
      autosize();
      sendBtn.disabled = true;
      try {
        const body = { sid, text, lang: currentLang };
        if (!sid) {
          body.name = name;
          store.set(NAME_KEY, name);
          body.turnstile = await getToken();
        }
        const res = await fetch(`${api}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'error');
        if (data.sid !== sid) {
          sid = data.sid;
          store.set(SID_KEY, sid);
          syncName();
        }
        shown.add(data.id);
        setStatus(el, '');
        schedule();
      } catch (err) {
        el.classList.add('is-failed');
        setStatus(el, tr({ rate: 'chat.rate', captcha: 'chat.captcha' }[err.message] || 'chat.error'));
        if (err.message === 'captcha') { sid = null; store.del(SID_KEY); syncName(); }
        if (!sid) resetToken();
        if (!input.value) { input.value = text; autosize(); }
      } finally {
        sendBtn.disabled = false;
      }
    });

    // Visitante que vuelve: comprobar si la banda respondió mientras no estaba
    if (sid) setTimeout(() => poll().then(schedule), 3000);
  })();

  // ----- Tienda -----
  // Agotado = data-soldout en el producto, o en el color o la talla elegidos. Entonces la
  // foto muestra «Sold Out» y en vez de pedir se vota «Quiero que vuelva»: el voto va al
  // Worker, que lo guarda y avisa al grupo de Telegram (/votos muestra el ranking).
  (() => {
    const CONTACT_MAIL = 'jhonblessedextinction@gmail.com'; // los pedidos llegan a este correo
    const VOTER_KEY = 'be-voter';
    const VOTES_KEY = 'be-votes';
    const store = {
      get: (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } },
      set: (k, v) => { try { localStorage.setItem(k, v); } catch (_) { /* almacenamiento no disponible */ } },
    };
    let voted = [];
    try { voted = JSON.parse(store.get(VOTES_KEY)) || []; } catch (_) { /* valor dañado */ }
    // Identificador anónimo de este navegador: el Worker cuenta un voto por producto y persona
    let voter = store.get(VOTER_KEY);
    if (!/^[A-Za-z0-9_-]{16,64}$/.test(voter || '')) {
      voter = Array.from(crypto.getRandomValues(new Uint8Array(18)), (b) => b.toString(16).padStart(2, '0')).join('');
      store.set(VOTER_KEY, voter);
    }

    // Abre el correo del visitante con el pedido ya escrito
    const toMail = (subject, body) => {
      location.href = `mailto:${CONTACT_MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    document.querySelectorAll('.product').forEach((card) => {
      const print = card.querySelector('[data-print]');
      const orderBtn = card.querySelector('[data-order]');
      const voteBtn = card.querySelector('[data-vote]');
      const hint = card.querySelector('.product__hint');
      const notifyBtn = card.querySelector('[data-notify]');
      const sizeGroup = card.querySelector('[data-opt="size"]');
      const picked = (opt) => card.querySelector(`[data-opt="${opt}"] [aria-pressed="true"]`);

      // Los avisos se guardan como clave (data-i18n) para que sigan el cambio de idioma
      const say = (key, isError = false) => {
        hint.dataset.i18n = key;
        hint.textContent = key === 'store.hintNone' ? '' : tr(key);
        hint.classList.toggle('is-error', isError);
      };
      const item = () => {
        const variant = picked('variant');
        const size = picked('size');
        return {
          product: card.dataset.product,
          variant: variant?.dataset.variant || '',
          size: size?.textContent.trim() || '',
          label: [
            card.querySelector('.product__name').textContent.trim(),
            variant?.getAttribute('aria-label'),
            size && `${tr('store.size')} ${size.textContent.trim()}`,
          ].filter(Boolean).join(' · '),
        };
      };
      const voteKey = () => {
        const { product, variant } = item();
        return variant ? `${product}/${variant}` : product;
      };

      const update = () => {
        const soldout = [card, picked('variant'), picked('size')].some((el) => el?.hasAttribute('data-soldout'));
        const hasVoted = voted.includes(voteKey());
        card.classList.toggle('is-soldout', soldout);
        orderBtn.hidden = soldout;
        voteBtn.hidden = !soldout;
        voteBtn.disabled = hasVoted;
        voteBtn.dataset.i18n = hasVoted ? 'store.voted' : 'store.vote';
        voteBtn.textContent = tr(voteBtn.dataset.i18n);
        notifyBtn.hidden = !(soldout && hasVoted);
        say(soldout && hasVoted ? 'store.votedText' : 'store.hintNone');
      };

      card.querySelectorAll('[data-opt]').forEach((group) =>
        group.addEventListener('click', (e) => {
          const btn = e.target.closest('button');
          if (!btn) return;
          group.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b === btn));
          // data-img cambia la foto (arte de la camiseta o foto real del color);
          // data-hue gira el tono de la foto, para colores sin foto propia (hoodie)
          if (btn.dataset.img) {
            card.querySelectorAll('[data-print], [data-print-bg], [data-variant-img]').forEach((img) => { img.src = btn.dataset.img; });
            if (print) print.alt = item().label;
          }
          if (group.dataset.opt === 'variant') {
            card.style.setProperty('--hue', `${Number(btn.dataset.hue) || 0}deg`);
            card.style.setProperty('--sat', Number(btn.dataset.sat) || 1);
          }
          update();
        })
      );

      orderBtn.addEventListener('click', () => {
        if (sizeGroup && !picked('size')) {
          say('store.pickSize');
          sizeGroup.classList.remove('is-asking');
          void sizeGroup.offsetWidth; // reinicia la animación
          sizeGroup.classList.add('is-asking');
          sizeGroup.querySelector('button').focus();
          return;
        }
        const { label } = item();
        toMail(`${tr('store.orderSubject')} · ${label}`, tr('store.orderMsg').replace('{item}', label));
        // Sin programa de correo configurado, el enlace no hace nada: se muestra la dirección
        say('store.mailHint');
      });

      voteBtn.addEventListener('click', async () => {
        const key = voteKey();
        const { product, variant, size } = item();
        voteBtn.disabled = true;
        say('store.hintNone');
        try {
          if (!WORKER_API) throw new Error('offline');
          const res = await fetch(`${WORKER_API}/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voter, product, variant, size, lang: currentLang }),
          });
          if (!res.ok) throw new Error('error');
          if (!voted.includes(key)) voted.push(key);
          store.set(VOTES_KEY, JSON.stringify(voted));
          update();
        } catch (_) {
          voteBtn.disabled = false;
          say('store.voteError', true);
        }
      });

      notifyBtn.addEventListener('click', () => {
        const { label } = item();
        toMail(`${tr('store.notifySubject')} · ${label}`, tr('store.notifyMsg').replace('{item}', label));
        say('store.mailHint');
      });

      if (print) print.alt = item().label;
      update();
    });
  })();

  document.getElementById('year').textContent = new Date().getFullYear();
})();
