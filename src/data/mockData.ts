import type { Novel, Chapter, Comment } from '@/types/novel';

export const mockNovels: Novel[] = [
  {
    id: '1',
    title: 'Ascension Chronicles',
    slug: 'ascension-chronicles',
    description: 'Uma épica jornada de cultivo e ascensão em um mundo de artes marciais.',
    author: 'Alex Chen',
    category: 'Cultivo',
    status: 'ongoing',
    totalChapters: 25,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Digital Realm',
    slug: 'digital-realm',
    description: 'Aventuras em um mundo virtual onde a realidade e a fantasia se encontram.',
    author: 'Marina Silva',
    category: 'LitRPG',
    status: 'ongoing',
    totalChapters: 18,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    title: 'Shattered Kingdoms',
    slug: 'shattered-kingdoms',
    description: 'Uma saga de política, magia e guerra em reinos fragmentados.',
    author: 'João Santos',
    category: 'Fantasia',
    status: 'completed',
    totalChapters: 45,
    createdAt: new Date('2023-08-01'),
    updatedAt: new Date('2023-12-20'),
  },
];

export const mockChapters: Chapter[] = [
  {
    id: '1',
    novelId: '1',
    novelTitle: 'Ascension Chronicles',
    title: 'O Despertar do Qi',
    slug: 'o-despertar-do-qi',
    chapterNumber: 1,
    content: `
# O Despertar do Qi

Chen Liu abriu os olhos devagar, sentindo uma energia estranha percorrer suas veias. O jovem de dezessete anos havia passado a noite toda meditando conforme as instruções do velho mestre, mas nunca esperara que algo realmente acontecesse.

"O Qi... eu posso senti-lo," murmurou ele, observando suas mãos tremerem levemente com a nova energia.

A sala estava mergulhada na penumbra do amanhecer, e pela janela podia ver o pátio de treinamento onde outros discípulos já praticavam seus movimentos matinais. Mas hoje seria diferente. Hoje Chen Liu daria seu primeiro passo no caminho da ascensão.

*"O cultivo não é apenas sobre poder,"* lembrou-se das palavras do mestre. *"É sobre compreender a harmonia entre o céu e a terra, e encontrar seu lugar no cosmos."*

Levantou-se cuidadosamente, sentindo como o Qi circulava por seus meridianos. Era uma sensação indescritível - como se mil pequenos rios de energia fluíssem através de seu corpo. Cada respiração agora parecia conectá-lo mais profundamente ao mundo ao seu redor.

Do lado de fora, o sol começava a nascer sobre as montanhas, tingindo o céu de dourado. Era o início de uma nova era para Chen Liu, e ele mal podia esperar para descobrir até onde esse caminho o levaria.
    `,
    publishedAt: new Date('2024-01-15T10:00:00'),
    wordCount: 245,
    isPublished: true,
  },
  {
    id: '2',
    novelId: '1',
    novelTitle: 'Ascension Chronicles',
    title: 'A Primeira Lição',
    slug: 'a-primeira-licao',
    chapterNumber: 2,
    content: `
# A Primeira Lição

O mestre Huang esperava Chen Liu no pátio principal, sua figura imponente destacando-se contra o sol matinal. Seus cabelos brancos dançavam suavemente na brisa, e seus olhos profundos pareciam ver através da alma do jovem discípulo.

"Você sentiu o despertar," disse o mestre, não era uma pergunta. "Posso ver pela forma como o Qi se move ao seu redor."

Chen Liu assentiu respeitosamente. "Mestre, eu nunca imaginei que fosse assim. É como se o mundo todo tivesse mudado durante a noite."

Um sorriso quase imperceptível cruzou os lábios do velho cultivador. "O mundo não mudou, Chen Liu. Você é que começou a vê-lo como ele realmente é. Agora, vamos ver se você pode controlar essa nova percepção."

O mestre estendeu a mão, e Chen Liu pôde ver claramente como o Qi se concentrava em sua palma, formando uma esfera brilhante de energia dourada.

"A primeira lição de todo cultivador é aprender que o poder sem controle é destruição. Você deve dominar o Qi antes que ele domine você."
    `,
    publishedAt: new Date('2024-01-18T15:30:00'),
    wordCount: 195,
    isPublished: true,
  },
  {
    id: '3',
    novelId: '2',
    novelTitle: 'Digital Realm',
    title: 'Login Realizado',
    slug: 'login-realizado',
    chapterNumber: 1,
    content: `
# Login Realizado

O mundo se materializou ao redor de Maya em uma explosão de cores e sensações. Ela piscou algumas vezes, ajustando-se à súbita transição da escuridão de seu quarto para a vibrante cidade virtual de Neo-Tokyo.

"Sistema inicializado," anunciou uma voz melodiosa em sua mente. "Bem-vinda ao Digital Realm, jogadora Maya_Storm."

Ela olhou para suas mãos, agora cobertas por luvas de couro negro que brilhavam com circuitos azuis. Seu avatar havia sido cuidadosamente personalizado - cabelos violeta que caíam até os ombros, olhos cor de âmbar, e uma jaqueta que parecia feita de dados puro.

À sua frente se estendia uma metrópole impossível, onde arranha-céus de cristal se perdiam nas nuvens e veículos voadores traçavam rastros luminosos pelo céu. Hologramas dançavam no ar, anunciando quests e eventos que aconteceriam nos próximos dias.

"Primeiro login detectado," continuou o sistema. "Iniciando tutorial básico. Por favor, siga as indicações do mapa."

Maya sorriu. Depois de dois anos esperando pelo lançamento, finalmente estava dentro do jogo mais avançado já criado. E tinha a sensação de que sua vida nunca mais seria a mesma.
    `,
    publishedAt: new Date('2024-01-20T12:00:00'),
    wordCount: 230,
    isPublished: true,
  },
  {
    id: '4',
    novelId: '3',
    novelTitle: 'Shattered Kingdoms',
    title: 'A Queda de Altharos',
    slug: 'a-queda-de-altharos',
    chapterNumber: 45,
    content: `
# A Queda de Altharos

As chamas consumiam o que restava do palácio real enquanto o Rei Aldric observava seu reino desmoronar. Cinco anos de guerra haviam cobrado seu preço, e agora, no final, tudo parecia perdido.

"Meu senhor," sussurrou Sir Gareth, se aproximando com dificuldade, "as tropas de Valtheon chegaram aos portões. Temos poucos minutos antes que invadam o salão do trono."

Aldric assentiu gravemente, segurando firme a espada ancestral de sua linhagem. "Então que venham. Altharos pode cair, mas não sem honra."

Ao longe, os gritos de batalha ecoavam pelos corredores de mármore. O som de metal contra metal misturava-se aos crepitar das chamas, criando uma sinfonia sombria que marcava o fim de uma era.

"Há mais uma coisa, majestade," Gareth hesitou. "A princesa Lyanna... ela conseguiu escapar pelos túneis. Carrega consigo o Cristal da Eternidade."

Um alívio momentâneo cruzou o rosto do rei. Talvez nem tudo estivesse perdido. Enquanto o cristal existisse, haveria esperança para a restauração do reino.

As portas do salão se escancararam com um estrondo ensurdecedor.
    `,
    publishedAt: new Date('2023-12-20T18:45:00'),
    wordCount: 205,
    isPublished: true,
  },
];

export const mockComments: Comment[] = [
  {
    id: '1',
    chapterId: '1',
    author: 'Leitor_Assiduo',
    content: 'Excelente início! A descrição do despertar do Qi ficou muito envolvente.',
    createdAt: new Date('2024-01-15T11:30:00'),
  },
  {
    id: '2',
    chapterId: '1',
    author: 'FanDeCultivo',
    content: 'Finalmente uma novel de cultivo bem escrita em português! Mal posso esperar pelo próximo capítulo.',
    createdAt: new Date('2024-01-15T14:20:00'),
  },
  {
    id: '3',
    chapterId: '2',
    author: 'NovelReader2024',
    content: 'O mestre Huang parece ser um personagem muito interessante. Gostei da filosofia por trás do ensinamento.',
    createdAt: new Date('2024-01-18T16:15:00'),
  },
];