export default function WhatsAppCTA({
  contact,
}: {
  contact: { whatsapp: string };
}) {
  return (
    <a
      href={`https://wa.me/${contact.whatsapp}`}
      className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded"
    >
      Discuter sur WhatsApp
    </a>
  );
}
