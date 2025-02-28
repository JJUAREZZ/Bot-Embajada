import {webkit} from "playwright";
import {isAfter, isBefore, parse } from "@formkit/tempo"
import cron from "node-cron"

process.loadEnvFile()

//console.log(process.env.MJ_PUBLIC_KEY, process.env.Mj_SECRET_KEY)

const browser = await webkit.launch() // abre el navegador

const task = cron.schedule("*/10 * * * * *", async () => {

    const page = await browser.newPage() // abre una pestaña nueva

    await page.goto("https://www.cgeonline.com.ar/informacion/apertura-de-citas.html")

    const table = page.locator("table") // tabla de apertuda de citas
    const pasaporteRow = table.getByText("renovación y primera vez").locator("..").//devuelve el elemento anterior al texto
    locator(".."). // tengo la row completa
    locator("td:nth-child(2)")

    const nextDate = await pasaporteRow.innerText()
    const [date]= nextDate.split(" a las ")
    const parsedDate = parse(`${date} -03:00`, "DD/MM/YYYY Z")


    if(isBefore(parsedDate, new Date())) {
        console.log( `La proxima apertura de fechas es el ${parsedDate}` )
        //envio de mail
    /* const response = await fetch("https://api.mailjet.com/v3.1/send", {



            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Buffer.from(`${process.env.MJ_PUBLIC_KEY}:${process.env.MJ_SECRET_KEY}`).toString('base64')}`
            },
            body: JSON.stringify({
                SandboxMode: false,
                Messages: [
                    {
                        From: {
                            Email: "joacojuarez1@gmail.com",
                            Name: "Me"
                        },
                        Subject: "Hay turno para pasaporte",
                        TextPart: "Greetings from Mailjet!",
                        HTMLPart: `<h3>La proxima apertura de fechas es el ${parsedDate}</h3>`,
                        To: [
                            {
                                Email: "joacojuarez1@gmail.com",
                                Name: "Joaquin Juarez"
                            }
                        ]
                        
                    }
                ]
            })
        });
        if (!response.ok) {
            console.error("Failed to send email:", response.statusText);
        } else {
            console.log("Email sent successfully!");
        }*/
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_KEY}/sendMessage?chat_id=@pasaporteLocoChannel&text=${encodeURIComponent(`La proxima apertura de fechas es el ${parsedDate}`)}`) // envio por bot de telegram

        browser.close()
        task.stop()
    } else {
        console.log("No hay fechas estipuladas")
    }

    await page.pause()
})



browser.close()