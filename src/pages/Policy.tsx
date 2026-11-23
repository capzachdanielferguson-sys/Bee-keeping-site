import { InfoLayout, PROSE } from '@/components/layout/InfoLayout'
import { POLICIES, type PolicyId } from '@/data/policies'
import { useDocumentTitle } from '@/lib/hooks'

export default function Policy({ id }: { id: PolicyId }) {
  const policy = POLICIES[id]
  useDocumentTitle(policy.title)
  return (
    <InfoLayout eyebrow={policy.eyebrow} title={policy.title} description={policy.summary} crumb={policy.title} seed={id.length * 7}>
      <p className="font-pixel text-[0.65rem] text-muted">Last updated {policy.updated}</p>
      <article className={`mt-6 ${PROSE}`}>{policy.body}</article>
    </InfoLayout>
  )
}
