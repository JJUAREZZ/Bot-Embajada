import {webkit} from "playwright";
import {isAfter, parse } from "@formkit/tempo"

process.loadEnvFile()

console.log(process.env.MJ_PUBLIC_KEY, process.env.Mj_SECRET_KEY)

const browser = await webkit.launch() // abre el navegador
const page = await browser.newPage() // abre una pestaña nueva

await page.goto("https://www.cgeonline.com.ar/informacion/apertura-de-citas.html")

const table = page.locator("table") // tabla de apertuda de citas
const pasaporteRow = table.getByText("renovación y primera vez").locator("..").//devuelve el elemento anterior al texto
locator(".."). // tengo la row completa
locator("td:nth-child(2)")

const nextDate = await pasaporteRow.innerText()
const [date]= nextDate.split(" a las ")
const parsedDate = parse(`${date} -03:00`, "DD/MM/YYYY Z")


if(isAfter(parsedDate, new Date())) {
    console.log( `La proxima apertura de fechas es el ${parsedDate}` )
    
} else {
    console.log("No hay fechas estipuladas")
}

//*await page.pause()

browser.close()