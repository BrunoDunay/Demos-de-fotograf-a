import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTERS, SESSIONS } from '../core/content';
import { Reveal } from '../shared/reveal';
import { whatsappLink } from '../shared/whatsapp';

/**
 * Las cuatro sesiones como láminas a pantalla completa: cada foto muy de cerca y el mismo renglón
 * a media altura (cuándo, qué, cuánto dura). Cada lámina se desliza sobre la anterior.
 */
@Component({
  selector: 'app-sessions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section id="sesiones" aria-labelledby="sesiones-t">
      <h2 class="visually-hidden" id="sesiones-t">Sesiones</h2>
      @for (s of sessions; track s.id; let i = $index) {
        <article class="panel" [id]="s.chapter">
          <img [src]="'media/' + s.img + '.webp'" [alt]="s.alt" width="1600" height="1066" loading="lazy" />
          <div class="row">
            <span>{{ s.when }}</span>
            <h3>{{ s.name }}</h3>
            <span class="fact">{{ s.fact }}</span>
          </div>
          <div class="note" data-reveal>
            <p>{{ text(i) }}</p>
            <a class="link" [href]="book(s.name)" target="_blank" rel="noopener">Apartar {{ s.name.toLowerCase() }}</a>
          </div>
        </article>
      }
    </section>
  `,
  styles: `
    .panel { position: relative; height: 100svh; overflow: hidden; background: var(--surface); }
    /* La foto se ve más de cerca que su encuadre: un detalle llena la pantalla */
    img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; scale: 1.3; filter: brightness(0.9) saturate(0.95); }
    .row {
      position: absolute; left: 0; right: 0; top: 50%; translate: 0 -50%;
      display: grid; grid-template-columns: 10% 1fr auto; align-items: center; gap: 16px;
      min-height: 90px; padding-inline: var(--margin); background: var(--scrim); font-size: var(--step-small); font-weight: 600;
    }
    h3 { font-size: var(--step-lead); letter-spacing: -0.035em; }
    .note { position: absolute; left: var(--margin); bottom: var(--margin); max-width: 420px; padding: 22px 24px; background: var(--scrim); }
    .note p { margin-bottom: 14px; }

    @media (max-width: 760px) {
      .panel { height: 82svh; }
      .row { top: auto; bottom: 0; translate: none; grid-template-columns: 1fr auto; padding-block: 14px; gap: 4px 12px; }
      .row h3 { grid-column: 1 / -1; order: -1; }
      .note { left: var(--margin); right: var(--margin); bottom: auto; top: var(--margin); max-width: none; padding: 16px 18px; font-size: var(--step-small); }
    }
  `,
})
export class Sessions {
  protected readonly sessions = SESSIONS;

  protected text(i: number) {
    return CHAPTERS[i].text[0];
  }

  protected book(name: string) {
    return whatsappLink(`Hola, Inés. Me interesa una sesión de ${name.toLowerCase()}. ¿Qué fechas tienes?`);
  }
}
