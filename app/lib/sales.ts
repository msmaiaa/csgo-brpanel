import Sale from 'models/Sale'

interface ISale {
  gateway: string
  customer_steamid: string
  payment_status: "completed" | "uncompleted"
  amount: string 
  customer_email?: string
}

export async function createSale({ gateway, customer_steamid, payment_status, amount, customer_email }: ISale) {
  try{
    const data: ISale = {
      gateway,
      customer_steamid,
      payment_status,
      amount,
    }
    customer_email ? data.customer_email = customer_email : ''
    const createdSale = await Sale.create({
      data
    })
    console.log(`New sale! User: ${createdSale.customer_steamid} | Amount: ${createdSale.amount} ${createdSale.currency}`)
  }catch(e) {
    console.error('Error createSale')
    console.error(e.message)
  }
}