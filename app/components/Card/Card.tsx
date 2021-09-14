import styles from './Card.module.css'

const Card = (props: any) => {
  return (
    <div className={styles.cardContainer} style={props.style}>
      {props.children}
    </div>
  )
}

export default Card