import { useState } from 'react';
import ContentLoader from 'react-content-loader'

export const LoaderSkeleton = (props: { count: number, isVisible?: boolean } = { count: 10, isVisible: true }) => {
  const rows = new Array(props.count).fill(null).map((_, i) => i);
  const [show, setShow] = useState(props.isVisible);
  if (show && !props.isVisible) {
    setTimeout(() => setShow(false), 500);
  }
  return (
    <div
      style={{
        width: '100%', 
        height: '100%', 
        opacity: show ? 0.4 : 0, 
        pointerEvents: show ? 'all' : 'none',
        transition: 'opacity 0.5s', 
        position: 'absolute', 
        zIndex: 3,
        marginTop: 67,
      }}
      children={rows.map(key => (
        <ContentLoader
          uniqueKey={`loader-${key}`}
          key={key}
          height={40}
          backgroundColor={`rgba(255, 255, 255, ${(1 - (key / props.count)) / 2})`}
          foregroundColor={`rgba(255, 255, 255, ${1 - (key / props.count)})`}
          animate={true}
          style={{ width: '100%' }}
        >
          <rect key={0} x="50" y="15" rx="5" ry="5" width="300" height="15" />
          <rect key={1} x="50" y="39" rx="5" ry="5" width="220" height="9" />
          <rect key={2} x="0" y="10" rx="0" ry="0" width="40" height="40" />
        </ContentLoader>
      ))}
    />
  )
}
