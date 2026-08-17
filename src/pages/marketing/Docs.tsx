import { useParams } from 'react-router-dom';
import { PageStub } from '@/components/layout/PageStub';

export default function Docs() {
  const { slug } = useParams();

  return (
    <div className="mx-auto max-w-container px-6 py-24">
      {slug ? (
        <PageStub title={slug}>The full text of this article, with the next one linked at the end.</PageStub>
      ) : (
        <PageStub title="Docs">Four short articles about setting up the bot and keeping it accurate.</PageStub>
      )}
    </div>
  );
}
