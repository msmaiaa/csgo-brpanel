import Sale from 'models/Sale'

interface ISale {
  gateway: string
  customer_steamid: string
  payment_status: "completed" | "uncompleted"
  amount: string 
  customer_email?: string
  additional_info?: string
}

export async function createSale({ gateway, customer_steamid, payment_status, amount, customer_email, additional_info }: ISale) {
  try{
    const data: ISale = {
      gateway,
      customer_steamid,
      payment_status,
      amount,
    }
    customer_email ? data.customer_email = customer_email : ''
    additional_info ? data.additional_info = additional_info : ''
    const createdSale = await Sale.create({
      data
    })
  }catch(e) {
    console.error('Error createSale')
    console.error(e.message)
  }
}