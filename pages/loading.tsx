import LoaderSkeleton from "@/components/loader-skeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <LoaderSkeleton count={10} />
}