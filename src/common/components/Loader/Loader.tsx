import styles from "./Loader.module.css"

type Props = {
  theme?: "dark" | "light"
}

export const Loader = ({ theme = "dark" }: Props) => {
  return <div className={theme === "dark" ? styles.loader : styles["loader-light"]}></div>
}
