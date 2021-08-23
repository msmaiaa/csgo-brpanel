
const startStripeBundlePayment = (bundleName, serverData, type) => {
  fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({bundleName: bundleName, serverData: serverData, type: type})
  })
  .then((response) => response.json())
  .then((data) => {
    window.location = data.url
  })
}

const handleStripeRenew = (serverData, type) => {
  fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({serverData, type})
  })
  .then((response) => console.log(response))
}