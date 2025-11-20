# 🎵 Starkids Studio - Xandão Edition

Aplicação web para geração de recursos musicais educativos.

## 🚀 Funcionalidades

- **Piano** 🎹 - Gerador de acordes de piano com visualização colorida
- **Guitarra** 🎸 - Gerador de acordes de guitarra (via iframe HTML)
- **Escalas** 🎼 - Gerador de escalas musicais
- **Partituras** 📄 - Editor de partituras musicais
- **Design** 🎨 - Ferramentas de design (em desenvolvimento)
- **Podcasts** 🎙️ - Recursos para podcasts (em desenvolvimento)

## 📦 Instalação

```bash
npm install
```

## 🛠️ Desenvolvimento

```bash
npm run dev
```

## 🎨 Formatação de Código

Formatar todos os arquivos:
```bash
npm run format
```

Verificar formatação:
```bash
npm run format:check
```

## 🏗️ Build

```bash
npm run build
```

## 📝 Estrutura do Projeto

```
Studio/
├── components/          # Componentes React
│   ├── PianoGenerator.tsx
│   ├── GuitarGenerator.tsx
│   ├── ScaleGenerator.tsx
│   ├── SheetMusicGenerator.tsx
│   └── Login.tsx
├── chords/             # Arquivos HTML de acordes
├── Partitura/          # Editor de partituras
├── constants.ts        # Constantes e configurações
├── types.ts           # Definições de tipos
└── App.tsx            # Componente principal

```

## 🎨 Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS
- VexFlow (partituras)
- jsPDF (geração de PDFs)
- Lucide React (ícones)

## 📄 Licença

Projeto educacional - Starkids Music
