let apikey = {
    key:'bc952155-bbb6-4c9f-a34a-9b8d5f45f13c'
}

const getPrice = async (cryptoCurrency) => {
    try{
        const resp = await fetch ('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=' + apikey.key)
        //console.log(resp)
        const data = await resp.json()
        //console.log(data.data)
        const datos = data.data
        //console.log(datos) 
        const cryptoElement = datos.find((ele) => ele.name === cryptoCurrency)
        //console.log(cryptoElement.quote.USD.price)
        return cryptoElement.quote.USD.price
    }catch(error){
        console.log(error)
    }
}

//creo array para portfolio
const portfolio = JSON.parse(localStorage.getItem("portfolio")) || []

//todos los tokens los recibiria por api como array de obj
//const tokens = JSON.parse(localStorage.getItem("tokens")) || []

//mensajes
const message = (message) => {
    Toastify({
        text: message,        
        duration: 2000,
        position: "center",
        style: {
            background: "#56606c",
            color: "white",
            radius: "5px",
        }
        }).showToast();
    }

//borrar
const borrar = (id) => {
    const btnBorrar = document.querySelector("#borrar" + id)
    
    btnBorrar.addEventListener("click",()=>{
        const index = portfolio.findIndex(e => e.idTransaction == id)
        portfolio.splice(index, 1)
        localStorage.setItem("portfolio", JSON.stringify(portfolio))
        const card = document.querySelector("#card" + id)
        card.remove()

        message("Transaccion eliminada")
        showBalance(balance(portfolio))
        showPyl(roi(portfolio))
        showMoney(money(portfolio))
    })
}

//funcion que crea tarjeta div
let count = 1
const listTransaction = (portfolio)=>{

    const transactionCard = document.createElement("div")
    transactionCard.className = "card"
    transactionCard.id = "card" + portfolio.idTransaction
    transactionCard.innerHTML = `
                                <h3><span>${portfolio.token}</span></h3>
                                <!-- <p><span>Ticker</span></p> -->
                                <p><span>Operación</span> <br> ${portfolio.operation}</p>
                                <p><span>Precio</span> <br> ${portfolio.price}</p>
                                <p><span>Cantidad</span> <br> ${portfolio.amount} ${portfolio.token}</p>
                                <p>$${portfolio.amount*portfolio.price}</p>
                                <!-- <button>Editar</button> -->
                                <button class="btn" id=borrar${portfolio.idTransaction}>Eliminar</button>
    `
    card.prepend(transactionCard)
    borrar(portfolio.idTransaction)
}

//selecciono id del form
const newTransaction = document.querySelector("#formTransaction")

//Crear, se podria poner en una funcion "crearTransaccon"
newTransaction.addEventListener("submit",(e) => {
    e.preventDefault() //para que no se actualice la pagina
    let idTransaction = parseInt(localStorage.getItem("idTransaction") || 0)
    const datos = e.target.children
    const transaction = {
        idTransaction,
        //symbol:datos
        token:datos["token"].value,
        operation:datos["operation"].value,
        amount:parseFloat(datos["amount"].value),
        price:parseFloat(datos["price"].value),
        date: new Date(),
    }

    //probando meter negativo el amount para la venta------------------
    let value = transaction.amount
    transaction.operation === "Venta" ? transaction['amount'] = -value : "positivo"
    //probando meter negativo el amount para la venta------------------

    count += 1
    portfolio.push(transaction)
    localStorage.setItem("portfolio", JSON.stringify(portfolio))
    newTransaction.reset()
    
    idTransaction++
    localStorage.setItem("idTransaction", idTransaction)

    listTransaction(transaction)
    message("Transacción agregada")
    showBalance(balance(portfolio))
    showPyl(roi(portfolio))
    showMoney(money(portfolio))
 })

const card = document.querySelector("#card")

portfolio.forEach((transaction)=>{
    listTransaction(transaction)
})


