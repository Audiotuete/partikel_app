// export default async ({ router }) => {
//   // Recebe notificações vindas do firebase cloud message
//   function onAppIsActive (data) {
//       alert('Diese Nachricht wird angezeigt, wenn die App bereits offen ist', JSON.stringify(data))
//   }
//   // mensagem de sucesso
//   function onDisplayInTopBar (msg) {
//       alert('App durch Push Notification geöffnet', JSON.stringify(msg))
//   }
//   // mensagem de erro
//   function error (msg) {
//       alert('error', msg)
//   }
//   setTimeout(() => {
//       // Listener do evento de notificação
//       window.FCMPlugin.onNotification(onAppIsActive, onDisplayInTopBar, error)
//       }, 200)
//   }