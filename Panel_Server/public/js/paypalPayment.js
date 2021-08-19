

function setPayPalButton(id, serverData, type) {

  let server = serverData.server_name ? serverData.server_name : ''
  let currency = serverData.vip_currency ? serverData.vip_currency : ''
  let price = serverData.vip_price ? serverData.vip_price : ''
  let subDays = serverData.vip_days ? serverData.vip_days : ''

  if (paypalActive == true && price && currency && server) {
    paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: subDays + " days VIP for " + server + (type == 'newPurchase' ? " (New Buy)" : type == 'renewPurchase' ? " (Renewal)" : type == "newPurchaseBundle" ? " (New Buy Bundle)" : ""),
              amount: {
                currency_code: currency,
                value: price,
              },
            },
          ],
        });
      },
      onCancel: (data) => {
        showNotif({
          success: false,
          data: { "error": "Payment Failed! , Process terminated by user." }
        })
      },
      onApprove: async (data, actions) => {
        let loader = `<div class="loading">Loading&#8230;</div>`;
        $("#divForLoader").html(loader)

        showNotif({
          success: true,
          data: { "message": "Payment Sucess! , Order Id:" + data.orderID + ". Processing furture steps to activate your VIP Subscription.", "notifType": "success" }
        })

        const order = await actions.order.capture();

        afterPaymentajax({
          "serverData": serverData,
          "paymentData": order,
          "buyType": type,
          "gateway": "paypal"
        })
      },
      onError: async (error) => {

        showNotif({
          success: false,
          data: { "error": "Payment Failed! , Some Error occured try again later. Contact support if you were charged and still got error" }
        })
      },
      "style": {
        "color": "blue",
        "shape": "rect",
        "size": "responsive",
        "layout": "vertical"
      }
    })
      .render('#' + id);
  } else {
    document.getElementById(id).innerHTML = `<div class="stats text-warning">${paypalActive == true ? 'PayPal not working contact Support' : ''}</div>`
  }
}