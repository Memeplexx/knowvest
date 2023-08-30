import ContentLoader from 'react-content-loader'
import { Container } from './styles';

const LoaderSkeleton = (props: { count: number } = { count: 10 }) => {
  const rows = new Array(props.count).fill(null).map((_, i) => i);
  // const [rows, setRows] = useState(new Array<number>());
  // const ref = useRef<HTMLDivElement | null>(null);
  // useIsomorphicLayoutEffect(() => {
  //   // console.log('......', );
  //   // const count = Math.floor(ref.current!.offsetHeight / 40);
  //   // console.log(count);
  //   const count = 15;
  //   setRows(new Array(count).fill(null).map((_, i) => i))
  // }, [])
  return (
    <Container
      // ref={ref}
      children={rows.map(key => (
        <ContentLoader
          // {...props}
          key={key}
          height={40}
          backgroundColor={`rgba(255, 255, 255, ${(1 - (key / props.count)) / 2})`}
          foregroundColor={`rgba(255, 255, 255, ${1 - (key / props.count)})`}
          animate={true}
          style={{ width: '100%' }}
        >
          <rect x="50" y="15" rx="5" ry="5" width="300" height="15" />
          <rect x="50" y="39" rx="5" ry="5" width="220" height="9" />
          <rect x="0" y="10" rx="0" ry="0" width="40" height="40" />
        </ContentLoader>
      ))}
    />
  )
}

export default LoaderSkeleton;