export const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#sobre', label: 'Sobre nós' },
] as const;

export const SERVICES = [
  {
    num: '01',
    title: 'Sistemas',
    description:
      'Plataformas sob medida para organizar processos internos, integrar áreas e tirar planilhas soltas da equação.',
    tag: '→ gestão, automação, integração',
  },
  {
    num: '02',
    title: 'Apps',
    description:
      'Aplicativos mobile pensados do fluxo do usuário para trás — nada de tela bonita que ninguém sabe usar.',
    tag: '→ iOS, Android, multiplataforma',
  },
  {
    num: '03',
    title: 'Sites',
    description:
      'Presença digital rápida, responsiva e fácil de manter — do institucional simples ao e-commerce completo.',
    tag: '→ institucional, landing page, loja',
  },
  {
    num: '04',
    title: 'Softwares',
    description:
      'Ferramentas específicas para um problema específico do seu negócio, feitas sob encomenda.',
    tag: '→ automação, ferramentas internas, APIs',
  },
] as const;

export const PROJECTS = [
  { id: '01', title: 'Projeto 01', subtitle: 'sistema · em produção' },
  { id: '02', title: 'Projeto 02', subtitle: 'app · em produção' },
  { id: '03', title: 'Projeto 03', subtitle: 'site · em produção' },
] as const;

export const FOUNDERS = [
  {
    name: 'Sanderson',
    role: 'co-fundador',
    avatar: '/assets/avatar-sanderson-clean.png',
    bio: 'Cuida da ponte entre o que o cliente precisa e o que a gente constrói — do primeiro papo até a entrega final.',
  },
  {
    name: 'Caio',
    role: 'co-fundador',
    avatar: '/assets/avatar-caio-clean.png',
    bio: 'Põe a mão no código: arquitetura, integrações e a parte técnica que faz tudo funcionar nos bastidores.',
  },
] as const;

export const TAGS = [
  { color: 'green', label: 'Sistemas' },
  { color: 'orange', label: 'Apps' },
  { color: 'blue', label: 'Sites' },
  { color: 'green', label: 'Softwares' },
] as const;

export const PRELOADER_LETTERS = {
  up: [
    { src: '/assets/loader/Letra_B.svg', alt: '' },
    { src: '/assets/loader/Letra_R.svg', alt: '' },
    { src: '/assets/loader/Letra_O.svg', alt: '' },
    { src: '/assets/loader/Letra_t.svg', alt: '' },
    { src: '/assets/loader/Letra_h-1.svg', alt: '' },
    { src: '/assets/loader/Letra_e-1.svg', alt: '' },
    { src: '/assets/loader/Letra_R-1.svg', alt: '' },
    { src: '/assets/loader/Letra_s.svg', alt: '' },
  ],
  down: [
    { src: '/assets/loader/Letra_t_v2.svg', alt: '' },
    { src: '/assets/loader/Letra_e.svg', alt: '' },
    { src: '/assets/loader/Letra_C.svg', alt: '' },
    { src: '/assets/loader/Letra_h.svg', alt: '' },
  ],
} as const;
