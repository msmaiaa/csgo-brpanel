import { NotificationSettings } from '.prisma/client'
import _NotificationSettings from 'models/settings/NotificationSettings'
import nodemailer from 'nodemailer'

export interface ISaleData {
  amount: string
  customer_steamid: string
  gateway: string
  gateway_order_id: string
  payment_status: 'complete' | 'incomplete' | 'failed'
  customer_email: string
  additional_info: string
  purchase_type: string
}

const generateSmtpConfig = () => {
  const data = {
    host: '',
    port: 587,
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASSWORD
  }
  if(process.env.EMAIL_PROVIDER === 'GMAIL') {
    data.host = 'smtp.gmail.com'
  }
  return data
}

const SMTP_CONFIG: any = generateSmtpConfig()
const transporter = nodemailer.createTransport({
  host: SMTP_CONFIG.host,
  port: SMTP_CONFIG.user,
  secure: false,
  auth: {
    user: SMTP_CONFIG.user,
    pass: SMTP_CONFIG.pass,
  },
  tls: {
    rejectUnauthorized: false
  }
})

export async function sendMailToCustomer (data: ISaleData, type){
  try{
    const settings = await _NotificationSettings.findOne()
    const emailData = {
      subject: 'Status de compra atualizado',
      from: `${settings.community_name} <${process.env.EMAIL_LOGIN}>`,
      to: data.customer_email,
      html: ``
    }
    emailData.html = createHtmlTemplate(data, settings, type)
    const sentMail = await transporter.sendMail({
      ...emailData
    })
    console.log('Email sent')
  }catch(error) {
    console.error('Error on sendMailToCustomer', error)
  }
}

const createHtmlTemplate = (data: ISaleData, serverData: NotificationSettings, type) => {
  switch(type) {
    case 'saleCreated': {
      return saleCreatedTemplate(data, serverData)
    }
    case 'saleFulfilled': {
      return saleFulfilledTemplate(data, serverData)
    }
    case 'saleFailed': {
      return saleFailedTemplate(data, serverData)
    }
  }
}
const saleCreatedTemplate = (data: ISaleData, serverData: NotificationSettings) => {
  return `
  <html>
    <head>
    ${styleTemplate()}
    </head>
    <body>
      <div style="width: 100%;">
        <img 
            src="${serverData.logo_url}"
            class="image"
            />
        <div class="mainContent">
          <p class="mainContent_text">Seu pedido "${data.purchase_type} - ${data.additional_info}" foi criado e nosso sistema aguarda a aprovação do pagamento para continuarmos com a compra.<p/>
        </div>
        ${footerTemplate(serverData.community_name)}
      </div>
    </body>
  </html>
  `
}

const saleFulfilledTemplate = (data: ISaleData, serverData: NotificationSettings) => {
  return `
  <html>
    <head>
    ${styleTemplate()}
    </head>
    <body>
      <div style="width: 100%;">
        <img 
            src="${serverData.logo_url}"
            class="image"
            />
        <div class="mainContent">
          <p class="mainContent_text">Seu pedido "${data.purchase_type} - ${data.additional_info}" foi aprovado e seus privilégios foram alterados.<p/>
        </div>
        ${footerTemplate(serverData.community_name)}
      </div>
    </body>
  </html>
  `
}

const saleFailedTemplate = (data: ISaleData, serverData: NotificationSettings) => {
  return `
  <html>
    <head>
    ${styleTemplate()}
    </head>
    <body>
      <div style="width: 100%;">
        <img 
            src="${serverData.logo_url}"
            class="image"
            />
        <div class="mainContent">
          <p class="mainContent_text">Seu pedido "${data.purchase_type} - ${data.additional_info}" foi cancelado e não foi possível seguir com a compra.<p/>
        </div>
        ${footerTemplate(serverData.community_name)}
      </div>
    </body>
  </html>
  `
}

const styleTemplate = () => {
  return `
    <style>
    html {
      font-family: 'Helvetica', sans-serif;
    }
    .image {
      display: block;
      margin-left: auto;
      margin-right: auto;
      width: 50px; 
      height: 50px;
    }
    .mainContent {
      background-color: #f6f6f6;
      width: 80%; 
      display: block;
      margin-left: auto;
      margin-right: auto;
      font-size: 16px;
      margin-top: 15px;
      min-height: 80px;
      padding-top: 30px;
    }
    .mainContent_text {
      text-align: center;
    }
    .footer {
    }
    .communityName {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
    }
    .credits {
      text-align: center;
    }
    </style>
  `
}

const footerTemplate = (community_name: string) => {
  return `
  <div class="footer">
    <p class="communityName">${community_name}</p>
    <p class="credits">
      Powered by 
      <a href="https://github.com/msmaiaa/csgo-brpanel" target="_blank">BRPanel</a>
    </p>
  </div>
  `
}