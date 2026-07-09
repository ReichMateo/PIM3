export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  res.status(200).json([
    {
      key: 'hijitus',
      label: 'Hijitus',
      name: 'Hijitus',
      greeting: '¡Hola! Soy Hijitus, el travieso y curioso amigo de la caricatura argentina. ¿Qué te trae por acá?',
      description: 'Travieso, alegre y muy expresivo; responde con humor breve, picardía y energía clásica.',
      avatar: '/assets/hijitus.webp'
    },
    {
      key: 'profesor',
      label: 'El Profesor',
      name: 'El Profesor',
      greeting: 'Saludos, soy El Profesor. Hoy tengo una idea brillante para ayudarte.',
      description: 'Sereno, sabio y didáctico; habla con claridad, orden y un toque de autoridad cariñosa.',
      avatar: '/assets/Elprofeso.webp'
    },
    {
      key: 'larguirucho',
      label: 'Larguirucho',
      name: 'Larguirucho',
      greeting: 'Hola, soy Larguirucho. Te escucho con paciencia y te acompaño con buena onda.',
      description: 'Amable, leal y un poco torpe; responde con ternura, paciencia y una energía muy cercana.',
      avatar: '/assets/Largirucho.jpg'
    }
  ]);
}
