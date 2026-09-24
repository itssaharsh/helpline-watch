import { Flex, Text } from '@radix-ui/themes'
import { useEffect, useRef } from 'react'
import type { LogLine } from '../lib/types'

export function LogList({ lines, running }: { lines: LogLine[]; running: boolean }) {
  const ref = useRef<HTMLOListElement>(null)
  useEffect(() => { ref.current?.lastElementChild?.scrollIntoView({ block: 'nearest' }) }, [lines.length])
  return (
    <div>
      <Text as="p" size="2" color="gray" mb="3">{running ? 'Searches as they return.' : 'Every search this sweep made, in the order it returned.'}</Text>
      <ol ref={ref} style={{ margin: 0, padding: 0, listStyle: 'none' }} aria-live="polite">
        {lines.length === 0 && <li><Text size="2" color="gray">Waiting for a sweep.</Text></li>}
        {lines.map((l, i) => (
          <li key={i} style={{ padding: '6px 0', borderBottom: '1px solid var(--gray-a4)' }}>
            <Flex gap="3" align="start">
              <Text size="1" className="num" color="gray" style={{ width: 62, flexShrink: 0 }}>{new Date(l.at).toLocaleTimeString(undefined, { hour12: false })}</Text>
              <Text size="2" style={{ color: l.kind === 'fail' ? 'var(--ruby-11)' : l.kind === 'warn' ? 'var(--amber-12)' : undefined }}>{l.text}</Text>
            </Flex>
          </li>
        ))}
      </ol>
    </div>
  )
}
