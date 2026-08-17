import { Container } from '@/components/layout/Container';
import { PageStub } from '@/components/layout/PageStub';

export default function Onboarding() {
  return (
    <Container className="py-24">
      <PageStub title="Onboarding">
        Three steps: point at your docs, watch the crawl, then ask the bot a question.
      </PageStub>
    </Container>
  );
}
