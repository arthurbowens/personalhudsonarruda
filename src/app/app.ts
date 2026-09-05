import { Component, ElementRef, HostListener, signal, viewChild } from '@angular/core';

export interface ResultCard {
  id: string;
  name: string;
  goal: string;
  metric: string;
  detail: string;
  period: string;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  /** Substitua pelo WhatsApp real com DDI (ex: 5511999999999) */
  private readonly whatsappNumber = '5511999999999';

  private readonly resultsTrack = viewChild<ElementRef<HTMLElement>>('resultsTrack');

  readonly menuOpen = signal(false);
  readonly resultIndex = signal(0);
  readonly scrolled = signal(false);

  readonly navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Método', href: '#metodo' },
    { label: 'Resultados', href: '#resultados' },
    { label: 'Sobre', href: '#sobre' },
  ];

  readonly results: ResultCard[] = [
    {
      id: '1',
      name: 'Camila R.',
      goal: 'Emagrecimento',
      metric: '-9,4 kg',
      detail:
        'Redução de medidas e mais disposição no dia a dia, com treino e ajuste alimentar.',
      period: '12 semanas',
    },
    {
      id: '2',
      name: 'Rafael M.',
      goal: 'Hipertrofia',
      metric: '+6,2 kg',
      detail: 'Ganho de massa magra com progressão de carga e acompanhamento nutricional.',
      period: '16 semanas',
    },
    {
      id: '3',
      name: 'Juliana S.',
      goal: 'Recomposição',
      metric: '-7 cm',
      detail: 'Cintura mais definida, força aumentada e rotina sustentável fora da academia.',
      period: '10 semanas',
    },
    {
      id: '4',
      name: 'Bruno T.',
      goal: 'Emagrecimento',
      metric: '-11 kg',
      detail: 'Queima de gordura com método personalizado e suporte contínuo no WhatsApp.',
      period: '14 semanas',
    },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
  }

  whatsappUrl(customMessage?: string): string {
    const message =
      customMessage ??
      'Olá Hudson! Vi sua página e quero agendar meu treino com você. Pode me orientar?';
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  whatsappGoalUrl(goal: string): string {
    return this.whatsappUrl(
      `Olá Hudson! Tenho interesse em ${goal}. Quero agendar uma conversa para começar.`,
    );
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  prevResult(): void {
    const next = (this.resultIndex() - 1 + this.results.length) % this.results.length;
    this.goToResult(next);
    this.scrollToResult(next);
  }

  nextResult(): void {
    const next = (this.resultIndex() + 1) % this.results.length;
    this.goToResult(next);
    this.scrollToResult(next);
  }

  goToResult(index: number): void {
    this.resultIndex.set(index);
  }

  scrollResult(direction: number): void {
    const next =
      (this.resultIndex() + direction + this.results.length) % this.results.length;
    this.goToResult(next);
    this.scrollToResult(next);
  }

  scrollToResult(index: number): void {
    const track = this.resultsTrack()?.nativeElement;
    if (!track) return;
    const slide = track.children.item(index) as HTMLElement | null;
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
  }

  onResultsScroll(event: Event): void {
    const track = event.target as HTMLElement;
    const slides = Array.from(track.children) as HTMLElement[];
    if (!slides.length) return;

    const scrollLeft = track.scrollLeft;
    let closest = 0;
    let minDist = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const dist = Math.abs(slide.offsetLeft - scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = index;
      }
    });

    this.resultIndex.set(closest);
  }
}
