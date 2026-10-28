import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LETTERS } from '../core/content';
import { Reveal } from '../shared/reveal';

/** Cartas de familias: cada una con la foto de su sesión, alternando de lado. */
@Component({
  selector: 'app-letters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section id="cartas" class="letters wrap" aria-labelledby="cartas-t">
      <h2 id="cartas-t" data-reveal>Cartas</h2>
      @for (l of letters; track l.name; let i = $index) {
        <figure class="letter" [class.flip]="i % 2 === 1">
          <img [src]="'media/' + l.img + '-sm.webp'" [alt]="'Foto de la sesión de ' + l.name" width="700" height="875" loading="lazy" data-reveal="photo" />
          <div class="words">
            <blockquote data-reveal [revealDelay]="90">{{ l.text }}</blockquote>
            <figcaption data-reveal [revealDelay]="160"><b>{{ l.name }}</b> {{ l.session }}</figcaption>
          </div>
        </figure>
      }
    </section>
  `,
  styles: `
    .letters { padding-block: var(--section); background: var(--surface); }
    h2 { font-size: var(--step-display); margin-bottom: 96px; }
    .letter { display: grid; grid-template-columns: 32vw 1fr; gap: 6vw; align-items: center; }
    .letter + .letter { margin-top: 120px; }
    .letter.flip { grid-template-columns: 1fr 32vw; }
    .letter.flip img { order: 2; }
    .letter.flip .words { justify-self: end; }
    img { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; filter: brightness(0.9) saturate(0.9); }
    .words { max-width: 30ch; }
    blockquote { font-size: var(--step-lead); font-weight: 600; line-height: 1.25; letter-spacing: -0.02em; }
    figcaption { margin-top: 20px; font-size: var(--step-small); color: var(--muted); }
    figcaption b { display: block; color: var(--ink); font-size: var(--step-body); }
    @media (max-width: 760px) {
      h2 { font-size: 16vw; margin-bottom: 56px; }
      .letter, .letter.flip { grid-template-columns: 1fr; gap: 20px; }
      .letter + .letter { margin-top: 72px; }
      img { width: 72%; }
      .letter.flip img { order: 0; justify-self: end; }
      .letter.flip .words { justify-self: end; text-align: right; }
    }
  `,
})
export class Letters {
  protected readonly letters = LETTERS;
}
