export default function Item ({ key, type, title, ...props }) {
  return (
    <li key={key}>
      <h3>{title}</h3>
    </li>
  )
}
