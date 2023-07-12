import { PrismaClient } from '@prisma/client'

import { articlesArray } from './utils/articlesArray'
import axios from 'axios'

const prisma = new PrismaClient()

async function main() {
   // Get all proxies
   const allProxies = await prisma.proxy.findMany()
   // Adding to them the fields necessary to select a proxy
   const proxies = allProxies.map(p => {
      return { ...p, requestCount: 0, limitRequestTime: 0 }
   })

   const data: any[] = []

   const MAX_RETRIES = 3

   // Loop through the array of articles
   for (let article of articlesArray) {
      // Skip article if there are more than 3 errors
      let errors = 0
      while (errors < MAX_RETRIES) {
         try {
            const productData = await makeRequest(article)
            data.push(productData)
            break // Break the while loop on success
         } catch (error) {
            errors++
         }
      }

      if (errors === MAX_RETRIES) {
         console.error(
            `The maximum number of attempts has been exceeded. Article ${article} passed.`
         )
      }
   }
   console.log('Requests completed')

   function selectProxy() {
      const now = Number((new Date().getTime() / 1000).toFixed())

      for (let j = 0; j < proxies.length; j++) {
         // Skip temporarily limited proxies
         if (proxies[j].limitRequestTime + 15 <= now) {
            // If the proxy was used 30 times, skip, reset the counter and temporarily limit
            if (proxies[j].requestCount === 30) {
               proxies[j].requestCount = 0
               proxies[j].limitRequestTime = Number(
                  (new Date().getTime() / 1000).toFixed()
               )
            } else {
               // Else return and increment the counter
               proxies[j].requestCount = proxies[j].requestCount + 1
               return proxies[j]
            }
         }
      }

      console.log('Waiting for 15 seconds')
      // If for the whole cycle there was not a single available proxy, we wait 15 seconds and repeat
      return new Promise(resolve => {
         setTimeout(() => {
            resolve(selectProxy())
         }, 15000)
      })
   }

   async function makeRequest(article: number) {
      const proxy = await selectProxy()

      // Simulated error
      if (Math.floor(Math.random() * 10) < 1) {
         throw new Error('The request failed')
      }

      // Simulated request
      const product = await new Promise((resolve, reject) => {
         setTimeout(() => {
            resolve('product')
         }, 10)
      })

      return product
   }
}

main()
   .then(async () => {
      await prisma.$disconnect()
   })
   .catch(async e => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
   })
