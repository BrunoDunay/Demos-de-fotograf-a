import { ChangeDetectionStrategy, Component } from '@angular/core';
import { INTERVIEW } from '../core/content';
import { Reveal } from '../shared/reveal';

/** Quién toma las fotos: su retrato, una frase suya y tres respuestas. */
@Component({
  selector: 'app-ines',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section id="ines" class="ines wrap" aria-labelledby="ines-t">
      <figure data-reveal="photo">
        <img src="media/ines.webp" alt="Inés Calvo con su cámara colgada al cuello, en un jardín" width="1000" height="1500" loading="lazy" />
      </figure>
      <div class="text">
        <h2 id="ines-t" data-reveal>Inés Calvo</h2>
        <p class="say" data-reveal [revealDelay]="80">Fotografío los primeros días desde 2017. Lo que más aprendí fue a no tener prisa: hay sesiones donde la mejor foto sale en la tercera hora.</p>
        <dl>
          @for (q of interview; track q.q; let i = $index) {
            <div data-reveal [revealDelay]="160 + i * 70">
              <dt>{{ q.q }}</dt>
              <dd>{{ q.a }}</dd>
            </div>
          }
        </dl>
      </div>
    </section>
  `,
  styles: `
    .ines { display: grid; grid-template-columns: 5fr 7fr; gap: 6vw; align-items: start; padding-block: var(--section); }
    figure { position: sticky; top: 96px; }
    img { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; filter: brightness(0.92) saturate(0.9); }
    h2 { font-size: var(--step-head); margin-bottom: 28px; }
    .say { max-width: 30ch; margin-bottom: 64px; font-size: var(--step-lead); font-weight: 600; line-height: 1.25; letter-spacing: -0.02em; }
    dl { display: grid; gap: 36px; max-width: 58ch; }
    dt { margin-bottom: 8px; font-weight: 800; }
    @media (max-width: 860px) {
      .ines { grid-template-columns: 1fr; gap: 40px; }
      figure { position: static; width: 82%; }
    }
  `,
})
export class Ines {
  protected readonly interview = INTERVIEW;
}
