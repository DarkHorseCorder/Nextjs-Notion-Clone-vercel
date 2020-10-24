import styles from "./styles.module.scss";
import { useRouter } from "next/router";

const UserCard = ({ _id, email, name, bio }) => {
  const router = useRouter();

  return (
    <div className={styles.userCard} user-id={_id} onClick={ () => {
      router.push('/' + _id);
    }}>
      <h3 className="user-name">{name}</h3>  
      <p className="user-email">{email}</p>
      <p className="user-bio">{bio}</p>
    </div>
  );
};

export default UserCard;
