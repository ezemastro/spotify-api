export default function Providers ({ contextProviders = [], children }) {
  return contextProviders.reduceRight((ch, Provider) => <Provider>{ch}</Provider>, children)
}
