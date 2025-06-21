# Desemburaca Teresina 🕳️🚧

Sistema web para denúncia de buracos nas vias públicas de Teresina, desenvolvido como projeto acadêmico do Centro Universitário iCEV.


## 📋 Sobre o Projeto

O **Desemburaca Teresina** é uma plataforma que facilita a comunicação entre cidadãos e a prefeitura municipal para reportar problemas de infraestrutura viária. O sistema permite que os usuários fotografem buracos nas ruas e enviem denúncias com localização GPS automática, agilizando o processo de manutenção urbana.

## ✨ Funcionalidades

- 📸 **Captura de fotos** com dados GPS automáticos
- 📍 **Geolocalização precisa** dos problemas reportados
- 🗺️ **Validação geográfica** para área de Teresina
- 💾 **Armazenamento offline** para envio posterior
- 📊 **Visualização de denúncias** em tempo real
- 🔄 **Sistema de acompanhamento** do status das denúncias
- ♿ **Recursos de acessibilidade** para daltonismo

## 🛠️ Tecnologias Utilizadas

### Frontend

- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização e responsividade
- **JavaScript** - Lógica da aplicação
- **EXIF.js** - Extração de metadados de imagens
- **Turf.js** - Operações geoespaciais

### Backend/APIs

- **Repositorio com o back** - https://github.com/ditimon01/Projeto_Desemburaca_Teresina_API
- **LocationIQ API** - Geocodificação reversa
- **Railway** - Hospedagem da API
- **Google Drive API** - Armazenamento de imagens
- **PostgreSQL - Neon** - Banco de dados
- **FormSubmit** - Email de suporte

## 📁 Estrutura do Projeto

```
desemburaca-teresina/
├── app/
│   ├── home/           # Página inicial
│   ├── form/           # Formulário de denúncia
│   ├── serv/           # Visualização de serviços
│   ├── sobre/          # Informações do projeto
│   └── ajuda/          # Página de ajuda
├── assets/             # Recursos estáticos
│   ├── images/         # Imagens do projeto
│   └── icons/          # Ícones da interface
├── index.html          # Redirecionamento inicial
├── Documentação.pdf    # Documentação das princiapis partes do codigo
└── README.md

```

## 📱 Como Usar

### Para Cidadãos

1. **Acesse a página inicial** e clique em "Submeter"
2. **Preencha o formulário** com:
   - Localização do buraco
   - Tamanho aproximado
   - Descrição detalhada
3. **Tire uma foto** usando a câmera ou faça upload
4. **Envie a denúncia** - o sistema validará automaticamente a localização GPS

### Validações Automáticas

- ✅ **GPS ativo**: Foto deve conter coordenadas
- ✅ **Área válida**: Localização dentro de Teresina
- ✅ **Data válida**: Imagem deve ter timestamp
- ✅ **Conectividade**: Modo offline disponível

## 🔧 Configuração da API

O projeto utiliza APIs externas que requerem configuração:

### LocationIQ (Geocodificação)

### Backend Railway

### FormSubmit (Email)

## 📊 Funcionalidades Técnicas

### Processamento de Imagens

- Extração automática de dados EXIF
- Validação de coordenadas GPS
- Conversão de formatos de coordenadas
- Verificação de limites geográficos

### Modo Offline

- Armazenamento local com IndexedDB
- Sincronização automática quando online
- Interface adaptativa para status de conexão

### Acessibilidade

- Suporte para diferentes tipos de daltonismo
- Interface responsiva para dispositivos móveis
- Navegação por teclado

## 👥 Equipe de Desenvolvimento

| Nome                            | Função             |
| ------------------------------- | ------------------ |
| **Talyson Machado Barros**      | Frontend           |
| **Augusto César A. M. Neto**    | Frontend / Backend |
| **Ygor Jivago Leal Félix**      | Frontend / Backend |
| **Vinicius Azevedo da Fonseca** | Backend            |
| **Mateus Farias**               | Backend            |

## 🎓 Instituição

**Centro Universitário iCEV**  
Projeto acadêmico desenvolvido como parte do curso de graduação.

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos. Todos os direitos reservados à Prefeitura Municipal de Teresina - Desemburaca Teresina © 2025.

## 🔄 Status do Projeto

🚧 **Em desenvolvimento ativo** - Projeto acadêmico em fase de finalização

---

**Ajude a melhorar Teresina! Denuncie buracos e contribua para uma cidade melhor.** 🏙️✨
