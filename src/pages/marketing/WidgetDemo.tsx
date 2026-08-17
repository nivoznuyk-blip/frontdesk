import { Container } from '@/components/layout/Container';
import { PageStub } from '@/components/layout/PageStub';

export default function WidgetDemo() {
  return (
    <Container className="py-24">
      <PageStub title="Widget demo">
        A mock third-party site with the widget installed in the corner.
      </PageStub>
    </Container>
  );
}
