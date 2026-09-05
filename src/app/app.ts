import { Component, ElementRef, HostListener, signal, viewChild } from '@angular/core';

export interface ResultPhoto {
  id: string;
  image: string;
  name: string;
  goal: string;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly whatsappNumber = '5511951785732';

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

  /** Troque os SVGs por fotos reais dos alunos em /public/resultados/ */
  readonly results: ResultPhoto[] = [
    { id: '1', image: '/resultados/1.svg', name: 'Aluno 1', goal: 'Emagrecimento' },
    { id: '2', image: '/resultados/2.svg', name: 'Aluno 2', goal: 'Hipertrofia' },
    { id: '3', image: '/resultados/3.svg', name: 'Aluno 3', goal: 'Recomposição' },
    { id: '4', image: '/resultados/4.svg', name: 'Aluno 4', goal: 'Emagrecimento' },
    { id: '5', image: '/resultados/5.svg', name: 'Aluno 5', goal: 'Hipertrofia' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
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
    this.scrollResult(-1);
  }

  nextResult(): void {
    this.scrollResult(1);
  }

  goToResult(index: number): void {
    this.resultIndex.set(index);
    this.scrollToResult(index);
  }

  scrollResult(direction: number): void {
    const next =
      (this.resultIndex() + direction + this.results.length) % this.results.length;
    this.resultIndex.set(next);
    this.scrollToResult(next);
  }

  scrollToResult(index: number): void {
    const track = this.resultsTrack()?.nativeElement;
    if (!track) return;
    const slide = track.children.item(index) as HTMLElement | null;
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft - 16, behavior: 'smooth' });
  }

  onResultsScroll(event: Event): void {
    const track = event.target as HTMLElement;
    const slides = Array.from(track.children) as HTMLElement[];
    if (!slides.length) return;

    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let minDist = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
      const dist = Math.abs(slideCenter - center);
      if (dist < minDist) {
        minDist = dist;
        closest = index;
      }
    });

    this.resultIndex.set(closest);
  }
}
