export function buildWhatsAppMessage(items: any[]) {
  const lines = items.map(
    (item) => `• ${item.name} - $${item.price}`
  )

  return encodeURIComponent(
    `Hola! Quiero hacer este pedido:\n\n${lines.join('\n')}`
  )
}
