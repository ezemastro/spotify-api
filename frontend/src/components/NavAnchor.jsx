import { Link } from 'react-router-dom'

export default function NavAnchor ({ to, children, type }) {
  // TODO - type for styling
  type = 0
  return (
    <Link to={to}>{children}</Link>
  )
}
