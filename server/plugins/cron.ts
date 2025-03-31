import { Cron } from 'croner'

export default defineNitroPlugin(() => {
  new Cron('*/5 * * * *', () => { // Run every 2 minutes
    $fetch('/api/tasks/processNotifications')
    // console.log('I am running o!')
  })
})