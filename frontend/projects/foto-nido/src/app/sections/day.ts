import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VERBS } from '../core/content';
import { Reveal } from '../shared/reveal';

/**
 * Un día de sesión, contado con un verbo por etapa. Cada verbo se queda al centro de la pantalla
 * mientras su foto pasa detrás, y lo empuja el verbo siguiente.
 */
@Component({
  selector: 'app-day',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section id="dia" aria-labelledby="dia-t">
      <h2 class="visually-hidden" id="dia-t">Un día de sesión</h2>
      <ol class="days">
        @for (v of verbs; track v.verb) {
          <li class="panel">
            <img [src]="'media/' + v.img + '.webp'" [alt]="v.alt" width="1400" height="933" loading="lazy" />
            <div class="pin"><p class="verb" aria-hidden="true">{{ v.verb }}</p></div>
            <p class="say" data-reveal><b>{{ v.time }}</b> {{ v.text }}</p>
          </li>
        }
      </ol>
    </section>
  `,
  styles: `
    .days { list-style: none; padding: 0; }
    .panel { position: relative; height: 100svh; overflow: clip; background: var(--surface); }
    /* Fotos más oscuras para que el verbo dorado se lea sobre cualquiera */
    img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: brightness(0.58) saturate(0.9); }
    .pin { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; }
    .verb {
      position: sticky; top: calc(50% - 0.45em); bottom: calc(50% - 0.45em); text-align: center;
      font-size: var(--step-display); font-weight: 800; line-height: 0.9; letter-spacing: -0.05em;
    }
    .say { position: absolute; left: var(--margin); bottom: var(--margin); max-width: 380px; padding: 18px 20px; background: var(--scrim); }
    .say b { display: block; font-size: var(--step-lead); letter-spacing: -0.03em; }
    @media (max-width: 760px) {
      .verb { font-size: 22vw; }
      /* El verbo se detiene antes de llegar al texto de abajo */
      .pin { bottom: 170px; }
      .say { right: var(--margin); max-width: none; font-size: var(--step-small); }
    }
  `,
})
export class Day {
  protected readonly verbs = VERBS;
}
