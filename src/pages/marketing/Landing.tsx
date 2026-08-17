import { Container } from '@/components/layout/Container';
import { PageStub } from '@/components/layout/PageStub';

export default function Landing() {
  return (
    <Container className="py-24">
      <PageStub title="Landing">
        The hero, the live demo, how it works, capabilities, the pricing preview and the FAQ.
      </PageStub>
    </Container>
  );
}
