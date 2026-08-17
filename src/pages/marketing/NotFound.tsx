import { PageStub } from '@/components/layout/PageStub';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-container px-6 py-24">
      <PageStub title="Page not found">
        This address does not match anything. The docs and the changelog are the usual next stops.
      </PageStub>
    </div>
  );
}
