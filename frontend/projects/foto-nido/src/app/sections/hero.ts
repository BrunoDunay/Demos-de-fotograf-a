import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { GROWING } from '../core/content';
import { useGsap } from '../core/motion';

/**
 * Portada: "Lo pequeño dura poco" se queda fijo como el título grabado en la tapa de un álbum,
 * y abajo, en el mismo marco, el bebé crece: de la semana 31 al primer cumpleaños.
 * El cambio de foto lo marca el scroll (position: sticky, sin secuestrar la rueda).
 */
@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero" id="inicio" #hero>
      <div class="stage">
        <h1 class="title">Lo pequeño <br class="br" />dura poco</h1>
        <div class="frame">
          @for (p of photos; track p.img; let i = $index) {
            <img
              [src]="'media/' + p.img + '.webp'"
              [attr.srcset]="'media/' + p.img + '-sm.webp 700w, media/' + p.img + '.webp 1400w'"
              sizes="(max-width: 760px) 92vw, 38vw"
              [alt]="p.alt"
              width="1000"
              height="1500"
              [class.on]="active() === i"
              [attr.loading]="i < 2 ? 'eager' : 'lazy'"
              [attr.fetchpriority]="i === 0 ? 'high' : null"
            />
          }
        </div>
        <p class="age" aria-live="polite"><b>{{ photos[active()].age }}</b> {{ photos[active()].who }}</p>
        <p class="lede">Fotografía de recién nacidos, maternidad y familia en Aguascalientes. Con luz de ventana y sin prisa.</p>
        <a class="btn act" href="#reserva">Aparta tu fecha</a>
      </div>
    </section>
  `,
  styles: `
    /* Tres pantallas de recorrido para seis fotos */
    .hero { position: relative; height: 260svh; }
    .stage { position: sticky; top: 0; height: 100svh; overflow: hidden; }
    .title {
      position: absolute; z-index: 2; left: 0; right: 0; top: 96px; text-align: center;
      font-size: 7.4vw; line-height: 0.86; letter-spacing: -0.05em; pointer-events: none;
    }
    .title .br { display: none; }
    .frame { position: absolute; z-index: 1; left: 50%; bottom: 0; height: calc(100svh - 96px - 7.4vw - 28px); aspect-ratio: 2 / 3; translate: -50% 0; background: var(--surface); overflow: hidden; }
    .frame img {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
      /* Fotos un poco más oscuras y cálidas para que el dorado no pelee con ellas */
      filter: brightness(0.86) saturate(0.92);
      opacity: 0; scale: 1.06;
      transition: opacity 700ms ease, scale 2600ms var(--ease-out);
    }
    .frame img.on { opacity: 1; scale: 1; }
    .age { position: absolute; z-index: 2; right: var(--margin); bottom: 112px; width: min(26ch, 24vw); font-size: var(--step-small); text-align: right; }
    .age b { display: block; font-size: var(--step-lead); font-weight: 800; letter-spacing: -0.03em; }
    .lede { position: absolute; z-index: 2; left: var(--margin); bottom: 32px; max-width: 26ch; font-weight: 600; }
    .act { position: absolute; z-index: 2; right: var(--margin); bottom: 32px; }

    @media (max-width: 760px) {
      .hero { height: 260svh; }
      .title { top: 76px; font-size: 15vw; }
      .title .br { display: inline; }
      .frame { left: var(--margin); right: var(--margin); bottom: auto; top: calc(76px + 27vw); height: auto; max-height: calc(100svh - 76px - 27vw - 150px); margin-inline: auto; translate: none; }
      .age { right: auto; left: var(--margin); bottom: 128px; width: auto; text-align: left; }
      .age b { display: inline; margin-right: 8px; font-size: var(--step-body); }
      .lede { bottom: 82px; max-width: none; right: var(--margin); font-size: var(--step-small); }
      .act { left: var(--margin); right: var(--margin); bottom: 16px; }
    }
  `,
})
export class Hero {
  protected readonly photos = GROWING;
  protected readonly active = signal(0);
  private readonly hero = viewChild.required<ElementRef<HTMLElement>>('hero');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const { ScrollTrigger } = useGsap();
      const n = this.photos.length;
      const st = ScrollTrigger.create({
        trigger: this.hero().nativeElement,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => this.active.set(Math.min(n - 1, Math.floor(self.progress * n))),
      });
      destroyRef.onDestroy(() => st.kill());
    });
  }
}
