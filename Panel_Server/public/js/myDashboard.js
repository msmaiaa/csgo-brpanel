

function afterPaymentajax(formData) {

  fetch('/execafterpaymentprocess', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then((res) => { return res.json(); })
    .then((response) => {
      $("#divForLoader").html("")
      showNotif(response)
      setTimeout(function () {
        document.location.reload()
      }, 5000);
    })
    .catch(error => {
      $("#divForLoader").html("")
      showNotif({ success: false, data: { "error": error } })
    });
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 
function fetchPBundleListajax() {

  fetch('/getpanelbundleslistud', {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then((res) => { return res.json(); })
    .then((response) => {
      if (response.success == true) {

        let dataArray = response.data.res

        let htmlString = "";

        for (let i = 0; i < dataArray.length; i++) {

          let serversHtml = '', serversTblNames = []
          for (let j = 0; j < dataArray[i].bundleServersData.length; j++) {
            serversHtml += `<a href="steam://connect/${dataArray[i].bundleServersData[j].server_ip + ':' + dataArray[i].bundleServersData[j].server_port}" class="card-title text-success">
                            ${dataArray[i].bundleServersData[j].server_name}</a>
                            <br>
                            `
            serversTblNames.push(dataArray[i].bundleServersData[j].tbl_name)
          }

          let serverDataObj = {
            "id": dataArray[i].id,
            "server_ip": "-",
            "server_port": "-",
            "server_name": dataArray[i].bundle_name,
            "vip_price": dataArray[i].bundle_price,
            "vip_currency": dataArray[i].bundle_currency,
            "vip_days": dataArray[i].bundle_sub_days,
            "tbl_name": serversTblNames.join(','),
            "vip_flag": dataArray[i].bundle_flags
          }

          serverDataObj = JSON.stringify(serverDataObj)
          let tempString = dataArray[i].bundle_name;
          let idForPayPal = tempString.split(" ").join("");

          let subString = `<div class="card-footer text-primary text-center">
                            <div id="" class="col-md-12 text-center">
                              <button type="button" class="btn btn-success text-center col-md-12 m-0"
                                onclick="initPayUpayment('${serverDataObj}','newPurchase')">
                                <img src="./images/payumoney.png" height='20' alt="payu">
                              </button>
                            </div>
                          </div>`

          htmlString += `<div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                          <div class="card card-stats">
                            <div class="card-header card-header-warning card-header-icon">
                              <div class="card-icon">
                                <i class="material-icons">shopping_cart</i>
                              </div>
                              <p class="card-category">${dataArray[i].bundle_name}</p>
                              <h3 class="card-title">
                              ${dataArray[i].bundle_price + " " + dataArray[i].bundle_currency + " for " + dataArray[i].bundle_sub_days + " days in each server"}  
                              </h3>
                              ${serversHtml}
                            </div>
                            <div class="card-footer text-primary text-center">
                              <img src
                                onerror="setPayPalButton('${idForPayPal + i}','${serverDataObj}','newPurchase')"
                                alt />
                              <div id="${idForPayPal + i}" class="col-md-12 text-center">
                              </div>
                            </div>
                            ${payuActive ? subString : ''}
                          </div>
                        </div>`

        }

        document.getElementById("userDashoardServerBundleListing").innerHTML = htmlString
      }
    })
    .catch(error => {
      showNotif({ success: false, data: { "error": error } })
    });
}
//-----------------------------------------------------------------------------------------------------

function changeDivHeight() {
  let currentheight = document.getElementById("style-4").clientHeight
  if (currentheight == 330) {
    document.getElementById("style-4").style.height = "660px"
    document.getElementById("iconForArrow").textContent = "keyboard_arrow_up"
  } else {
    document.getElementById("style-4").style.height = "330px"
    document.getElementById("iconForArrow").textContent = "keyboard_arrow_down"
  }
}

//-----------------------------------------------------------------------------------------------------

$(document).ready(function () {

  // fetchPBundleListajax();
});