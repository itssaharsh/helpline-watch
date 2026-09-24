import { Badge, Button, Card, Flex, Heading, Kbd, SegmentedControl, Skeleton, Switch, Text } from '@radix-ui/themes'
import { Mark } from './Mark'

export function Kit() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <Flex direction="column" gap="5">
        <Heading size="6">Component kit</Heading>
        <Card size="3"><Heading size="3" mb="3">Marks</Heading><div className="page"><p className="r-text">Call HDFC Bank customer care <Mark verdict="fake" landed>+91 74110 29385</Mark> for instant refund. The official toll-free line is <Mark verdict="official">1800 1600 1600</Mark>. The branch can be reached on <Mark verdict="review">033 4040 1188</Mark> and the grievance desk on <Mark verdict="official_unlisted">022 6160 6161</Mark>.</p><p className="r-text">कस्टमर केयर नंबर <Mark verdict="fake">+91 74110 29385</Mark> पर कॉल करें।</p></div></Card>
        <Card size="3"><Heading size="3" mb="3">Badges and controls</Heading><Flex gap="3" align="center" wrap="wrap"><Badge color="ruby" variant="solid">Fake</Badge><Badge color="amber" variant="soft">Check</Badge><Badge color="grass" variant="soft">Official</Badge><Badge color="grass" variant="soft">Unlisted</Badge><Badge color="gray" variant="soft" radius="full">Replay</Badge><Button highContrast>Sweep</Button><Button highContrast loading>Sweep</Button><Button variant="soft" color="gray">Mark as official</Button><Switch highContrast defaultChecked /><Kbd>Esc</Kbd></Flex><Flex mt="3"><SegmentedControl.Root size="1" defaultValue="all"><SegmentedControl.Item value="all">All</SegmentedControl.Item><SegmentedControl.Item value="fake">Fake 3</SegmentedControl.Item><SegmentedControl.Item value="review">Check 1</SegmentedControl.Item></SegmentedControl.Root></Flex></Card>
        <Card size="3"><Heading size="3" mb="3">Loading and empty</Heading><Flex direction="column" gap="2"><Skeleton width="60%" height="16px" /><Skeleton width="40%" height="12px" /></Flex><Text as="p" size="2" color="gray" mt="3">Nothing swept yet. Run a sweep to see every number a victim would be shown.</Text></Card>
        <Card size="3"><Heading size="3" mb="3">Type</Heading><Heading size="7" className="num" style={{ color: 'var(--ruby-11)' }}>+91 74110 29385</Heading><Text as="p" size="4" weight="medium">“HDFC Bank customer care number”</Text><Text as="p" size="2">Body 2. Sheets fill city by city as each search returns.</Text><Text as="p" size="1" color="gray">Size 1 gray for meta.</Text></Card>
      </Flex>
    </main>
  )
}
