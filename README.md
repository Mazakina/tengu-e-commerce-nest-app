# Tengu-Drip

![GitHub repo size](https://img.shields.io/github/repo-size/iuricode/README-template?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/iuricode/README-template?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/iuricode/README-template?style=for-the-badge)
![Bitbucket open issues](https://img.shields.io/bitbucket/issues/iuricode/README-template?style=for-the-badge)
![Bitbucket open pull requests](https://img.shields.io/bitbucket/pr-raw/iuricode/README-template?style=for-the-badge)

<img src="imagem.png" alt="Tengu-Drip" style="width: 100%; height: auto;">

**Tengu-Drip** é uma plataforma de e-commerce desenvolvida com NestJS, focada em oferecer uma experiência de compra robusta e escalável. Com uma arquitetura sólida, a aplicação integra funcionalidades modernas como cache Redis, banco de dados Postgres via Prisma, e uma infraestrutura de testes abrangente para garantir qualidade e confiabilidade.

## Arquitetura

O **Tengu-Drip** foi desenvolvido seguindo os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, o que garante um código modular, flexível e de fácil manutenção. A separação clara de responsabilidades entre as camadas facilita a escalabilidade e a integração de novas funcionalidades, ao mesmo tempo que mantém a base de código organizada.

### Principais Camadas da Arquitetura

- **Camada de Domínio**: Contém as regras de negócio fundamentais e as entidades do domínio. Esta camada é independente de frameworks e bibliotecas externas, garantindo que o core do sistema esteja isolado de detalhes de implementação.

- **Camada de Aplicação**: Responsável por orquestrar as operações de negócio, aplicando os casos de uso do sistema. Esta camada utiliza os serviços e repositórios para executar as regras de negócio, mantendo a lógica de aplicação separada dos detalhes de infraestrutura.

- **Camada de Infraestrutura**: Implementa detalhes técnicos como persistência de dados, comunicação com APIs externas, e integrações com bibliotecas de terceiros. Utiliza o Prisma como ORM para comunicação com o banco de dados Postgres e o Redis para cache.

- **Camada de Interface de Usuário**: Exponibiliza APIs REST para interação com o frontend, seguindo os princípios de Clean Architecture para manter a interface desacoplada do core do sistema.

### Vantagens da Arquitetura Utilizada

- **Facilidade de Manutenção**: Com uma estrutura de código bem definida, é mais fácil manter e evoluir a aplicação ao longo do tempo.
- **Testabilidade**: A separação de responsabilidades permite a criação de testes unitários e de integração mais precisos e eficazes.
- **Escalabilidade**: A modularidade facilita a adição de novas funcionalidades e a adaptação do sistema para diferentes cenários de uso.

## Funcionalidades Principais

- **Catálogo de Produtos**: Navegação e pesquisa eficientes através de um catálogo extensivo de produtos.
- **Carrinho de Compras**: Adicione, remova e edite itens com uma interface de usuário fluida.
- **Processamento de Pedidos**: Integração com plataformas de pagamento e geração de pedidos segura e confiável.
- **Gestão de Usuários**: Autenticação e autorização robustas, com suporte a JWT e OAuth.
- **Cache Redis**: Melhor performance e tempo de resposta com armazenamento em cache.

## Tecnologias Utilizadas

- **NestJS**: Framework para construção da aplicação backend.
- **Prisma**: ORM moderno e eficiente para o banco de dados Postgres.
- **PostgreSQL**: Banco de dados relacional utilizado para persistência de dados.
- **Redis**: Cache distribuído para melhorar a performance e a escalabilidade.
- **Jest**: Framework de testes utilizado para garantir a qualidade do código.

## Ajustes e Melhorias

O projeto está em constante desenvolvimento, com novas funcionalidades e melhorias sendo adicionadas regularmente. Aqui estão algumas das próximas etapas:

- [x] Desenvolvimento da Infraestrutura da aplicação
- [x] Implementação do Banco de Dados (Prisma/Postgres)
- [x] Cobertura de Testes Unitários e E2E
- [x] Implementação de Armazenamento em Cache (Redis)
- [ ] Integração com Plataforma de Pagamento
- [ ] Testes para Novas Features

## 🚀 Como Contribuir

Se você quiser contribuir com o desenvolvimento do **Tengu-Drip**, siga os passos abaixo:

1. **Fork o repositório**
2. **Crie uma branch** para a sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit as suas mudanças** (`git commit -m 'Adiciona minha nova feature'`)
4. **Envie para a branch** (`git push origin feature/MinhaFeature`)
5. **Abra um Pull Request**

## 📝 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

  