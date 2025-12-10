import EmbedPageClient from '@/components/embed/EmbedPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Embed Code | TourFlow',
  description: 'Get the code to embed your tour on any website.',
};

export default function Embed() {
  return <EmbedPageClient />;
}