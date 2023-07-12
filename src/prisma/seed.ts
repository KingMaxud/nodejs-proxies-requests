import { PrismaClient } from '@prisma/client'

import { IPsArray } from '../utils/IPsArray'

const prisma = new PrismaClient()

async function main() {
   const resultArray = IPsArray.map(item => {
      const [ip, port] = item.split(':')
      return { ip, port, login: '', password: '' }
   })

   const deletedProxies = await prisma.proxy.deleteMany({})

   const proxies = await prisma.proxy.createMany({
      data: resultArray
   })
   console.log(proxies)
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
