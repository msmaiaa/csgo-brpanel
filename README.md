# BRPanel  
Painel de gerenciamento de servidores de __csgo__

## Funcionalidades do painel (em desenvolvimento)
- Sistema de login e autorização através da steam
- Criação de cargos para um ou mais servidores (baseado em flags)
- Adicionar/alterar cargos de usuários através do painel
- Alterar permissões dos usuários do painel 
- Adicionar/alterar servidores
- Venda de cargos utilizando pagseguro
- Histórico de vendas
- Logs (alterações no sistema)
- Suporta criação de temas
- Configurar notificações

### Funcionalidades do bot (em desenvolvimento)
- Verificar cargos que acabaram e removê-los do banco de dados
- Comando /monitorserver <ip> (monitora o server e edita a mensagem com as informações atualizadas a cada x minutos)

### Imagens do painel [aqui](https://github.com/msmaiaa/csgo-brpanel/tree/main/pics/README.md)

## Requisitos
### Painel/bot
- MySQL Server
- NodeJS 14.x +
### Plugin
- Sourcemod 1.9 +

## Instalação
Primeiro, clone o projeto  
`
git clone https://github.com/msmaiaa/csgo-brpanel.git
`
Agora, a partir da pasta "app", crie um arquivo .env (somente .env) e preencha com os seguintes dados de exemplo:
```
PORT=3000 //  porta que o painel irá escutar
DOMAIN_DEV=http://localhost:3000 // domínio em desenvolvimento (SEM BARRA NO FINAL!)
DOMAIN_PROD=https://www.site.com // domínio em produção (SEM BARRA NO FINAL!)
SESSION_SECRET=AOPKAOPI4K$jiJAI3LFPGKLFPODGKDFPOGKDFPOGKFDPOGKD //  string de no mínimo 32 caracteres
STEAM_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXX // https://steamcommunity.com/dev/apikey
JWT_KEY=AOPKAOPI4K$jiJAI3LFPGKLFPODGKDFPOGKDFPOGKFDPOGKD // string de no mínimo 32 caracteres
APP_ENV="production"  //  em produção? "production", em desenvolvimento? "development", é importante colocar corretamente

PAGSEGURO_TOKEN="XXXXXXXXXXXXXXXXXXXXXXXXXXX" //  https://faq.pagseguro.uol.com.br/duvida/como-gerar-token-para-integracao-com-o-site/841
PAGSEGURO_EMAIL="john@mail.com" //  email da sua conta do pagseguro

DATABASE_URL="mysql://login:senha@localhost:3306/brpanel" //  url de conexão ao banco de dados
SUPERADMIN="STEAM_0:1:16861077" //  essa pessoa irá automaticamente se tornar admin ao logar pela primeira vez no painel, coloque seu steamid

EMAIL_LOGIN=email@gmail.com //  login de email do gmail
EMAIL_PASSWORD=senha  //  senha da conta do gmail
EMAIL_PROVIDER=GMAIL //
```

Após criar o arquivo .env, execute os seguintes comandos:
```
npm install
npm run database:setup
```
Para rodar em desenvolvimento:
`
npm run dev
`
Para buildar e rodar em produção
```
npm run build
npm start
```
Agora para instalar o bot é o mesmo processo do painel, crie um arquivo .env e em seguida execute os comandos  
.env:
```
BOT_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXX // token do bot
CLIENT_ID="887839046313836544"  // id do bot(application id)
GUILD_ID="633870378514776065" //  id do seu grupo do discord

DB_HOST="127.0.0.1" // ip do banco de dados
DB_PORT=3306 // porta do banco de dados
DB_USER="pepe"  //  login do banco de dados
DB_PASSWORD="senha" // senha do banco de dados
```
`
  npm install
`
Para rodar em desenvolvimento:
`
npm run dev  
`
Para buildar e rodar em produção:
```
npm run build
npm start
```
Para configurar o plugin no servidor você deve inserir esses campos no database.cfg
```
	"brpanel"
	{
		"driver"        "mysql"
		"host"          "hostname"
		"database"      "nome_db_aqui"
		"user"          "usuario"
		"pass"          "senha"
		//"timeout"     "0"
		//"port"        "0" 
	}
```
Ao executar o plugin pela primeira vez o arquivo de configuração na pasta cfg/sourcemod/ será criado e você deverá colocar o nome do servidor no campo "sm_serverName" (igual ao nome único que você irá criar ao adicionar um servidor no painel)
