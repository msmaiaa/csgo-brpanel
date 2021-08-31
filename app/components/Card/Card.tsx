import styles from './Card.module.css'

const Card = (props: any) => {
  return (
    <div className={styles.cardContainer} style={props.style}>
      <div className={styles.cardInside}>
        {props.children}
      </div>
    </div>
  )
}

export default Card