//P&L %
function showPyl(e) {
    const pyl = document.querySelector("#pyl")
    if(e < 0){
        pyl.className = "red"
        pyl.innerHTML = `${parseFloat(e).toFixed(2)}%`
    } else if(e > 0) {
        pyl.className = "green"
        pyl.innerHTML = `${parseFloat(e).toFixed(2)}%`
    } else {
        pyl.className = "white"
        pyl.innerHTML = `0%`
    }
}

function showMoney(e) {
    const money = document.querySelector("#money")
    if(e < 0) {
        money.className = "red"
        money.innerHTML = `$${e.toFixed(2)}`
    } else if (e > 0) {
        money.className = "green"
        money.innerHTML = `$${e.toFixed(2)}`
    } else {
        money.className = "white"
        money.innerHTML = "-"
    }
}

const btcPrice = await getPrice("Bitcoin")
//console.log(btcPrice)
const ethPrice = await getPrice("Ethereum")
const dotPrice = await getPrice("Polkadot")
const ftmPrice = await getPrice("Fantom")

//----
const roi = (portfolio) => {

    let sumaInversion = []

    let sumaBeneficio = []

    portfolio.forEach((e)=>{

        let inversion = e.amount*e.price

        let currentPrice = 0

        if(e.token == 'Bitcoin') {
            currentPrice = btcPrice
        }else if(e.token == 'Ethereum'){
            currentPrice = ethPrice
        }else if(e.token == 'Polkadot'){
            currentPrice = dotPrice
        }else if(e.token == 'Fantom'){
            currentPrice = ftmPrice
        }
        //console.log(currentPrice)
        
        let beneficio = e.amount*currentPrice
         
        //console.log(cantidad)

        sumaInversion.push(inversion)

        sumaBeneficio.push(beneficio)
        //console.log(sumaBeneficio)

    })

    let totalInversion = sumaInversion.reduce((a, c) => a + c, parseFloat(0))

    let totalBeneficio = sumaBeneficio.reduce((a, c) => a + c, parseFloat(0))

    return (parseFloat((totalBeneficio-totalInversion)/totalInversion*100))

}

const money = (portfolio) => {

    let sumaInversion = []

    let sumaBeneficio = []

    portfolio.forEach((e)=>{

        let currentPrice = 0

        if(e.token == 'Bitcoin') {
            currentPrice = btcPrice
        }else if(e.token == 'Ethereum'){
            currentPrice = ethPrice
        }else if(e.token == 'Polkadot'){
            currentPrice = dotPrice
        }else if(e.token == 'Fantom'){
            currentPrice = ftmPrice
        }
        //console.log(currentPrice)
        
        let beneficio = e.amount*currentPrice

        let inversion = e.amount*e.price

        sumaInversion.push(inversion)

        sumaBeneficio.push(beneficio)

    })

    let totalInversion = sumaInversion.reduce((a, c)=> a + c, parseFloat(0)) 

    let totalBeneficio = sumaBeneficio.reduce((a, c) => a + c, parseFloat(0))

    return (parseFloat((totalBeneficio-totalInversion)))

}


//balance
const balance = (portfolio) => {
    let sumaInversion = []

    portfolio.forEach((e) => {

        let currentPrice = 0

        if(e.token == 'Bitcoin') {
            currentPrice = btcPrice
        }else if(e.token == 'Ethereum'){
            currentPrice = ethPrice
        }else if(e.token == 'Polkadot'){
            currentPrice = dotPrice
        }else if(e.token == 'Fantom'){
            currentPrice = ftmPrice
        }

        let total = e.amount*currentPrice

        sumaInversion.push(total)
    })
    let totalInvertido = sumaInversion.reduce((a, c) => a + c, parseFloat(0))
    //console.log(totalInvertido)
    return (parseFloat(totalInvertido))
}

function showBalance (e) {
    const balance = document.querySelector("#balance")
    balance.className = ("white")    
    balance.innerHTML = (`$${e.toFixed(2)}`)
}

showBalance(balance(portfolio))
showPyl(roi(portfolio))
showMoney(money(portfolio))
