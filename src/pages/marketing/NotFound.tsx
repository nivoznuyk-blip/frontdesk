import { Container } from '@/components/layout/Container';
import { PageStub } from '@/components/layout/PageStub';

export default function NotFound() {
  return (
    <Container className="py-24">
      <PageStub title="Page not found">
        This address does not match anything. The docs and the changelog are the usual next stops.
      </PageStub>
    </Container>
  );
}
