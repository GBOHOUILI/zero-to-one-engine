export default function ContactSection({
  contact,
}: {
  contact: { whatsapp: string };
}) {
  return (
    <section>
      <h2>Contactez-nous</h2>
      <p>WhatsApp : {contact.whatsapp}</p>
    </section>
  );
}
